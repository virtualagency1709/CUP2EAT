import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, subject, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email and message are required' }, { status: 400 });
    }

    const db = getDb();
    const id = `msg-${Date.now()}`;

    db.prepare(`
      INSERT INTO contact_messages (id, name, email, phone, subject, message, status)
      VALUES (?, ?, ?, ?, ?, ?, 'NEW')
    `).run(id, name.trim(), email.trim().toLowerCase(), phone ? phone.trim() : null, subject || '', message.trim());

    return NextResponse.json({
      success: true,
      message: 'Thank you for reaching out! The CUP2EAT team will contact you shortly.',
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const db = getDb();
    const messages = db.prepare('SELECT * FROM contact_messages ORDER BY created_at DESC').all();
    return NextResponse.json({ messages });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

