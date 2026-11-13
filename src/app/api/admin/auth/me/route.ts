import { NextResponse } from 'next/server';
import { getCurrentAdmin } from '@/lib/auth';
import { getDb } from '@/lib/db';

export async function GET() {
  try {
    const adminPayload = await getCurrentAdmin();
    if (!adminPayload) {
      return NextResponse.json({ admin: null }, { status: 401 });
    }

    const db = getDb();
    const admin = db.prepare('SELECT id, name, email, role, permissions, created_at FROM admin_users WHERE id = ?').get(adminPayload.id) as any;

    if (!admin) {
      return NextResponse.json({ admin: null }, { status: 401 });
    }

    return NextResponse.json({ admin });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

