import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getCurrentAdmin } from '@/lib/auth';

export async function GET() {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Admin required' }, { status: 401 });
    }

    const db = getDb();
    const inventory = db.prepare(`
      SELECT i.*, p.name as product_name, p.sku, p.base_price, p.sale_price
      FROM inventory i
      JOIN products p ON i.product_id = p.id
      ORDER BY i.stock_quantity ASC
    `).all();

    const logs = db.prepare(`
      SELECT l.*, p.name as product_name
      FROM inventory_logs l
      JOIN products p ON l.product_id = p.id
      ORDER BY l.created_at DESC
      LIMIT 50
    `).all();

    return NextResponse.json({ inventory, logs });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Admin required' }, { status: 401 });
    }

    const { productId, changeQuantity, reason } = await req.json();

    if (!productId || changeQuantity === undefined) {
      return NextResponse.json({ error: 'Product and change quantity are required' }, { status: 400 });
    }

    const db = getDb();
    const product = db.prepare('SELECT id, stock FROM products WHERE id = ?').get(productId) as any;
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const currentStock = product.stock;
    const newStock = Math.max(0, currentStock + Number(changeQuantity));

    db.prepare(`
      UPDATE products
      SET stock = ?, is_available = CASE WHEN ? <= 0 THEN 0 ELSE 1 END, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(newStock, newStock, productId);

    db.prepare(`
      UPDATE inventory
      SET stock_quantity = ?,
          status = CASE WHEN ? <= 0 THEN 'OUT_OF_STOCK' WHEN ? <= safety_stock THEN 'LOW_STOCK' ELSE 'IN_STOCK' END,
          last_restocked_at = CURRENT_TIMESTAMP,
          updated_at = CURRENT_TIMESTAMP
      WHERE product_id = ?
    `).run(newStock, newStock, newStock, productId);

    db.prepare(`
      INSERT INTO inventory_logs (id, product_id, change_type, quantity_changed, previous_stock, new_stock, reason, reference_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      `log-${Date.now()}`,
      productId,
      Number(changeQuantity) > 0 ? 'RESTOCK' : 'ADJUSTMENT',
      Number(changeQuantity),
      currentStock,
      newStock,
      reason || 'Admin manual adjustment',
      admin.id
    );

    return NextResponse.json({ success: true, newStock });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

