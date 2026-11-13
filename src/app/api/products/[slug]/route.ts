import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getCurrentAdmin } from '@/lib/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    const db = getDb();

    const product = db.prepare(`
      SELECT p.*, c.name as category_name, c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.slug = ? OR p.id = ?
    `).get(slug, slug) as any;

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const images = db.prepare(`
      SELECT id, url, alt, is_primary, sort_order
      FROM product_images
      WHERE product_id = ?
      ORDER BY is_primary DESC, sort_order ASC
    `).all(product.id) as any[];

    const variants = db.prepare(`
      SELECT v.*, f.name as flavour_name, f.color as flavour_color
      FROM product_variants v
      LEFT JOIN flavours f ON v.flavour_id = f.id
      WHERE v.product_id = ?
    `).all(product.id) as any[];

    const reviews = db.prepare(`
      SELECT *
      FROM reviews
      WHERE product_id = ? AND is_approved = 1
      ORDER BY created_at DESC
    `).all(product.id) as any[];

    // Fetch related products from the same category
    const related = db.prepare(`
      SELECT p.id, p.name, p.slug, p.base_price, p.sale_price, p.rating, p.pack_size
      FROM products p
      WHERE p.category_id = ? AND p.id != ?
      LIMIT 4
    `).all(product.category_id, product.id) as any[];

    const relatedWithImages = related.map((r) => {
      const img = db.prepare(`
        SELECT url FROM product_images WHERE product_id = ? AND is_primary = 1
      `).get(r.id) as any;
      return {
        ...r,
        imageUrl: img?.url || 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=900&q=80',
      };
    });

    return NextResponse.json({
      product: {
        id: product.id,
        name: product.name,
        slug: product.slug,
        tagline: product.tagline,
        description: product.description,
        shortDescription: product.short_description,
        categoryId: product.category_id,
        category: {
          id: product.category_id,
          name: product.category_name,
          slug: product.category_slug,
        },
        basePrice: product.base_price,
        salePrice: product.sale_price,
        discountPercent: product.discount_percent,
        sku: product.sku,
        stock: product.stock,
        isAvailable: Boolean(product.is_available),
        isFeatured: Boolean(product.is_featured),
        isBestSeller: Boolean(product.is_best_seller),
        rating: product.rating,
        reviewCount: product.review_count,
        packSize: product.pack_size,
        shelfLife: product.shelf_life,
        temperature: product.temperature,
        ingredients: product.ingredients,
        nutritionalInfo: product.nutritional_info,
        images: images.length > 0 ? images : [{ id: 'default', url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=900&q=80', alt: product.name, is_primary: 1 }],
        variants: variants.map((v) => ({
          id: v.id,
          packSize: v.pack_size,
          price: v.price,
          salePrice: v.sale_price,
          stock: v.stock,
          flavour: v.flavour_name ? { id: v.flavour_id, name: v.flavour_name, color: v.flavour_color } : null,
        })),
        reviews,
      },
      related: relatedWithImages,
    });
  } catch (err: any) {
    console.error('Error fetching product details:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized: Admin required' }, { status: 401 });
    }

    const { slug } = params;
    const body = await req.json();
    const db = getDb();

    const existing = db.prepare('SELECT id FROM products WHERE slug = ? OR id = ?').get(slug, slug) as any;
    if (!existing) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const {
      name,
      basePrice,
      salePrice,
      stock,
      description,
      tagline,
      packSize,
      isFeatured,
      isBestSeller,
      isAvailable
    } = body;

    const discount = salePrice && basePrice > salePrice ? Math.round(((basePrice - salePrice) / basePrice) * 100) : 0;

    db.prepare(`
      UPDATE products
      SET name = COALESCE(?, name),
          base_price = COALESCE(?, base_price),
          sale_price = ?,
          discount_percent = ?,
          stock = COALESCE(?, stock),
          description = COALESCE(?, description),
          tagline = COALESCE(?, tagline),
          pack_size = COALESCE(?, pack_size),
          is_featured = COALESCE(?, is_featured),
          is_best_seller = COALESCE(?, is_best_seller),
          is_available = COALESCE(?, is_available),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      name,
      basePrice ? Number(basePrice) : null,
      salePrice !== undefined ? (salePrice ? Number(salePrice) : null) : null,
      discount,
      stock !== undefined ? Number(stock) : null,
      description,
      tagline,
      packSize,
      isFeatured !== undefined ? (isFeatured ? 1 : 0) : null,
      isBestSeller !== undefined ? (isBestSeller ? 1 : 0) : null,
      isAvailable !== undefined ? (isAvailable ? 1 : 0) : null,
      existing.id
    );

    // Update inventory table
    if (stock !== undefined) {
      db.prepare(`
        UPDATE inventory
        SET stock_quantity = ?,
            status = CASE WHEN ? <= 0 THEN 'OUT_OF_STOCK' WHEN ? <= safety_stock THEN 'LOW_STOCK' ELSE 'IN_STOCK' END,
            updated_at = CURRENT_TIMESTAMP
        WHERE product_id = ?
      `).run(Number(stock), Number(stock), Number(stock), existing.id);
    }

    return NextResponse.json({ success: true, message: 'Product updated successfully' });
  } catch (err: any) {
    console.error('Error updating product:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized: Admin required' }, { status: 401 });
    }

    const { slug } = params;
    const db = getDb();

    const existing = db.prepare('SELECT id FROM products WHERE slug = ? OR id = ?').get(slug, slug) as any;
    if (!existing) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    db.prepare('DELETE FROM products WHERE id = ?').run(existing.id);
    return NextResponse.json({ success: true, message: 'Product deleted successfully' });
  } catch (err: any) {
    console.error('Error deleting product:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

