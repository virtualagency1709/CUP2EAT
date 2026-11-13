'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, MessageCircle, HelpCircle, Phone } from 'lucide-react';

const FAQS = [
  {
    q: 'How does the cup stay crispy and not get soggy or leak?',
    a: 'CUP2EAT cups use our proprietary dual-layer glazing formula. The interior of the cup is double-lined with food-grade Belgian chocolate and cocoa butter which acts as a natural water-impermeable thermal barrier. This holds piping hot coffee, tea, or cold shakes for 45+ minutes with zero leakage!',
  },
  {
    q: 'What beverages can I pour into CUP2EAT cups?',
    a: 'You can pour espresso, cappuccino, macchiato, hot chocolate, green tea, masala chai, cold brew, iced latte, dessert mousses, puddings, milkshakes, and even ice cream scoops!',
  },
  {
    q: 'How hot can the beverage be?',
    a: 'Our edible cups withstand liquids up to 85°C (185°F). Standard fresh-brewed coffee is typically served between 65°C to 75°C, which is well within our safe thermal zone.',
  },
  {
    q: 'Are CUP2EAT cups 100% vegetarian?',
    a: 'Yes! All CUP2EAT cups are 100% vegetarian, certified with the green dot. We use pure vegetable ingredients, real butter, unrefined sugar, and natural vanilla. No animal gelatin is used in our cups.',
  },
  {
    q: 'What is the shelf life of the cups?',
    a: 'CUP2EAT edible cups have a shelf life of 9 months from the date of manufacturing when stored at room temperature in a cool, dry place away from direct sunlight.',
  },
  {
    q: 'How do you prevent breakage during shipping across India?',
    a: 'Every CUP2EAT pack is vacuum-sealed in individual foil sleeves and seated inside custom shockproof moulded paper trays and corrugated outer cartons. If any cup ever arrives damaged, we replace it 100% free of charge immediately!',
  },
  {
    q: 'Can I order in bulk for my café, restaurant, corporate event or wedding?',
    a: 'Absolutely! We supply commercial bulk packs (Box of 24 and Master cartons) to premium coffee shops, dessert bars, and luxury catering across India. Contact our founder Varun Khera directly at 9818192575 or Varunkhera6@gmail.com.',
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto">
        <div className="w-16 h-16 rounded-full bg-amber-100 text-brand-orange flex items-center justify-center mx-auto mb-3">
          <HelpCircle className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-black text-brand-chocolate">Frequently Asked Questions</h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-2">
          Everything you need to know about eating your drink, ingredients, and delivery.
        </p>
      </div>

      {/* Accordion FAQ List */}
      <div className="space-y-3">
        {FAQS.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-amber-100 overflow-hidden shadow-soft transition-all"
            >
              <button
                onClick={() => toggle(idx)}
                className="w-full p-5 text-left flex justify-between items-center gap-4 hover:bg-cream-50 transition-colors"
              >
                <span className="font-bold text-sm sm:text-base text-brand-chocolate">
                  {faq.q}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-brand-orange shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-amber-100/60 bg-cream-50/50">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Help Banner */}
      <div className="bg-gradient-to-r from-brand-chocolate to-[#4A2511] text-white p-8 rounded-3xl shadow-soft text-center space-y-4">
        <h3 className="font-black text-xl">Still Have Questions?</h3>
        <p className="text-xs sm:text-sm text-amber-100/80 max-w-md mx-auto">
          Our friendly customer care team and founder are always happy to chat.
        </p>
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <a
            href="https://wa.me/919818192575"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md transition-colors"
          >
            <MessageCircle className="w-4 h-4" /> WhatsApp Us (9818192575)
          </a>
          <Link
            href="/contact"
            className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold border border-white/20 transition-colors"
          >
            Contact Page
          </Link>
        </div>
      </div>
    </div>
  );
}

