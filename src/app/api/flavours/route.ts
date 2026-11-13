import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET() {
  try {
    const db = getDb();
    const flavours = db.prepare(`
      SELECT * FROM flavours ORDER BY is_popular DESC, name ASC
    `).all();

    return NextResponse.json({ flavours });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

