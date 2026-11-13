import React from 'react';

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-8">
      <div className="border-b pb-6">
        <span className="text-xs font-bold text-brand-orange uppercase tracking-wider">
          Legal & Compliance
        </span>
        <h1 className="text-3xl font-black text-brand-chocolate mt-1">Terms & Conditions</h1>
        <p className="text-xs text-gray-500 mt-1">Last Updated: November 2026</p>
      </div>

      <div className="space-y-6 text-sm text-gray-700 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-brand-chocolate">1. Acceptance of Terms</h2>
          <p>
            By accessing or purchasing from <strong>CUP2EAT</strong> (&quot;Eat Your Drink!&quot;), you agree to be bound by these Terms and Conditions. Please review them carefully before placing an order.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-brand-chocolate">2. Product Quality & Usage</h2>
          <p>
            CUP2EAT produces edible baked cookie and wafer cups designed to safely hold liquids up to 85°C. For optimal crispness and taste, cups should be consumed within 45 to 60 minutes after pouring your beverage.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-brand-chocolate">3. Pricing & Taxes</h2>
          <p>
            All prices displayed on CUP2EAT are in Indian Rupees (INR) and are inclusive of applicable Goods and Services Tax (GST). Delivery charges, if applicable, are clearly calculated and displayed before you make payment.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-brand-chocolate">4. Intellectual Property</h2>
          <p>
            The CUP2EAT brand name, &quot;Eat Your Drink!&quot; tagline, logo, recipes, custom packaging, product imagery, and website content are the exclusive intellectual property of CUP2EAT. Unauthorized reproduction is strictly prohibited.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-brand-chocolate">5. Governing Law</h2>
          <p>
            These terms shall be governed by and construed in accordance with the laws of India. Any disputes arising shall be subject to the exclusive jurisdiction of the courts of Delhi NCR, India.
          </p>
        </section>
      </div>
    </div>
  );
}

