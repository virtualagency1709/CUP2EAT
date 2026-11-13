import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getCurrentAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const db = getDb();
    const { searchParams } = new URL(req.url);

    const search = searchParams.get('search');
    const category = searchParams.get('category');
    const flavour = searchParams.get('flavour');
    const featured = searchParams.get('featured');
    const bestSeller = searchParams.get('bestseller');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const sort = searchParams.get('sort') || 'popularity'; // popularity, price_asc, price_desc, rating, newest

    let query = `
      SELECT p.*, c.name as category_name, c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (search) {
      query += ` AND (p.name LIKE ? OR p.description LIKE ? OR p.tagline LIKE ?)`;
      const term = `%${search}%`;
      params.push(term, term, term);
    }

    if (category && category !== 'all') {
      query += ` AND (c.slug = ? OR c.id = ?)`;
      params.push(category, category);
    }

    if (featured === 'true' || featured === '1') {
      query += ` AND p.is_featured = 1`;
    }

    if (bestSeller === 'true' || bestSeller === '1') {
      query += ` AND p.is_best_seller = 1`;
    }

    if (minPrice) {
      query += ` AND COALESCE(p.sale_price, p.base_price) >= ?`;
      params.push(Number(minPrice));
    }

    if (maxPrice) {
      query += ` AND COALESCE(p.sale_price, p.base_price) <= ?`;
      params.push(Number(maxPrice));
    }

    // Sorting
    switch (sort) {
      case 'price_asc':
        query += ` ORDER BY COALESCE(p.sale_price, p.base_price) ASC`;
        break;
      case 'price_desc':
        query += ` ORDER BY COALESCE(p.sale_price, p.base_price) DESC`;
        break;
      case 'rating':
        query += ` ORDER BY p.rating DESC, p.review_count DESC`;
        break;
      case 'newest':
        query += ` ORDER BY p.created_at DESC`;
        break;
      case 'popularity':
      default:
        query += ` ORDER BY p.is_best_seller DESC, p.rating DESC, p.review_count DESC`;
        break;
    }

    const rawProducts = db.prepare(query).all(...params) as any[];

    // Fetch images and variants for each product
    const products = rawProducts.map((p) => {
      const images = db.prepare(`
        SELECT id, url, alt, is_primary, sort_order
        FROM product_images
        WHERE product_id = ?
        ORDER BY is_primary DESC, sort_order ASC
      `).all(p.id) as any[];

      const variants = db.prepare(`
        SELECT v.*, f.name as flavour_name, f.color as flavour_color
        FROM product_variants v
        LEFT JOIN flavours f ON v.flavour_id = f.id
        WHERE v.product_id = ?
      `).all(p.id) as any[];

      return {
        id: p.id,
        name: p.name,
        slug: p.slug,
        tagline: p.tagline,
        description: p.description,
        shortDescription: p.short_description,
        categoryId: p.category_id,
        category: {
          id: p.category_id,
          name: p.category_name,
          slug: p.category_slug,
        },
        basePrice: p.base_price,
        salePrice: p.sale_price,
        discountPercent: p.discount_percent,
        sku: p.sku,
        stock: p.stock,
        isAvailable: Boolean(p.is_available),
        isFeatured: Boolean(p.is_featured),
        isBestSeller: Boolean(p.is_best_seller),
        rating: p.rating,
        reviewCount: p.review_count,
        packSize: p.pack_size,
        shelfLife: p.shelf_life,
        temperature: p.temperature,
        ingredients: p.ingredients,
        nutritionalInfo: p.nutritional_info,
        images: images.length > 0 ? images : [{ id: 'default', url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=900&q=80', alt: p.name, is_primary: 1 }],
        variants: variants.map((v) => ({
          id: v.id,
          packSize: v.pack_size,
          price: v.price,
          salePrice: v.sale_price,
          stock: v.stock,
          flavour: v.flavour_name ? { id: v.flavour_id, name: v.flavour_name, color: v.flavour_color } : null,
        })),
      };
    });

    // If flavour filter is specified, filter in memory based on variants/name
    let filtered = products;
    if (flavour && flavour !== 'all') {
      filtered = products.filter(
        (p) =>
          p.variants?.some((v) => v.flavour?.name.toLowerCase().includes(flavour.toLowerCase())) ||
          p.name.toLowerCase().includes(flavour.toLowerCase())
      );
    }

    return NextResponse.json({ products: filtered });
  } catch (err: any) {
    console.error('Error fetching products:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 401 });
    }

    const body = await req.json();
    const {
      name,
      slug,
      tagline,
      description,
      shortDescription,
      categoryId,
      basePrice,
      salePrice,
      sku,
      stock,
      packSize,
      imageUrl,
      isFeatured,
      isBestSeller
    } = body;

    if (!name || !basePrice || !categoryId) {
      return NextResponse.json({ error: 'Name, base price, and category are required' }, { status: 400 });
    }

    const productSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const productSku = sku || `C2E-${Date.now().toString().slice(-6)}`;
    const id = `prod-${Date.now()}`;
    const discount = salePrice && basePrice > salePrice ? Math.round(((basePrice - salePrice) / basePrice) * 100) : 0;

    const db = getDb();

    db.prepare(`
      INSERT INTO products (
        id, name, slug, tagline, description, short_description, category_id,
        base_price, sale_price, discount_percent, sku, stock, is_available,
        is_featured, is_best_seller, pack_size
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?,
        ?, ?, ?
      )
    `).run(
      id, name, productSlug, tagline || '', description || '', shortDescription || '', categoryId,
      Number(basePrice), salePrice ? Number(salePrice) : null, discount, productSku, Number(stock || 50), 1,
      isFeatured ? 1 : 0, isBestSeller ? 1 : 0, packSize || 'Pack of 4'
    );

    // Insert Image
    const imgUrl = imageUrl || 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=900&q=80';
    db.prepare(`
      INSERT INTO product_images (id, product_id, url, alt, is_primary, sort_order)
      VALUES (?, ?, ?, ?, 1, 0)
    `).run(`img-${id}-1`, id, imgUrl, name);

    // Insert Inventory
    db.prepare(`
      INSERT INTO inventory (id, product_id, stock_quantity, safety_stock, reorder_level, status)
      VALUES (?, ?, ?, 10, 15, 'IN_STOCK')
    `).run(`inv-${id}`, id, Number(stock || 50));

    return NextResponse.json({ success: true, id, slug: productSlug });
  } catch (err: any) {
    console.error('Error creating product:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
