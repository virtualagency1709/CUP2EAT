import React from 'react';

export default function RefundPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-8">
      <div className="border-b pb-6">
        <span className="text-xs font-bold text-brand-orange uppercase tracking-wider">
          Customer Assurance
        </span>
        <h1 className="text-3xl font-black text-brand-chocolate mt-1">Refund & Cancellation Policy</h1>
        <p className="text-xs text-gray-500 mt-1">Last Updated: November 2026</p>
      </div>

      <div className="space-y-6 text-sm text-gray-700 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-brand-chocolate">1. Order Cancellations</h2>
          <p>
            You may cancel an order free of charge at any time before it enters the <strong>&quot;Packed&quot;</strong> or <strong>&quot;Shipped&quot;</strong> stage. Once dispatched with our courier partner, orders cannot be cancelled mid-transit due to the perishable, fresh-baked nature of edible food items.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-brand-chocolate">2. Transit Damage & Replacement Guarantee</h2>
          <p>
            We take extreme care in packaging your edible cups using heavy-duty shockproof protective trays. However, in the rare event that your shipment arrives damaged or crushed in transit:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
            <li>Take a clear photo or short unboxing video of the damaged box.</li>
            <li>Send it to us on WhatsApp (+91 9818192575) or email Varunkhera6@gmail.com within 48 hours of receipt.</li>
            <li>We will issue an immediate 100% free replacement box or full refund—no questions asked!</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-brand-chocolate">3. Refund Processing Timelines</h2>
          <p>
            Approved refunds are credited back to your original payment method (UPI, Debit/Credit Card, or Net Banking) within <strong>3 to 5 business days</strong> through our Razorpay payment gateway.
          </p>
        </section>
      </div>
    </div>
  );
}

