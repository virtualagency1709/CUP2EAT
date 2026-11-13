'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Phone, Instagram, Send, ShieldCheck, Heart, Sparkles, CheckCircle2 } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setSubscribed(true);
        setEmail('');
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-brand-chocolate text-amber-50/90 pt-16 pb-12 border-t border-amber-900/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-amber-900/40">
          {/* Brand Info (Span 2) */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-brand-orange to-amber-600 flex items-center justify-center text-white shadow-md">
                <span className="text-xl font-black">☕</span>
              </div>
              <div>
                <span className="text-2xl font-black tracking-tight text-white">
                  CUP<span className="text-brand-orange">2</span>EAT
                </span>
                <p className="text-[11px] font-bold text-amber-300 tracking-wider uppercase">
                  Eat Your Drink!
                </p>
              </div>
            </Link>

            <p className="text-sm text-amber-100/70 max-w-sm leading-relaxed">
              India’s revolutionary edible cup brand. Sip your favourite coffee, tea, hot chocolate, or milkshake for 45+ minutes, then crunch the delicious cookie cup. 100% Zero Waste, 100% Edible.
            </p>

            <div className="space-y-2 pt-2 text-sm text-amber-100/80">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-brand-orange shrink-0" />
                <a href="tel:9818192575" className="hover:text-white transition-colors">
                  +91 9818192575
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-brand-orange shrink-0" />
                <a href="mailto:Varunkhera6@gmail.com" className="hover:text-white transition-colors">
                  Varunkhera6@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Instagram className="w-4 h-4 text-pink-400 shrink-0" />
                <a
                  href="https://www.instagram.com/cup2eat/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  @cup2eat on Instagram
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-base">Quick Links</h4>
            <ul className="space-y-2 text-sm text-amber-100/70">
              <li>
                <Link href="/" className="hover:text-brand-orange transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-brand-orange transition-colors">
                  Shop All Flavours
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-brand-orange transition-colors">
                  About CUP2EAT
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-brand-orange transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/track-order" className="hover:text-brand-orange transition-colors">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-brand-orange transition-colors">
                  FAQ & Help
                </Link>
              </li>
            </ul>
          </div>

          {/* Policies */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-base">Brand Policies</h4>
            <ul className="space-y-2 text-sm text-amber-100/70">
              <li>
                <Link href="/shipping-policy" className="hover:text-brand-orange transition-colors">
                  Shipping & Delivery
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="hover:text-brand-orange transition-colors">
                  Refund & Cancellation
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-brand-orange transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-brand-orange transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-brand-orange transition-colors">
                  Admin Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Box */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-base">Join The Family</h4>
            <p className="text-xs text-amber-100/70">
              Subscribe for exclusive secret flavour launches, tasting popups, and 10% off your first order!
            </p>

            {subscribed ? (
              <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-2xl flex items-center gap-2 text-emerald-300 text-xs font-semibold">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>You&apos;re subscribed! Use code <strong>WELCOME10</strong></span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full bg-amber-950/60 border border-amber-800 text-white placeholder-amber-200/40 text-xs px-3.5 py-2.5 rounded-xl outline-none focus:border-brand-orange pr-10"
                    required
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="absolute right-1 top-1 bottom-1 px-2.5 bg-brand-orange hover:bg-brand-orange-hover text-white rounded-lg flex items-center justify-center transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
                <span className="text-[10px] text-amber-200/50 block">
                  🔒 Zero spam. Unsubscribe anytime.
                </span>
              </form>
            )}

            <div className="pt-2 flex items-center gap-2 text-xs text-amber-300/80">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>100% FSSAI Certified & Food Safe</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-amber-200/60 gap-4">
          <p>© {new Date().getFullYear()} CUP2EAT (Eat Your Drink!). All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Designed with appetizing love in India</span>
            <span className="text-amber-400 font-semibold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-brand-orange" /> Zero Plastic Movement
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

