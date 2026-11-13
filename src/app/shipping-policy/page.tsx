import React from 'react';

export default function ShippingPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-8">
      <div className="border-b pb-6">
        <span className="text-xs font-bold text-brand-orange uppercase tracking-wider">
          Delivery Guide
        </span>
        <h1 className="text-3xl font-black text-brand-chocolate mt-1">Shipping & Delivery Policy</h1>
        <p className="text-xs text-gray-500 mt-1">Last Updated: November 2026</p>
      </div>

      <div className="space-y-6 text-sm text-gray-700 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-brand-chocolate">1. Delivery Coverage & Courier Partners</h2>
          <p>
            CUP2EAT ships to over <strong>19,000+ PIN codes across India</strong>. We partner with Tier-1 logistics providers including Delhivery Express, Blue Dart, and DTDC to ensure safe, temperature-monitored handling of your edible cups.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-brand-chocolate">2. Estimated Delivery Timelines</h2>
          <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
            <li><strong>Delhi NCR:</strong> 1 to 2 business days.</li>
            <li><strong>Metro Cities (Mumbai, Bengaluru, Kolkata, Chennai, Hyderabad, Pune):</strong> 2 to 3 business days.</li>
            <li><strong>Rest of India:</strong> 3 to 5 business days.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-brand-chocolate">3. Shipping Rates</h2>
          <p>
            We offer <strong>FREE Express Shipping on all orders above ₹499</strong>. For orders below ₹499, a nominal flat delivery charge of ₹50 is applied at checkout.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-brand-chocolate">4. Real-Time Tracking</h2>
          <p>
            As soon as your edible cups are dispatched, you receive an automated AWB tracking number. You can monitor your package live at any time on our{' '}
            <a href="/track-order" className="text-brand-orange font-bold underline">
              Order Tracking Page
            </a>.
          </p>
        </section>
      </div>
    </div>
  );
}

