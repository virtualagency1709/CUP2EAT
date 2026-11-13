'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Phone,
  Mail,
  Instagram,
  MapPin,
  Send,
  MessageCircle,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, subject, message }),
      });
      if (res.ok) {
        setSuccess(true);
        setName('');
        setEmail('');
        setPhone('');
        setSubject('');
        setMessage('');
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const whatsappUrl = `https://wa.me/919818192575?text=${encodeURIComponent(
    'Hello CUP2EAT! I need help regarding your products and orders.'
  )}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-orange bg-brand-orange/10 px-3.5 py-1.5 rounded-full">
          We&apos;d Love To Hear From You
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-brand-chocolate mt-3">
          Get in Touch with CUP2EAT
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-2">
          Questions about wholesale orders, café packs, flavour customizations, or personal orders? Our team is here for you!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* ========================================================
            LEFT: CONTACT INFO CARDS (5 COLS)
            ======================================================== */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-brand-chocolate text-white p-8 rounded-3xl space-y-6 shadow-card">
            <div>
              <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                Official Business Details
              </span>
              <h2 className="text-2xl font-black mt-1">CUP2EAT</h2>
              <p className="text-xs text-amber-100/70 font-semibold tracking-wide uppercase">
                Eat Your Drink!
              </p>
            </div>

            <div className="space-y-4 text-sm text-amber-100/90">
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-amber-200/60">Phone Support & Wholesale Inquiries</p>
                  <a href="tel:9818192575" className="font-bold text-white hover:text-brand-orange">
                    +91 9818192575
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-amber-200/60">Email Support</p>
                  <a href="mailto:Varunkhera6@gmail.com" className="font-bold text-white hover:text-brand-orange">
                    Varunkhera6@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Instagram className="w-5 h-5 text-pink-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-amber-200/60">Instagram Official</p>
                  <a
                    href="https://www.instagram.com/cup2eat/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-white hover:text-pink-300"
                  >
                    @cup2eat
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-amber-200/60">Support Hours</p>
                  <p className="font-medium text-white">Monday - Saturday: 9:00 AM - 8:00 PM IST</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-amber-900/60">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors shadow-md"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                Chat Directly on WhatsApp (9818192575)
              </a>
            </div>
          </div>

          {/* Quick FAQ Link Card */}
          <div className="p-6 bg-white rounded-3xl border border-amber-100 shadow-soft space-y-2">
            <h3 className="font-bold text-sm text-brand-chocolate">Looking for Quick Answers?</h3>
            <p className="text-xs text-gray-500">
              Learn how our cups stay crispy for 45+ minutes, our shipping timelines, and allergen details.
            </p>
            <Link
              href="/faq"
              className="text-xs font-bold text-brand-orange hover:underline inline-block pt-1"
            >
              Browse Frequently Asked Questions →
            </Link>
          </div>
        </div>

        {/* ========================================================
            RIGHT: MESSAGE FORM (7 COLS)
            ======================================================== */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-10 rounded-3xl border border-amber-100 shadow-soft">
          <h2 className="text-xl sm:text-2xl font-black text-brand-chocolate mb-2">
            Send Us a Message
          </h2>
          <p className="text-xs text-gray-500 mb-6">
            Fill in the form below and Varun Khera & the CUP2EAT team will respond within 24 hours.
          </p>

          {success ? (
            <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-emerald-900 text-base">Message Sent Successfully!</h3>
              <p className="text-xs text-emerald-700 max-w-sm mx-auto">
                Thank you for reaching out. We have received your inquiry and will contact you via email or phone shortly.
              </p>
              <button
                onClick={() => setSuccess(false)}
                className="text-xs font-bold text-brand-chocolate underline pt-2"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full text-xs sm:text-sm p-3 rounded-xl border border-amber-200 bg-cream-50 outline-none focus:border-brand-orange"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full text-xs sm:text-sm p-3 rounded-xl border border-amber-200 bg-cream-50 outline-none focus:border-brand-orange"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="10-digit number"
                    className="w-full text-xs sm:text-sm p-3 rounded-xl border border-amber-200 bg-cream-50 outline-none focus:border-brand-orange"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">
                    Inquiry Subject
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full text-xs sm:text-sm p-3 rounded-xl border border-amber-200 bg-cream-50 outline-none focus:border-brand-orange"
                  >
                    <option value="General Query">General Question</option>
                    <option value="Order Status">Order & Delivery Query</option>
                    <option value="Café / Bulk Wholesale">Café / Bulk Wholesale Order</option>
                    <option value="Event Catering">Event Catering & Weddings</option>
                    <option value="Feedback / Flavour Suggestion">Feedback & Flavour Suggestion</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">
                  Your Message *
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  placeholder="How can we help you create delicious experiences?"
                  className="w-full text-xs sm:text-sm p-3 rounded-xl border border-amber-200 bg-cream-50 outline-none focus:border-brand-orange"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3.5 bg-brand-orange hover:bg-brand-orange-hover text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                {loading ? 'Sending...' : 'Send Message'} <Send className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

