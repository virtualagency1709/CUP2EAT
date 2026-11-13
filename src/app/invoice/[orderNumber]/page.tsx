'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Printer, Download, ArrowLeft, ShieldCheck, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function InvoicePage() {
  const params = useParams();
  const orderNumber = params?.orderNumber as string;

  const [invoiceData, setInvoiceData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadInvoice() {
      try {
        const res = await fetch(`/api/invoices/${orderNumber}`);
        if (res.ok) {
          const d = await res.json();
          setInvoiceData(d.invoice);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    if (orderNumber) {
      loadInvoice();
    }
  }, [orderNumber]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-3 border-brand-orange border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!invoiceData) {
    return (
      <div className="max-w-md mx-auto py-20 text-center">
        <h2 className="text-xl font-bold">Invoice Not Found</h2>
        <Link href="/" className="text-brand-orange text-xs font-bold underline mt-2 inline-block">
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100/70 py-8 px-4 sm:px-6 print:p-0 print:bg-white">
      {/* Top Controls Bar (Hidden during print) */}
      <div className="max-w-3xl mx-auto mb-6 flex justify-between items-center print:hidden">
        <Link
          href={`/order-confirmation/${orderNumber}`}
          className="text-xs font-bold text-brand-chocolate hover:text-brand-orange flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Order
        </Link>

        <button
          onClick={handlePrint}
          className="px-5 py-2.5 bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-md transition-all"
        >
          <Printer className="w-4 h-4" /> Print / Save as PDF
        </button>
      </div>

      {/* Printable Invoice Paper Sheet */}
      <div className="max-w-3xl mx-auto bg-white p-8 sm:p-12 rounded-3xl border border-gray-200 shadow-xl print:border-none print:shadow-none print:p-0 space-y-8 text-xs text-gray-700">
        {/* Invoice Header */}
        <div className="flex justify-between items-start border-b pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black text-brand-chocolate tracking-tight">
                CUP<span className="text-brand-orange">2</span>EAT
              </span>
              <span className="bg-amber-100 text-amber-900 text-[10px] font-black px-2 py-0.5 rounded uppercase">
                Tax Invoice
              </span>
            </div>
            <p className="text-[11px] font-bold text-amber-700 uppercase tracking-wider mt-0.5">
              Eat Your Drink!
            </p>
            <div className="text-[11px] text-gray-500 mt-2 space-y-0.5">
              <p>Email: Varunkhera6@gmail.com</p>
              <p>Contact / Support: +91 9818192575</p>
              <p>GSTIN: 07AABCU1234F1Z5 • FSSAI Lic: 13324001000492</p>
            </div>
          </div>

          <div className="text-right space-y-1">
            <span className="text-lg font-black text-brand-chocolate font-mono">
              {invoiceData.invoiceNumber}
            </span>
            <p className="text-gray-500">
              Invoice Date:{' '}
              {new Date(invoiceData.invoiceDate).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </p>
            <p className="text-gray-500">
              Order Ref: <strong className="text-brand-chocolate">{invoiceData.orderNumber}</strong>
            </p>
            <div className="pt-1">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                {invoiceData.paymentStatus} via {invoiceData.paymentMethod}
              </span>
            </div>
          </div>
        </div>

        {/* Billed To */}
        <div className="grid grid-cols-2 gap-6 bg-cream-50 p-4 rounded-2xl border border-amber-100">
          <div>
            <span className="text-[10px] font-bold uppercase text-gray-400 block mb-1">
              Billed & Shipped To:
            </span>
            <p className="font-bold text-sm text-brand-chocolate">{invoiceData.customerName}</p>
            <p className="text-gray-600 mt-0.5 leading-relaxed">{invoiceData.billingAddress}</p>
            <p className="text-gray-500 mt-1">Phone: {invoiceData.customerPhone}</p>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-bold uppercase text-gray-400 block mb-1">
              Fulfilled By:
            </span>
            <p className="font-bold text-brand-chocolate">CUP2EAT Central Fulfilment</p>
            <p className="text-gray-600">Bakery & Logistics Facility</p>
            <p className="text-gray-500">Delhi NCR, India</p>
            <p className="text-gray-500 mt-1">www.cup2eat.com</p>
          </div>
        </div>

        {/* Itemized Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b-2 border-gray-200 text-gray-500 uppercase text-[10px]">
              <tr>
                <th className="py-2.5">Item & Flavour</th>
                <th className="py-2.5 text-center">Qty</th>
                <th className="py-2.5 text-right">Unit Rate</th>
                <th className="py-2.5 text-right">Amount (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {invoiceData.items?.map((item: any, i: number) => (
                <tr key={i} className="py-2">
                  <td className="py-3 font-semibold text-brand-chocolate">{item.name}</td>
                  <td className="py-3 text-center font-bold">{item.qty}</td>
                  <td className="py-3 text-right">₹{item.rate}</td>
                  <td className="py-3 text-right font-black text-brand-chocolate">₹{item.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals Calculation */}
        <div className="flex justify-end pt-4 border-t-2 border-gray-200">
          <div className="w-64 space-y-2 text-xs">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal:</span>
              <span className="font-bold">₹{invoiceData.subtotal}</span>
            </div>

            {invoiceData.discount > 0 && (
              <div className="flex justify-between text-emerald-600 font-bold">
                <span>Discount:</span>
                <span>-₹{invoiceData.discount}</span>
              </div>
            )}

            <div className="flex justify-between text-gray-600">
              <span>GST (5%):</span>
              <span>₹{invoiceData.tax}</span>
            </div>

            <div className="flex justify-between text-gray-600">
              <span>Delivery Charges:</span>
              <span>{invoiceData.delivery === 0 ? 'FREE' : `₹${invoiceData.delivery}`}</span>
            </div>

            <div className="flex justify-between text-sm font-black text-brand-chocolate pt-2 border-t border-gray-200">
              <span>Grand Total:</span>
              <span className="text-brand-orange text-base">₹{invoiceData.grandTotal}</span>
            </div>
          </div>
        </div>

        {/* Signatures & Declarations */}
        <div className="pt-8 border-t flex justify-between items-end text-[11px] text-gray-500">
          <div className="space-y-1">
            <p className="font-bold text-brand-chocolate">Declaration:</p>
            <p>This is an electronically generated invoice.</p>
            <p>Thank you for helping us eliminate plastic waste one edible cup at a time!</p>
          </div>

          <div className="text-right space-y-1">
            <div className="font-serif italic font-black text-brand-chocolate text-base">
              Varun Khera
            </div>
            <p className="text-[10px] text-gray-400">Authorized Signatory, CUP2EAT</p>
          </div>
        </div>
      </div>
    </div>
  );
}

