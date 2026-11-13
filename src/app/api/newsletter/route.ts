import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email address is required' }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();
    const db = getDb();

    const existing = db.prepare('SELECT id FROM newsletter_subscribers WHERE email = ?').get(cleanEmail);
    if (!existing) {
      db.prepare(`
        INSERT INTO newsletter_subscribers (id, email, status)
        VALUES (?, ?, 'ACTIVE')
      `).run(`sub-${Date.now()}`, cleanEmail);
    }

    return NextResponse.json({
      success: true,
      message: 'Welcome to the CUP2EAT family! Check your inbox for your 10% coupon: WELCOME10',
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

