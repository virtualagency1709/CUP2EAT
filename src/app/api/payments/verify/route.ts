import { NextRequest, NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { getDb } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const {
      orderId,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      isSandbox
    } = await req.json();

    if (!orderId || !razorpayOrderId || !razorpayPaymentId) {
      return NextResponse.json({ error: 'Missing payment verification data' }, { status: 400 });
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET || 'cup2eat_mock_secret';
    let isValid = false;

    if (isSandbox) {
      isValid = true;
    } else {
      const generatedSignature = crypto
        .createHmac('sha256', keySecret)
        .update(`${razorpayOrderId}|${razorpayPaymentId}`)
        .digest('hex');

      isValid = generatedSignature === razorpaySignature;
    }

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid payment signature. Verification failed.' }, { status: 400 });
    }

    const db = getDb();

    // Update order status to PAYMENT_CONFIRMED and PAID
    db.prepare(`
      UPDATE orders
      SET payment_status = 'PAID',
          order_status = 'PAYMENT_CONFIRMED',
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ? OR order_number = ?
    `).run(orderId, orderId);

    // Record payment
    const paymentId = `pay-${Date.now()}`;
    db.prepare(`
      INSERT INTO payments (
        id, order_id, razorpay_order_id, razorpay_payment_id, razorpay_signature,
        amount, currency, status, method
      ) VALUES (?, ?, ?, ?, ?, ?, 'INR', 'SUCCESS', 'RAZORPAY')
    `).run(
      paymentId,
      orderId,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature || 'SANDBOX_VERIFIED',
      100 // captured
    );

    // Update invoice status
    db.prepare(`
      UPDATE invoices
      SET status = 'PAID'
      WHERE order_id = ?
    `).run(orderId);

    // Add tracking event
    db.prepare(`
      INSERT INTO order_tracking (id, order_id, status, description, location)
      VALUES (?, ?, 'PAYMENT_CONFIRMED', 'Razorpay payment verified successfully (Txn: ' || ? || ').', 'CUP2EAT Central Fulfilment')
    `).run(`track-${Date.now()}`, orderId, razorpayPaymentId);

    return NextResponse.json({
      success: true,
      message: 'Payment verified and order confirmed',
      transactionId: razorpayPaymentId,
    });
  } catch (err: any) {
    console.error('Error verifying payment:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

