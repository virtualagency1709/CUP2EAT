import React from 'react';
import Link from 'next/link';

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-8">
      <div className="border-b pb-6">
        <span className="text-xs font-bold text-brand-orange uppercase tracking-wider">
          Legal & Compliance
        </span>
        <h1 className="text-3xl font-black text-brand-chocolate mt-1">Privacy Policy</h1>
        <p className="text-xs text-gray-500 mt-1">Last Updated: November 2026</p>
      </div>

      <div className="space-y-6 text-sm text-gray-700 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-brand-chocolate">1. Introduction</h2>
          <p>
            Welcome to <strong>CUP2EAT</strong> (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;). We respect your privacy and are committed to protecting personal data collected through our website, mobile interface, or customer service channels.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-brand-chocolate">2. Information We Collect</h2>
          <p>
            When you purchase products or register an account on CUP2EAT, we collect:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
            <li>Contact details: Full Name, Email Address, and Phone Number.</li>
            <li>Shipping and billing addresses including PIN code for courier fulfillment.</li>
            <li>Order history, transaction amounts, and tracking records.</li>
            <li>Customer support messages sent via website forms or official WhatsApp.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-brand-chocolate">3. Payment Information & Security</h2>
          <p>
            All online transactions are processed through <strong>Razorpay</strong>, a PCI-DSS Level 1 compliant payment gateway. <strong>CUP2EAT never stores your credit card numbers, debit card details, or banking passwords on our servers.</strong>
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-brand-chocolate">4. How We Use Your Data</h2>
          <p>
            We use your personal information solely to process orders, deliver fresh edible cups, notify you regarding shipping milestones, generate tax invoices, and offer customer assistance. We do not sell or rent your personal information to third parties.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-brand-chocolate">5. Contact Our Privacy Officer</h2>
          <p>
            If you have questions regarding your data or wish to delete your account records, please contact:
            <br />
            <strong>Email:</strong> Varunkhera6@gmail.com
            <br />
            <strong>Phone / WhatsApp:</strong> +91 9818192575
          </p>
        </section>
      </div>
    </div>
  );
}

