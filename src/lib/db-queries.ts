import { getDb } from './db';
import { Product } from './types';

export interface HomepageData {
  products: Product[];
  categories: any[];
  flavours: any[];
  reviews: any[];
}

export function getHomepageData(): HomepageData {
  const db = getDb();

  const rawProducts = db.prepare(`
    SELECT p.*, c.name as category_name, c.slug as category_slug
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    ORDER BY p.is_best_seller DESC, p.rating DESC
  `).all() as any[];

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

  const categories = db.prepare(`
    SELECT c.*, (SELECT COUNT(id) FROM products WHERE category_id = c.id) as product_count
    FROM categories c
    ORDER BY c.sort_order ASC
  `).all() as any[];

  const flavours = db.prepare(`
    SELECT * FROM flavours ORDER BY is_popular DESC, name ASC
  `).all() as any[];

  const reviews = db.prepare(`
    SELECT r.*, p.name as product_name, p.slug as product_slug
    FROM reviews r
    JOIN products p ON r.product_id = p.id
    WHERE r.is_approved = 1
    ORDER BY r.rating DESC, r.created_at DESC
    LIMIT 6
  `).all() as any[];

  return JSON.parse(
    JSON.stringify({
      products,
      categories,
      flavours,
      reviews,
    })
  ) as HomepageData;
}
