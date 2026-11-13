import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getCurrentAdmin } from '@/lib/auth';

export async function GET() {
  try {
    const db = getDb();
    const coupons = db.prepare('SELECT * FROM coupons ORDER BY created_at DESC').all();
    return NextResponse.json({ coupons });
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

    const body = await req.json();
    const { code, description, discountType, discountValue, minOrderValue, maxDiscount } = body;

    if (!code || !discountValue) {
      return NextResponse.json({ error: 'Code and discount value required' }, { status: 400 });
    }

    const cleanCode = code.toUpperCase().trim();
    const db = getDb();
    const id = `cp-${Date.now()}`;

    db.prepare(`
      INSERT INTO coupons (id, code, description, discount_type, discount_value, min_order_value, max_discount, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, 1)
    `).run(
      id,
      cleanCode,
      description || '',
      discountType || 'PERCENT',
      Number(discountValue),
      minOrderValue ? Number(minOrderValue) : 0,
      maxDiscount ? Number(maxDiscount) : null
    );

    return NextResponse.json({ success: true, id, code: cleanCode });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Admin required' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Coupon ID required' }, { status: 400 });
    }

    const db = getDb();
    db.prepare('DELETE FROM coupons WHERE id = ?').run(id);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

