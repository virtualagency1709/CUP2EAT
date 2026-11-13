import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(
  req: NextRequest,
  { params }: { params: { orderNumber: string } }
) {
  try {
    const { orderNumber } = params;
    const db = getDb();

    // Look up by order_number or invoice_number
    let invoice = db.prepare(`
      SELECT i.*, o.order_number, o.created_at as order_date, o.payment_method, o.payment_status
      FROM invoices i
      JOIN orders o ON i.order_id = o.id
      WHERE o.order_number = ? OR i.invoice_number = ?
    `).get(orderNumber, orderNumber) as any;

    if (!invoice) {
      // Look up directly from orders
      const order = db.prepare('SELECT * FROM orders WHERE order_number = ? OR id = ?').get(orderNumber, orderNumber) as any;
      if (!order) {
        return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
      }

      const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(order.id) as any[];
      const itemsJson = JSON.stringify(items.map((i) => ({
        name: `${i.product_name} (${i.pack_size || 'Pack of 4'}) - ${i.flavour || 'Original'}`,
        qty: i.quantity,
        rate: i.unit_price,
        total: i.total_price,
      })));

      return NextResponse.json({
        invoice: {
          invoiceNumber: `INV-${order.order_number.replace('C2E-', '')}`,
          invoiceDate: order.created_at,
          orderNumber: order.order_number,
          orderDate: order.created_at,
          customerName: order.customer_name,
          customerEmail: order.customer_email,
          customerPhone: order.customer_phone,
          billingAddress: `${order.delivery_address}, ${order.city}, ${order.state} - ${order.pin_code}`,
          items: items.map((i) => ({
            name: `${i.product_name} (${i.pack_size || 'Pack of 4'}) - ${i.flavour || 'Original'}`,
            qty: i.quantity,
            rate: i.unit_price,
            total: i.total_price,
          })),
          subtotal: order.subtotal,
          tax: order.tax_amount,
          delivery: order.delivery_charge,
          discount: order.discount_amount,
          grandTotal: order.grand_total,
          paymentMethod: order.payment_method,
          paymentStatus: order.payment_status,
          company: {
            name: 'CUP2EAT',
            tagline: 'Eat Your Drink!',
            email: 'Varunkhera6@gmail.com',
            phone: '+91 9818192575',
            website: 'https://cup2eat.com',
            gstin: '07AABCU1234F1Z5',
          }
        }
      });
    }

    let parsedItems = [];
    try {
      parsedItems = JSON.parse(invoice.items_json);
    } catch {
      parsedItems = [];
    }

    return NextResponse.json({
      invoice: {
        invoiceNumber: invoice.invoice_number,
        invoiceDate: invoice.invoice_date,
        orderNumber: invoice.order_number,
        orderDate: invoice.order_date,
        customerName: invoice.customer_name,
        customerEmail: invoice.customer_email,
        customerPhone: invoice.customer_phone,
        billingAddress: invoice.billing_address,
        items: parsedItems,
        subtotal: invoice.subtotal,
        tax: invoice.tax,
        delivery: invoice.delivery,
        discount: invoice.discount,
        grandTotal: invoice.grand_total,
        paymentMethod: invoice.payment_method,
        paymentStatus: invoice.payment_status,
        company: {
          name: 'CUP2EAT',
          tagline: 'Eat Your Drink!',
          email: 'Varunkhera6@gmail.com',
          phone: '+91 9818192575',
          website: 'https://cup2eat.com',
          gstin: '07AABCU1234F1Z5',
        }
      }
    });
  } catch (err: any) {
    console.error('Error fetching invoice:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

