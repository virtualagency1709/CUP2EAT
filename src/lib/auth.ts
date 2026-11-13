import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'cup2eat_super_secret_session_jwt_key_9818192575';
const CUSTOMER_COOKIE_NAME = 'cup2eat_customer_token';
const ADMIN_COOKIE_NAME = 'cup2eat_admin_token';

export interface UserPayload {
  id: string;
  name: string;
  email: string;
  role: 'CUSTOMER' | 'ADMIN' | 'SUPER_ADMIN';
  phone?: string | null;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function signToken(payload: UserPayload, expiresIn: any = '7d'): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn } as any);
}

export function verifyToken(token: string): UserPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as UserPayload;
  } catch {
    return null;
  }
}

// Helper to get authenticated customer from cookies in Next.js Server Components / Route Handlers
export async function getCurrentUser(): Promise<UserPayload | null> {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(CUSTOMER_COOKIE_NAME)?.value;
    if (!token) return null;
    return verifyToken(token);
  } catch {
    return null;
  }
}

// Helper to get authenticated admin from cookies
export async function getCurrentAdmin(): Promise<UserPayload | null> {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
    if (!token) return null;
    const payload = verifyToken(token);
    if (payload && (payload.role === 'ADMIN' || payload.role === 'SUPER_ADMIN')) {
      return payload;
    }
    return null;
  } catch {
    return null;
  }
}

export { CUSTOMER_COOKIE_NAME, ADMIN_COOKIE_NAME };
