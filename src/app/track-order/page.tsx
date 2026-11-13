'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import {
  Search,
  Truck,
  Package,
  CheckCircle2,
  Clock,
  MapPin,
  AlertCircle,
  Phone,
  MessageCircle,
  ChevronRight,
} from 'lucide-react';

const ORDER_STEPS = [
  { key: 'ORDER_PLACED', label: 'Order Placed', desc: 'Order received and confirmed' },
  { key: 'PAYMENT_CONFIRMED', label: 'Confirmed', desc: 'Payment verified & authorized' },
  { key: 'PROCESSING', label: 'Processing', desc: 'Fresh cups baked & inspected' },
  { key: 'PACKED', label: 'Packed', desc: 'Sealed in thermal protective box' },
  { key: 'SHIPPED', label: 'Out for Delivery', desc: 'With express courier partner' },
  { key: 'DELIVERED', label: 'Delivered', desc: 'Delivered to your doorstep' },
];

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const initialOrderNumber = searchParams.get('orderNumber') || '';

  const [orderNumber, setOrderNumber] = useState(initialOrderNumber);
  const [phone, setPhone] = useState('');
  const [orderData, setOrderData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchTracking = async (orderNum: string, phoneNum?: string) => {
    if (!orderNum) return;
    setLoading(true);
    setError('');
    try {
      let url = `/api/orders/track?orderNumber=${encodeURIComponent(orderNum)}`;
      if (phoneNum) {
        url += `&phone=${encodeURIComponent(phoneNum)}`;
      }
      const res = await fetch(url);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Order not found');
        setOrderData(null);
      } else {
        setOrderData(data.order);
      }
    } catch {
      setError('Unable to fetch tracking info. Please check your network.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialOrderNumber) {
      fetchTracking(initialOrderNumber);
    }
  }, [initialOrderNumber]);

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber.trim()) return;
    fetchTracking(orderNumber.trim(), phone.trim());
  };

  // Helper to determine step completion index
  const getStepIndex = (status: string) => {
    switch (status) {
      case 'ORDER_PLACED':
        return 0;
      case 'PAYMENT_CONFIRMED':
      case 'ORDER_ACCEPTED':
        return 1;
      case 'PROCESSING':
        return 2;
      case 'PACKED':
        return 3;
      case 'SHIPPED':
      case 'OUT_FOR_DELIVERY':
        return 4;
      case 'DELIVERED':
        return 5;
      case 'CANCELLED':
        return -1;
      default:
        return 0;
    }
  };

  const currentStepIndex = orderData ? getStepIndex(orderData.orderStatus) : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto">
        <div className="w-16 h-16 rounded-full bg-amber-100 text-brand-orange flex items-center justify-center mx-auto mb-3">
          <Truck className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-black text-brand-chocolate">Track Your CUP2EAT Order</h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-2">
          Enter your Order Number and registered Mobile Number to track the live progress of your delicious cups.
        </p>
      </div>

      {/* Input Form */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-amber-100 shadow-soft">
        <form onSubmit={handleTrackSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-4">
          <div className="sm:col-span-6">
            <label className="text-xs font-semibold text-gray-600 block mb-1">
              Order ID / Number *
            </label>
            <input
              type="text"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder="e.g. C2E-2026-1001"
              className="w-full text-xs sm:text-sm p-3 rounded-xl border border-amber-200 bg-cream-50 outline-none focus:border-brand-orange font-bold uppercase"
              required
            />
          </div>

          <div className="sm:col-span-4">
            <label className="text-xs font-semibold text-gray-600 block mb-1">
              Registered Phone (Optional)
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="10-digit mobile number"
              className="w-full text-xs sm:text-sm p-3 rounded-xl border border-amber-200 bg-cream-50 outline-none focus:border-brand-orange"
            />
          </div>

          <div className="sm:col-span-2 flex items-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-brand-orange hover:bg-brand-orange-hover text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
            >
              {loading ? 'Searching...' : 'Track'}
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="mt-4 flex flex-wrap gap-2 text-[11px] text-gray-400">
          <span>Demo order to test:</span>
          <button
            type="button"
            onClick={() => {
              setOrderNumber('C2E-2026-1001');
              fetchTracking('C2E-2026-1001');
            }}
            className="text-brand-orange font-bold underline"
          >
            C2E-2026-1001
          </button>
        </div>
      </div>

      {/* Tracking Results Card */}
      {orderData && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-amber-100 shadow-soft space-y-8 animate-fadeIn">
          {/* Order Header Summary */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-gray-100">
            <div>
              <span className="text-xs bg-amber-100 text-brand-chocolate font-bold px-3 py-1 rounded-full uppercase">
                {orderData.orderStatus.replace('_', ' ')}
              </span>
              <h2 className="text-2xl font-black text-brand-chocolate mt-2">
                Order #{orderData.orderNumber}
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Placed on {new Date(orderData.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-xs text-gray-400 block">Courier & Tracking</span>
              <p className="font-bold text-brand-chocolate text-sm">
                {orderData.courierName || 'Delhivery Express'}
              </p>
              <p className="text-xs text-brand-orange font-mono font-bold">
                AWB: {orderData.trackingNumber || 'Processing'}
              </p>
            </div>
          </div>

          {/* Visual Step Timeline */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-6">
              Order Progress
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 relative">
              {ORDER_STEPS.map((step, idx) => {
                const isCompleted = currentStepIndex >= idx;
                const isCurrent = currentStepIndex === idx;

                return (
                  <div key={step.key} className="flex flex-col items-center text-center relative group">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs mb-2 transition-all shadow-xs ${
                        isCompleted
                          ? 'bg-emerald-600 text-white ring-4 ring-emerald-100'
                          : isCurrent
                          ? 'bg-brand-orange text-white ring-4 ring-amber-100 animate-pulse'
                          : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                    </div>

                    <h4
                      className={`text-xs font-bold line-clamp-1 ${
                        isCompleted || isCurrent ? 'text-brand-chocolate' : 'text-gray-400'
                      }`}
                    >
                      {step.label}
                    </h4>
                    <p className="text-[10px] text-gray-400 hidden sm:block mt-0.5">
                      {step.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Timeline Event Log */}
          {orderData.trackingEvents && orderData.trackingEvents.length > 0 && (
            <div className="p-5 rounded-2xl bg-cream-50 border border-amber-100 space-y-3">
              <h3 className="font-bold text-xs uppercase tracking-wider text-gray-500 mb-2">
                Live Status Updates
              </h3>
              <div className="space-y-3">
                {orderData.trackingEvents.map((ev: any, i: number) => (
                  <div key={i} className="flex items-start gap-3 text-xs">
                    <div className="w-2 h-2 rounded-full bg-brand-orange mt-1.5 shrink-0" />
                    <div className="flex-1">
                      <p className="font-bold text-brand-chocolate">{ev.description}</p>
                      <p className="text-[11px] text-gray-400">
                        {ev.location} • {new Date(ev.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}, {new Date(ev.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Delivery & Items Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-gray-100 text-xs">
            <div>
              <p className="font-bold text-brand-chocolate text-sm mb-1 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-brand-orange" /> Delivery Address:
              </p>
              <p className="text-gray-600 leading-relaxed">
                {orderData.customerName}
                <br />
                {orderData.deliveryAddress}
                <br />
                Contact: {orderData.customerPhone}
              </p>
            </div>

            <div>
              <p className="font-bold text-brand-chocolate text-sm mb-1">Items In Order:</p>
              <div className="space-y-1">
                {orderData.items?.map((item: any, i: number) => (
                  <div key={i} className="flex justify-between text-gray-600">
                    <span>{item.quantity}x {item.product_name} ({item.flavour || 'Classic'})</span>
                    <strong className="text-brand-chocolate">₹{item.total_price}</strong>
                  </div>
                ))}
                <div className="flex justify-between font-bold text-brand-chocolate pt-2 border-t">
                  <span>Grand Total:</span>
                  <span className="text-brand-orange text-sm">₹{orderData.grandTotal}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Need Assistance? */}
          <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4 text-xs">
            <span className="text-gray-500">Need help with this shipment?</span>
            <div className="flex items-center gap-3">
              <a
                href={`tel:9818192575`}
                className="flex items-center gap-1.5 font-bold text-brand-chocolate hover:text-brand-orange transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-brand-orange" /> Call 9818192575
              </a>
              <a
                href={`https://wa.me/919818192575?text=${encodeURIComponent(
                  `Hello CUP2EAT! Checking status for order ${orderData.orderNumber}.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full hover:bg-emerald-100 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" /> WhatsApp Support
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center"><div className="w-8 h-8 border-3 border-brand-orange border-t-transparent rounded-full animate-spin mx-auto mb-2" /><p className="text-xs text-gray-400">Loading order tracker...</p></div>}>
      <TrackOrderContent />
    </Suspense>
  );
}
