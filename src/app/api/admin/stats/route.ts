import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getCurrentAdmin } from '@/lib/auth';

export async function GET() {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Admin required' }, { status: 401 });
    }

    const db = getDb();

    const totalOrders = (db.prepare('SELECT COUNT(id) as count FROM orders').get() as any)?.count || 0;
    const totalRevenue = (db.prepare("SELECT SUM(grand_total) as sum FROM orders WHERE payment_status = 'PAID'").get() as any)?.sum || 0;
    const totalCustomers = (db.prepare('SELECT COUNT(id) as count FROM users').get() as any)?.count || 0;
    const totalProducts = (db.prepare('SELECT COUNT(id) as count FROM products').get() as any)?.count || 0;
    const pendingOrders = (db.prepare("SELECT COUNT(id) as count FROM orders WHERE order_status IN ('PENDING', 'ORDER_ACCEPTED', 'PROCESSING')").get() as any)?.count || 0;
    const deliveredOrders = (db.prepare("SELECT COUNT(id) as count FROM orders WHERE order_status = 'DELIVERED'").get() as any)?.count || 0;
    const lowStockProducts = (db.prepare('SELECT COUNT(id) as count FROM products WHERE stock <= 15').get() as any)?.count || 0;

    const recentOrders = db.prepare(`
      SELECT id, order_number, customer_name, grand_total, order_status, payment_status, created_at
      FROM orders
      ORDER BY created_at DESC
      LIMIT 8
    `).all();

    const bestSellers = db.prepare(`
      SELECT p.id, p.name, p.sale_price, p.base_price, p.stock,
             (SELECT url FROM product_images WHERE product_id = p.id AND is_primary = 1) as image_url,
             COUNT(oi.id) as units_ordered
      FROM products p
      LEFT JOIN order_items oi ON p.id = oi.product_id
      GROUP BY p.id
      ORDER BY units_ordered DESC, p.rating DESC
      LIMIT 5
    `).all();

    return NextResponse.json({
      stats: {
        totalOrders,
        totalRevenue: Math.round(totalRevenue),
        totalCustomers,
        totalProducts,
        pendingOrders,
        deliveredOrders,
        lowStockProducts,
      },
      recentOrders,
      bestSellers,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

