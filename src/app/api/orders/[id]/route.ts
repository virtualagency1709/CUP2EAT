import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getCurrentAdmin, getCurrentUser } from '@/lib/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const db = getDb();

    const order = db.prepare(`
      SELECT * FROM orders WHERE id = ? OR order_number = ?
    `).get(id, id) as any;

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(order.id);
    const tracking = db.prepare('SELECT * FROM order_tracking WHERE order_id = ? ORDER BY timestamp ASC').all(order.id);
    const invoice = db.prepare('SELECT * FROM invoices WHERE order_id = ?').get(order.id);

    return NextResponse.json({
      order: {
        id: order.id,
        orderNumber: order.order_number,
        customerName: order.customer_name,
        customerEmail: order.customer_email,
        customerPhone: order.customer_phone,
        deliveryAddress: order.delivery_address,
        city: order.city,
        state: order.state,
        pinCode: order.pin_code,
        orderNotes: order.order_notes,
        subtotal: order.subtotal,
        taxAmount: order.tax_amount,
        deliveryCharge: order.delivery_charge,
        discountAmount: order.discount_amount,
        grandTotal: order.grand_total,
        paymentMethod: order.payment_method,
        paymentStatus: order.payment_status,
        orderStatus: order.order_status,
        trackingNumber: order.tracking_number,
        courierName: order.courier_name,
        estimatedDelivery: order.estimated_delivery,
        createdAt: order.created_at,
        items,
        tracking,
        invoice,
      }
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized: Admin required' }, { status: 401 });
    }

    const { id } = params;
    const db = getDb();
    const body = await req.json();

    const order = db.prepare('SELECT * FROM orders WHERE id = ? OR order_number = ?').get(id, id) as any;
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const {
      orderStatus,
      paymentStatus,
      trackingNumber,
      courierName,
      estimatedDelivery,
      statusNote
    } = body;

    db.prepare(`
      UPDATE orders
      SET order_status = COALESCE(?, order_status),
          payment_status = COALESCE(?, payment_status),
          tracking_number = COALESCE(?, tracking_number),
          courier_name = COALESCE(?, courier_name),
          estimated_delivery = COALESCE(?, estimated_delivery),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      orderStatus || null,
      paymentStatus || null,
      trackingNumber || null,
      courierName || null,
      estimatedDelivery || null,
      order.id
    );

    // If orderStatus changed, insert tracking timeline record
    if (orderStatus && orderStatus !== order.order_status) {
      let desc = statusNote;
      if (!desc) {
        switch (orderStatus) {
          case 'PAYMENT_CONFIRMED':
            desc = 'Online payment verified and confirmed.';
            break;
          case 'ORDER_ACCEPTED':
            desc = 'Order accepted by CUP2EAT kitchen team.';
            break;
          case 'PROCESSING':
            desc = 'Edible cups freshly packed and inspected for crispness.';
            break;
          case 'PACKED':
            desc = 'Order packed securely in premium thermo-sealed box.';
            break;
          case 'SHIPPED':
            desc = `Dispatched with ${courierName || 'Delhivery Express'}. AWB: ${trackingNumber || 'Assigned'}.`;
            break;
          case 'DELIVERED':
            desc = 'Order delivered successfully. Enjoy your CUP2EAT experience!';
            break;
          case 'CANCELLED':
            desc = 'Order has been cancelled.';
            break;
          default:
            desc = `Order updated to ${orderStatus}`;
        }
      }

      db.prepare(`
        INSERT INTO order_tracking (id, order_id, status, description, location)
        VALUES (?, ?, ?, ?, ?)
      `).run(
        `track-${Date.now()}`,
        order.id,
        orderStatus,
        desc,
        orderStatus === 'DELIVERED' ? `${order.city}, ${order.state}` : 'CUP2EAT Fulfilment Facility'
      );
    }

    return NextResponse.json({ success: true, message: 'Order updated successfully' });
  } catch (err: any) {
    console.error('Error updating order:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

