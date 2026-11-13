'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldAlert, Lock, Mail, Eye, EyeOff, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function AdminLoginPage() {
  const router = useRouter();
  const { setAdminUser } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Invalid admin credentials');
      }

      setAdminUser(data.admin);
      router.push('/admin');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleFillAdminDemo = () => {
    setEmail('admin@cup2eat.com');
    setPassword('admin123');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 bg-cream-100">
      <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-3xl border border-amber-200 shadow-xl space-y-6">
        <div className="text-center">
          <div className="w-14 h-14 bg-brand-chocolate text-amber-300 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-md">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black text-brand-chocolate">CUP2EAT Admin Portal</h1>
          <p className="text-xs text-gray-500 mt-1">
            Secure management for orders, products, inventory, and analytics.
          </p>
        </div>

        {/* 1-Click Fill Seed Credentials */}
        <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 flex items-center justify-between text-xs">
          <div>
            <span className="font-bold text-brand-chocolate">Demo Admin Seed Credentials</span>
            <p className="text-[11px] text-gray-500 font-mono">admin@cup2eat.com • admin123</p>
          </div>
          <button
            type="button"
            onClick={handleFillAdminDemo}
            className="px-3 py-1.5 bg-brand-chocolate hover:bg-brand-orange text-white text-[11px] font-bold rounded-xl transition-colors flex items-center gap-1 shadow-xs"
          >
            <Sparkles className="w-3 h-3 text-amber-300" />
            1-Click Fill
          </button>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleAdminLogin} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Admin Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@cup2eat.com"
                className="w-full text-xs sm:text-sm pl-10 pr-3.5 py-3 rounded-xl border border-amber-200 bg-cream-50 outline-none focus:border-brand-orange font-medium"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Admin Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full text-xs sm:text-sm pl-10 pr-10 py-3 rounded-xl border border-amber-200 bg-cream-50 outline-none focus:border-brand-orange font-medium"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-brand-chocolate hover:bg-brand-chocolate-dark text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
          >
            {loading ? 'Authenticating...' : 'Enter Admin Dashboard'}{' '}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="border-t border-gray-100 pt-3 text-center">
          <Link href="/" className="text-xs font-bold text-brand-orange hover:underline">
            ← Return to Customer Storefront
          </Link>
        </div>
      </div>
    </div>
  );
}

