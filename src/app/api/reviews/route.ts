import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('productId');
    const db = getDb();

    let query = `SELECT * FROM reviews WHERE is_approved = 1`;
    const params: any[] = [];

    if (productId) {
      query += ` AND product_id = ?`;
      params.push(productId);
    }

    query += ` ORDER BY created_at DESC`;
    const reviews = db.prepare(query).all(...params);

    return NextResponse.json({ reviews });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    const body = await req.json();
    const { productId, rating, title, comment, userName } = body;

    if (!productId || !rating || !comment) {
      return NextResponse.json({ error: 'Rating and comment are required' }, { status: 400 });
    }

    const reviewerName = userName || user?.name || 'Happy Customer';
    const db = getDb();
    const id = `rev-${Date.now()}`;

    db.prepare(`
      INSERT INTO reviews (id, product_id, user_id, user_name, rating, title, comment, is_verified_purchase, is_approved)
      VALUES (?, ?, ?, ?, ?, ?, ?, 1, 1)
    `).run(id, productId, user?.id || null, reviewerName, Number(rating), title || '', comment);

    // Recalculate product rating
    const stats = db.prepare(`
      SELECT AVG(rating) as avg_rating, COUNT(id) as count
      FROM reviews
      WHERE product_id = ? AND is_approved = 1
    `).get(productId) as any;

    if (stats) {
      const roundedRating = Math.round((stats.avg_rating || 5) * 10) / 10;
      db.prepare(`
        UPDATE products
        SET rating = ?, review_count = ?
        WHERE id = ?
      `).run(roundedRating, stats.count || 1, productId);
    }

    return NextResponse.json({ success: true, message: 'Review submitted successfully!' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

