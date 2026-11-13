import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ addresses: [] });
    }

    const db = getDb();
    const addresses = db.prepare('SELECT * FROM addresses WHERE user_id = ? ORDER BY is_default DESC, created_at DESC').all(user.id);

    return NextResponse.json({ addresses });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Login required' }, { status: 401 });
    }

    const body = await req.json();
    const { fullName, phone, streetAddress, landmark, city, state, pinCode, addressType, isDefault } = body;

    if (!fullName || !phone || !streetAddress || !city || !pinCode) {
      return NextResponse.json({ error: 'Please provide full address details' }, { status: 400 });
    }

    const db = getDb();
    const id = `addr-${Date.now()}`;

    if (isDefault) {
      db.prepare('UPDATE addresses SET is_default = 0 WHERE user_id = ?').run(user.id);
    }

    db.prepare(`
      INSERT INTO addresses (
        id, user_id, full_name, phone, street_address, landmark, city, state, pin_code, is_default, address_type
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id, user.id, fullName, phone, streetAddress, landmark || '', city, state || 'Delhi NCR', pinCode,
      isDefault ? 1 : 0, addressType || 'HOME'
    );

    return NextResponse.json({ success: true, id });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Login required' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Address ID required' }, { status: 400 });
    }

    const db = getDb();
    db.prepare('DELETE FROM addresses WHERE id = ? AND user_id = ?').run(id, user.id);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

