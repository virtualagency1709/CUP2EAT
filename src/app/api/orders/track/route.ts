import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const orderNumber = searchParams.get('orderNumber');
    const phone = searchParams.get('phone');

    if (!orderNumber) {
      return NextResponse.json({ error: 'Order Number is required' }, { status: 400 });
    }

    const cleanOrderNumber = orderNumber.trim();
    const db = getDb();

    let query = `SELECT * FROM orders WHERE order_number = ?`;
    const params: any[] = [cleanOrderNumber];

    if (phone) {
      query += ` AND customer_phone LIKE ?`;
      params.push(`%${phone.trim()}%`);
    }

    const order = db.prepare(query).get(...params) as any;
    if (!order) {
      return NextResponse.json({ error: 'No order found with the provided details. Please check your order ID.' }, { status: 404 });
    }

    const items = db.prepare('SELECT product_name, flavour, pack_size, quantity, unit_price, total_price, product_image FROM order_items WHERE order_id = ?').all(order.id);
    const trackingEvents = db.prepare('SELECT status, description, location, timestamp FROM order_tracking WHERE order_id = ? ORDER BY timestamp ASC').all(order.id);

    return NextResponse.json({
      order: {
        id: order.id,
        orderNumber: order.order_number,
        customerName: order.customer_name,
        customerPhone: order.customer_phone,
        deliveryAddress: `${order.delivery_address}, ${order.city}, ${order.state} - ${order.pin_code}`,
        grandTotal: order.grand_total,
        paymentMethod: order.payment_method,
        paymentStatus: order.payment_status,
        orderStatus: order.order_status,
        trackingNumber: order.tracking_number,
        courierName: order.courier_name,
        estimatedDelivery: order.estimated_delivery,
        createdAt: order.created_at,
        items,
        trackingEvents,
      }
    });
  } catch (err: any) {
    console.error('Error tracking order:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
