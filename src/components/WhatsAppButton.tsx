'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';

export default function WhatsAppButton() {
  const phoneNumber = '9818192575';
  const message = encodeURIComponent('Hello CUP2EAT! I need help regarding your products and orders.');
  const whatsappUrl = `https://wa.me/91${phoneNumber}?text=${message}`;

  return (
    <aside
      aria-label="Customer support channels"
      className="fixed bottom-6 right-6 z-40 flex items-center group"
    >
      <span className="hidden sm:inline-block mr-3 px-3 py-1.5 bg-brand-chocolate text-white text-xs font-medium rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        Chat with us on WhatsApp!
      </span>
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-14 h-14 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-emerald-300"
        aria-label="Chat with CUP2EAT on WhatsApp (Phone: 9818192575)"
      >
        <MessageCircle className="w-7 h-7 fill-white stroke-none" />
      </a>
    </aside>
  );
}

