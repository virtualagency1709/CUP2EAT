'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import confetti from 'canvas-confetti';
import {
  CheckCircle,
  Download,
  Truck,
  MessageCircle,
  ArrowRight,
  Package,
  Calendar,
  MapPin,
  Sparkles,
} from 'lucide-react';

export default function OrderConfirmationPage() {
  const params = useParams();
  const orderNumber = params?.orderNumber as string;

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fire festive celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FF5E1E', '#F59E0B', '#331B10', '#10B981'],
      });
    } catch {
      // ignore
    }

    async function fetchOrder() {
      try {
        const res = await fetch(`/api/orders/${orderNumber}`);
        if (res.ok) {
          const data = await res.json();
          setOrder(data.order);
        }
      } catch (err) {
        console.error('Error fetching confirmed order:', err);
      } finally {
        setLoading(false);
      }
    }

    if (orderNumber) {
      fetchOrder();
    }
  }, [orderNumber]);

  const handleDownloadInvoice = () => {
    window.open(`/invoice/${orderNumber}`, '_blank');
  };

  const whatsappSupportUrl = `https://wa.me/919818192575?text=${encodeURIComponent(
    `Hello CUP2EAT! I placed order ${orderNumber}. Please share updates regarding my delicious cups.`
  )}`;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      {/* Top Celebration Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-amber-100 shadow-soft text-center space-y-4">
        <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle className="w-10 h-10" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-amber-50 text-brand-orange text-xs font-bold rounded-full">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Payment & Order Confirmed!</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-brand-chocolate tracking-tight">
          Thank You For Choosing CUP2EAT!
        </h1>

        <p className="text-sm sm:text-base text-gray-600 max-w-lg mx-auto leading-relaxed">
          Your delicious, crunchy edible cups are being prepared with love and will be on their way shortly.
        </p>

        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <span className="text-xs bg-cream-50 border border-amber-200 px-4 py-2 rounded-xl font-bold text-brand-chocolate">
            Order ID: <strong className="text-brand-orange">{orderNumber}</strong>
          </span>
          <span className="text-xs bg-cream-50 border border-amber-200 px-4 py-2 rounded-xl font-bold text-brand-chocolate">
            Estimated Delivery: <strong>3-5 Business Days</strong>
          </span>
        </div>

        {/* Action Buttons */}
        <div className="pt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-xl mx-auto">
          <Link
            href={`/track-order?orderNumber=${orderNumber}`}
            className="py-3 px-4 bg-brand-orange hover:bg-brand-orange-hover text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5 transition-all"
          >
            <Truck className="w-4 h-4" /> Track My Order
          </Link>

          <button
            onClick={handleDownloadInvoice}
            className="py-3 px-4 bg-brand-chocolate hover:bg-brand-chocolate-dark text-white font-bold text-xs rounded-xl shadow-sm flex items-center justify-center gap-1.5 transition-all"
          >
            <Download className="w-4 h-4" /> Download Invoice
          </button>

          <a
            href={whatsappSupportUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center justify-center gap-1.5 transition-all"
          >
            <MessageCircle className="w-4 h-4" /> WhatsApp Support
          </a>
        </div>
      </div>

      {/* Order Details Breakdown */}
      {order && (
        <div className="mt-8 bg-white rounded-3xl p-6 sm:p-8 border border-amber-100 shadow-soft space-y-6">
          <h2 className="font-bold text-lg text-brand-chocolate pb-3 border-b border-gray-100 flex items-center gap-2">
            <Package className="w-5 h-5 text-brand-orange" />
            Ordered Items
          </h2>

          <div className="divide-y divide-gray-100">
            {order.items?.map((item: any) => (
              <div key={item.id} className="py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl bg-amber-50 overflow-hidden relative border border-gray-100 shrink-0">
                    <Image
                      src={item.product_image || 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&q=80'}
                      alt={item.product_name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-brand-chocolate">{item.product_name}</h4>
                    <p className="text-xs text-gray-500">
                      {item.flavour} • {item.pack_size} • Qty: {item.quantity}
                    </p>
                  </div>
                </div>
                <span className="font-bold text-sm text-brand-chocolate">
                  ₹{item.total_price || item.unit_price * item.quantity}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-gray-600">
            <div>
              <p className="font-bold text-brand-chocolate text-sm mb-1 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-brand-orange" /> Shipping Address:
              </p>
              <p className="leading-relaxed">
                {order.customerName}
                <br />
                {order.deliveryAddress}, {order.city}, {order.state} - {order.pinCode}
                <br />
                Phone: {order.customerPhone}
              </p>
            </div>

            <div>
              <p className="font-bold text-brand-chocolate text-sm mb-1">Payment Summary:</p>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>Payment Method:</span>
                  <strong className="text-brand-chocolate">{order.paymentMethod}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Payment Status:</span>
                  <strong className="text-emerald-600">{order.paymentStatus}</strong>
                </div>
                <div className="flex justify-between text-sm font-bold text-brand-chocolate pt-1 border-t">
                  <span>Grand Total:</span>
                  <span className="text-brand-orange">₹{order.grandTotal}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 text-center">
        <Link
          href="/shop"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-orange hover:underline"
        >
          Explore more delicious flavours <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
