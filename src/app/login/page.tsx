'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function CustomerLoginPage() {
  const router = useRouter();
  const { setUser } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [forgotOpen, setForgotOpen] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Invalid credentials');
      }

      setUser(data.user);
      router.push('/account');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail('customer@cup2eat.com');
    setPassword('customer123');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 sm:py-20">
      <div className="bg-white p-8 rounded-3xl border border-amber-100 shadow-soft space-y-6">
        <div className="text-center">
          <Link href="/" className="inline-block mb-3">
            <span className="text-2xl font-black text-brand-chocolate tracking-tight">
              CUP<span className="text-brand-orange">2</span>EAT
            </span>
          </Link>
          <h1 className="text-2xl font-black text-brand-chocolate">Welcome Back!</h1>
          <p className="text-xs text-gray-500 mt-1">
            Sign in to track orders, manage addresses, and enjoy faster checkouts.
          </p>
        </div>

        {/* 1-Click Demo Fill Banner */}
        <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200/70 flex items-center justify-between text-xs">
          <div>
            <span className="font-bold text-brand-chocolate">Demo Account Available</span>
            <p className="text-[11px] text-gray-500">customer@cup2eat.com</p>
          </div>
          <button
            type="button"
            onClick={handleFillDemo}
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

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full text-xs sm:text-sm pl-10 pr-3.5 py-3 rounded-xl border border-amber-200 bg-cream-50 outline-none focus:border-brand-orange"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-gray-600">Password</label>
              <button
                type="button"
                onClick={() => setForgotOpen(true)}
                className="text-[11px] font-semibold text-brand-orange hover:underline"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full text-xs sm:text-sm pl-10 pr-10 py-3 rounded-xl border border-amber-200 bg-cream-50 outline-none focus:border-brand-orange"
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
            className="w-full py-3.5 bg-brand-orange hover:bg-brand-orange-hover text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
          >
            {loading ? 'Signing in...' : 'Sign In'} <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-2 text-center text-xs text-gray-500">
          Don&apos;t have an account yet?{' '}
          <Link href="/register" className="font-bold text-brand-chocolate hover:text-brand-orange underline">
            Register Here
          </Link>
        </div>

        <div className="border-t border-gray-100 pt-3 text-center">
          <Link
            href="/admin/login"
            className="text-[11px] text-gray-400 hover:text-brand-chocolate flex items-center justify-center gap-1"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-600" /> Are you an administrator? Admin Portal
          </Link>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {forgotOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-xl border border-amber-100">
            <h3 className="font-bold text-base text-brand-chocolate">Reset Your Password</h3>
            <p className="text-xs text-gray-500">
              Enter your registered email address to receive password reset instructions.
            </p>
            {resetSuccess ? (
              <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-semibold">
                Password reset link sent to your email! (Demo simulator: Use password <strong>customer123</strong> to login).
              </div>
            ) : (
              <div className="space-y-3">
                <input
                  type="email"
                  defaultValue={email}
                  placeholder="Enter email"
                  className="w-full text-xs p-3 rounded-xl border border-amber-200 bg-cream-50 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setResetSuccess(true)}
                  className="w-full py-2.5 bg-brand-orange text-white text-xs font-bold rounded-xl"
                >
                  Send Reset Link
                </button>
              </div>
            )}
            <button
              onClick={() => {
                setForgotOpen(false);
                setResetSuccess(false);
              }}
              className="w-full text-center text-xs text-gray-400 font-bold hover:underline"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

