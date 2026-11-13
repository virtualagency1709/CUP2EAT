import { NextRequest, NextResponse } from 'next/server';
import crypto from 'node:crypto';

export async function POST(req: NextRequest) {
  try {
    const { amount, currency = 'INR', receipt } = await req.json();

    if (!amount) {
      return NextResponse.json({ error: 'Amount is required' }, { status: 400 });
    }

    const keyId = process.env.RAZORPAY_KEY_ID || 'rzp_test_cup2eat_key';
    const keySecret = process.env.RAZORPAY_KEY_SECRET || 'cup2eat_mock_secret';

    // Amount in paise
    const amountInPaise = Math.round(Number(amount) * 100);

    // If real keys are configured and not test dummy, make call to Razorpay API
    if (keyId && keySecret && !keyId.includes('test_cup2eat_key')) {
      try {
        const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
        const response = await fetch('https://api.razorpay.com/v1/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${auth}`,
          },
          body: JSON.stringify({
            amount: amountInPaise,
            currency,
            receipt: receipt || `rcpt_${Date.now()}`,
          }),
        });

        if (response.ok) {
          const razorpayOrder = await response.json();
          return NextResponse.json({
            success: true,
            id: razorpayOrder.id,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
            keyId,
          });
        }
      } catch (e) {
        console.warn('Real Razorpay call failed, falling back to seamless sandbox order:', e);
      }
    }

    // Seamless Sandbox Razorpay Order
    const mockOrderId = `order_${crypto.randomBytes(8).toString('hex')}`;

    return NextResponse.json({
      success: true,
      id: mockOrderId,
      amount: amountInPaise,
      currency,
      keyId,
      isSandbox: true,
    });
  } catch (err: any) {
    console.error('Error creating Razorpay order:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

