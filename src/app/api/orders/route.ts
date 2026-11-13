import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getCurrentUser, getCurrentAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const db = getDb();
    const admin = await getCurrentAdmin();
    const user = await getCurrentUser();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const paymentStatus = searchParams.get('paymentStatus');
    const search = searchParams.get('search');

    if (admin) {
      // Admin can view all orders
      let query = `SELECT * FROM orders WHERE 1=1`;
      const params: any[] = [];

      if (status && status !== 'ALL') {
        query += ` AND order_status = ?`;
        params.push(status);
      }

      if (paymentStatus && paymentStatus !== 'ALL') {
        query += ` AND payment_status = ?`;
        params.push(paymentStatus);
      }

      if (search) {
        query += ` AND (order_number LIKE ? OR customer_name LIKE ? OR customer_email LIKE ? OR customer_phone LIKE ?)`;
        const term = `%${search}%`;
        params.push(term, term, term, term);
      }

      query += ` ORDER BY created_at DESC`;
      const rawOrders = db.prepare(query).all(...params) as any[];

      const orders = rawOrders.map((o) => {
        const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(o.id);
        return {
          id: o.id,
          orderNumber: o.order_number,
          customerName: o.customer_name,
          customerEmail: o.customer_email,
          customerPhone: o.customer_phone,
          deliveryAddress: o.delivery_address,
          city: o.city,
          state: o.state,
          pinCode: o.pin_code,
          orderNotes: o.order_notes,
          subtotal: o.subtotal,
          taxAmount: o.tax_amount,
          deliveryCharge: o.delivery_charge,
          discountAmount: o.discount_amount,
          grandTotal: o.grand_total,
          paymentMethod: o.payment_method,
          paymentStatus: o.payment_status,
          orderStatus: o.order_status,
          trackingNumber: o.tracking_number,
          courierName: o.courier_name,
          estimatedDelivery: o.estimated_delivery,
          createdAt: o.created_at,
          items,
        };
      });

      return NextResponse.json({ orders });
    }

    if (user) {
      // Customer can view their own orders
      const rawOrders = db.prepare(`
        SELECT * FROM orders
        WHERE user_id = ? OR customer_email = ?
        ORDER BY created_at DESC
      `).all(user.id, user.email) as any[];

      const orders = rawOrders.map((o) => {
        const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(o.id);
        return {
          id: o.id,
          orderNumber: o.order_number,
          customerName: o.customer_name,
          customerEmail: o.customer_email,
          customerPhone: o.customer_phone,
          deliveryAddress: o.delivery_address,
          city: o.city,
          state: o.state,
          pinCode: o.pin_code,
          subtotal: o.subtotal,
          taxAmount: o.tax_amount,
          deliveryCharge: o.delivery_charge,
          discountAmount: o.discount_amount,
          grandTotal: o.grand_total,
          paymentMethod: o.payment_method,
          paymentStatus: o.payment_status,
          orderStatus: o.order_status,
          trackingNumber: o.tracking_number,
          courierName: o.courier_name,
          estimatedDelivery: o.estimated_delivery,
          createdAt: o.created_at,
          items,
        };
      });

      return NextResponse.json({ orders });
    }

    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  } catch (err: any) {
    console.error('Error fetching orders:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const db = getDb();
    const user = await getCurrentUser();
    const body = await req.json();

    const {
      customerName,
      customerEmail,
      customerPhone,
      deliveryAddress,
      city,
      state,
      pinCode,
      orderNotes,
      items,
      couponCode,
      discountAmount = 0,
      paymentMethod = 'COD',
    } = body;

    if (!customerName || !customerEmail || !customerPhone || !deliveryAddress || !city || !pinCode) {
      return NextResponse.json({ error: 'Please fill in all shipping details' }, { status: 400 });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    // Calculate subtotal and verify stock
    let subtotal = 0;
    for (const item of items) {
      const product = db.prepare('SELECT id, name, stock, base_price, sale_price FROM products WHERE id = ?').get(item.productId) as any;
      if (!product) {
        return NextResponse.json({ error: `Product not found: ${item.name}` }, { status: 400 });
      }
      if (product.stock < item.quantity) {
        return NextResponse.json({
          error: `Insufficient stock for ${item.name}. Only ${product.stock} available.`
        }, { status: 400 });
      }
      const price = item.unitPrice || product.sale_price || product.base_price;
      subtotal += price * item.quantity;
    }

    // Delivery charge & tax
    const deliveryCharge = subtotal >= 499 ? 0 : 50;
    const taxAmount = Math.round((subtotal * 0.05) * 100) / 100; // 5% GST on F&B bakery
    const grandTotal = Math.max(0, Math.round((subtotal + deliveryCharge + taxAmount - discountAmount) * 100) / 100);

    const orderId = `ord-${Date.now()}`;
    const orderNumber = `C2E-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const paymentStatus = paymentMethod === 'COD' ? 'PENDING' : 'PAID';
    const orderStatus = paymentMethod === 'COD' ? 'PENDING' : 'PAYMENT_CONFIRMED';

    // Begin database transaction
    db.exec('BEGIN IMMEDIATE');
    try {
      // 1. Insert Order
      db.prepare(`
        INSERT INTO orders (
          id, order_number, user_id, customer_name, customer_email, customer_phone,
          delivery_address, city, state, pin_code, order_notes, subtotal, tax_amount,
          delivery_charge, discount_amount, grand_total, payment_method, payment_status,
          order_status, estimated_delivery
        ) VALUES (
          ?, ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?,
          ?, ?
        )
      `).run(
        orderId, orderNumber, user?.id || null, customerName.trim(), customerEmail.toLowerCase().trim(),
        customerPhone.trim(), deliveryAddress.trim(), city.trim(), state.trim(), pinCode.trim(),
        orderNotes || '', subtotal, taxAmount, deliveryCharge, Number(discountAmount), grandTotal,
        paymentMethod, paymentStatus, orderStatus, '3-5 Business Days'
      );

      // 2. Insert Order Items & Deduct Stock
      for (const item of items) {
        const itemTotal = (item.unitPrice || 0) * item.quantity;
        const itemId = `oi-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

        db.prepare(`
          INSERT INTO order_items (
            id, order_id, product_id, product_name, product_slug, product_image,
            flavour, pack_size, quantity, unit_price, totalPrice
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
          itemId, orderId, item.productId, item.name, item.slug || '', item.image || '',
          item.flavour || 'Original', item.packSize || 'Pack of 4', item.quantity, item.unitPrice, itemTotal
        );

        // Deduct product stock
        const currentProd = db.prepare('SELECT stock FROM products WHERE id = ?').get(item.productId) as any;
        const newStock = Math.max(0, (currentProd?.stock || 0) - item.quantity);

        db.prepare(`
          UPDATE products
          SET stock = ?,
              is_available = CASE WHEN ? <= 0 THEN 0 ELSE 1 END,
              updated_at = CURRENT_TIMESTAMP
          WHERE id = ?
        `).run(newStock, newStock, item.productId);

        // Update inventory table
        db.prepare(`
          UPDATE inventory
          SET stock_quantity = ?,
              status = CASE WHEN ? <= 0 THEN 'OUT_OF_STOCK' WHEN ? <= safety_stock THEN 'LOW_STOCK' ELSE 'IN_STOCK' END,
              updated_at = CURRENT_TIMESTAMP
          WHERE product_id = ?
        `).run(newStock, newStock, newStock, item.productId);

        // Inventory log
        db.prepare(`
          INSERT INTO inventory_logs (id, product_id, change_type, quantity_changed, previous_stock, new_stock, reason, reference_id)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `).run(`log-${Date.now()}`, item.productId, 'ORDER_DEDUCT', -item.quantity, currentProd?.stock || 0, newStock, 'Customer Order', orderNumber);
      }

      // 3. Insert Invoice
      const invoiceNumber = `INV-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${orderNumber.slice(-4)}`;
      const itemsJson = JSON.stringify(items.map((i: any) => ({
        name: `${i.name} (${i.packSize || 'Pack of 4'}) - ${i.flavour || 'Classic'}`,
        qty: i.quantity,
        rate: i.unitPrice,
        total: i.unitPrice * i.quantity
      })));

      db.prepare(`
        INSERT INTO invoices (
          id, invoice_number, order_id, customer_name, customer_email, customer_phone,
          billing_address, items_json, subtotal, tax, delivery, discount, grand_total, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        `inv-${orderId}`, invoiceNumber, orderId, customerName, customerEmail, customerPhone,
        `${deliveryAddress}, ${city}, ${state} - ${pinCode}`, itemsJson, subtotal, taxAmount,
        deliveryCharge, Number(discountAmount), grandTotal, paymentStatus === 'PAID' ? 'PAID' : 'PENDING'
      );

      // 4. Initial Tracking Record
      db.prepare(`
        INSERT INTO order_tracking (id, order_id, status, description, location)
        VALUES (?, ?, ?, ?, ?)
      `).run(
        `track-${Date.now()}`, orderId, 'ORDER_PLACED',
        paymentMethod === 'COD' ? 'Order placed with Cash on Delivery.' : 'Order placed and online payment confirmed.',
        'CUP2EAT Central Fulfilment'
      );

      // 5. If coupon used, record coupon usage
      if (couponCode) {
        const coupon = db.prepare('SELECT id FROM coupons WHERE code = ?').get(couponCode.toUpperCase().trim()) as any;
        if (coupon) {
          db.prepare(`
            INSERT INTO coupon_usage (id, coupon_id, user_id, order_id, discount_amount)
            VALUES (?, ?, ?, ?, ?)
          `).run(`cpu-${Date.now()}`, coupon.id, user?.id || null, orderId, Number(discountAmount));

          db.prepare('UPDATE coupons SET used_count = used_count + 1 WHERE id = ?').run(coupon.id);
        }
      }

      db.exec('COMMIT');

      return NextResponse.json({
        success: true,
        orderId,
        orderNumber,
        invoiceNumber,
        grandTotal,
        paymentStatus,
        paymentMethod,
      });
    } catch (txnError: any) {
      db.exec('ROLLBACK');
      throw txnError;
    }
  } catch (err: any) {
    console.error('Error creating order:', err);
    return NextResponse.json({ error: err.message || 'Failed to place order' }, { status: 500 });
  }
}
