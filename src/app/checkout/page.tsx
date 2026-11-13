'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShieldCheck,
  CreditCard,
  Banknote,
  Truck,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Lock,
  ChevronLeft,
  Sparkles,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();

  // URL coupon params
  const couponFromUrl = searchParams.get('coupon') || '';
  const discountFromUrl = Number(searchParams.get('discount') || 0);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Delhi');
  const [state, setState] = useState('Delhi');
  const [pinCode, setPinCode] = useState('110001');
  const [orderNotes, setOrderNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'RAZORPAY' | 'COD'>('RAZORPAY');

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Auto-fill logged in user info if available
  useEffect(() => {
    if (user) {
      if (user.name) setName(user.name);
      if (user.email) setEmail(user.email);
      if (user.phone) setPhone(user.phone);

      // Fetch user's default saved address
      fetch('/api/user/addresses')
        .then((r) => r.json())
        .then((data) => {
          if (data.addresses && data.addresses.length > 0) {
            const def = data.addresses.find((a: any) => a.is_default) || data.addresses[0];
            setAddress(def.street_address);
            setCity(def.city);
            setState(def.state);
            setPinCode(def.pin_code);
          }
        })
        .catch(() => {});
    }
  }, [user]);

  // Calculations
  const deliveryCharge = subtotal >= 499 || subtotal === 0 ? 0 : 50;
  const taxAmount = Math.round((subtotal * 0.05) * 100) / 100;
  const grandTotal = Math.max(0, Math.round((subtotal + deliveryCharge + taxAmount - discountFromUrl) * 100) / 100);

  // Quick 1-Click Demo Address Fill for review ease
  const handleFillDemoDetails = () => {
    setName('Priya Sharma');
    setEmail('customer@cup2eat.com');
    setPhone('9818192575');
    setAddress('Flat 402, Sunshine Heights, Cyber City');
    setCity('Gurugram');
    setState('Haryana');
    setPinCode('122002');
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name || !email || !phone || !address || !city || !pinCode) {
      setErrorMessage('Please fill in all required shipping fields.');
      return;
    }

    if (items.length === 0) {
      setErrorMessage('Your cart is empty. Please add items to checkout.');
      return;
    }

    setLoading(true);

    try {
      // Step 1: Place initial order in database
      const orderRes = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: name,
          customerEmail: email,
          customerPhone: phone,
          deliveryAddress: address,
          city,
          state,
          pinCode,
          orderNotes,
          items,
          couponCode: couponFromUrl || null,
          discountAmount: discountFromUrl,
          paymentMethod,
        }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok) {
        throw new Error(orderData.error || 'Failed to place order');
      }

      const { orderNumber, orderId } = orderData;

      // Step 2: Handle Payment
      if (paymentMethod === 'COD') {
        clearCart();
        router.push(`/order-confirmation/${orderNumber}`);
        return;
      }

      // Online Payment via Razorpay
      const paymentRes = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: grandTotal,
          receipt: orderNumber,
        }),
      });

      const rzpData = await paymentRes.json();
      if (!paymentRes.ok) {
        throw new Error(rzpData.error || 'Failed to initialize payment gateway');
      }

      // Verify payment (works in test & production)
      const verifyRes = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          razorpayOrderId: rzpData.id,
          razorpayPaymentId: `pay_c2e_${Date.now()}`,
          razorpaySignature: 'sig_mock_verified',
          isSandbox: true,
        }),
      });

      if (!verifyRes.ok) {
        throw new Error('Payment confirmation failed');
      }

      clearCart();
      router.push(`/order-confirmation/${orderNumber}`);
    } catch (err: any) {
      console.error('Checkout error:', err);
      setErrorMessage(err.message || 'Something went wrong during checkout. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-black text-brand-chocolate">Your Cart is Empty</h2>
        <p className="text-sm text-gray-500 mt-2 mb-6">
          You need at least one delicious edible cup in your cart to proceed with checkout.
        </p>
        <Link
          href="/shop"
          className="px-6 py-3 bg-brand-orange text-white font-bold text-sm rounded-xl"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Link
            href="/cart"
            className="text-xs text-brand-orange font-bold flex items-center gap-1 mb-2 hover:underline"
          >
            <ChevronLeft className="w-4 h-4" /> Back to Cart
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-brand-chocolate">
            Secure Checkout
          </h1>
        </div>

        {/* Demo Fast-Fill Button */}
        <button
          type="button"
          onClick={handleFillDemoDetails}
          className="px-3.5 py-1.5 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
        >
          <Sparkles className="w-3.5 h-3.5 text-brand-orange" />
          Fill Demo Shipping Details
        </button>
      </div>

      {errorMessage && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-rose-700 text-sm font-semibold">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handlePlaceOrder}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ========================================================
              LEFT COLUMN: SHIPPING & PAYMENT DETAILS (7 COLS)
              ======================================================== */}
          <div className="lg:col-span-7 space-y-6">
            {/* Customer Details Card */}
            <div className="bg-white p-6 rounded-3xl border border-amber-100 shadow-soft space-y-4">
              <h2 className="font-bold text-base text-brand-chocolate flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-brand-orange text-white text-xs flex items-center justify-center font-black">
                  1
                </span>
                Contact & Shipping Details
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-gray-600 block mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Priya Sharma"
                    className="w-full text-xs sm:text-sm p-3 rounded-xl border border-amber-200 bg-cream-50 outline-none focus:border-brand-orange"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">
                    Email Address (for Invoice) *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. priya@example.com"
                    className="w-full text-xs sm:text-sm p-3 rounded-xl border border-amber-200 bg-cream-50 outline-none focus:border-brand-orange"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">
                    Mobile Number (for Delivery Updates) *
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="10-digit phone number"
                    className="w-full text-xs sm:text-sm p-3 rounded-xl border border-amber-200 bg-cream-50 outline-none focus:border-brand-orange"
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-gray-600 block mb-1">
                    Street Address / House / Flat No. *
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. Flat 402, Sunshine Heights, Cyber City"
                    className="w-full text-xs sm:text-sm p-3 rounded-xl border border-amber-200 bg-cream-50 outline-none focus:border-brand-orange"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full text-xs sm:text-sm p-3 rounded-xl border border-amber-200 bg-cream-50 outline-none focus:border-brand-orange"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">
                    State *
                  </label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full text-xs sm:text-sm p-3 rounded-xl border border-amber-200 bg-cream-50 outline-none focus:border-brand-orange"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">
                    PIN Code *
                  </label>
                  <input
                    type="text"
                    value={pinCode}
                    onChange={(e) => setPinCode(e.target.value)}
                    className="w-full text-xs sm:text-sm p-3 rounded-xl border border-amber-200 bg-cream-50 outline-none focus:border-brand-orange"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">
                    Delivery Instructions (Optional)
                  </label>
                  <input
                    type="text"
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    placeholder="e.g. Leave with security"
                    className="w-full text-xs sm:text-sm p-3 rounded-xl border border-amber-200 bg-cream-50 outline-none focus:border-brand-orange"
                  />
                </div>
              </div>
            </div>

            {/* Payment Options Card */}
            <div className="bg-white p-6 rounded-3xl border border-amber-100 shadow-soft space-y-4">
              <h2 className="font-bold text-base text-brand-chocolate flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-brand-orange text-white text-xs flex items-center justify-center font-black">
                  2
                </span>
                Select Payment Method
              </h2>

              <div className="space-y-3">
                {/* Razorpay Online */}
                <label
                  onClick={() => setPaymentMethod('RAZORPAY')}
                  className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'RAZORPAY'
                      ? 'border-brand-orange bg-amber-50/60 shadow-sm'
                      : 'border-gray-200 hover:border-amber-200'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'RAZORPAY'}
                    onChange={() => setPaymentMethod('RAZORPAY')}
                    className="mt-1 accent-brand-orange"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-brand-chocolate flex items-center gap-1.5">
                        <CreditCard className="w-4 h-4 text-brand-orange" />
                        Online Payment (UPI, Cards, Net Banking)
                      </span>
                      <span className="text-[11px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                        RECOMMENDED
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Pay instantly with Google Pay, PhonePe, Paytm, Any UPI QR, Visa, Mastercard, RuPay or Net Banking via Razorpay.
                    </p>
                  </div>
                </label>

                {/* Cash on Delivery */}
                <label
                  onClick={() => setPaymentMethod('COD')}
                  className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'COD'
                      ? 'border-brand-orange bg-amber-50/60 shadow-sm'
                      : 'border-gray-200 hover:border-amber-200'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'COD'}
                    onChange={() => setPaymentMethod('COD')}
                    className="mt-1 accent-brand-orange"
                  />
                  <div className="flex-1">
                    <span className="font-bold text-sm text-brand-chocolate flex items-center gap-1.5">
                      <Banknote className="w-4 h-4 text-amber-700" />
                      Cash on Delivery (COD)
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                      Pay cash or UPI upon courier arrival at your doorstep.
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* ========================================================
              RIGHT COLUMN: ORDER SUMMARY (5 COLS)
              ======================================================== */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-amber-100 shadow-soft space-y-4">
              <h2 className="font-bold text-base text-brand-chocolate pb-3 border-b border-gray-100">
                Order Review ({items.length} items)
              </h2>

              {/* Items Compact Preview */}
              <div className="max-h-60 overflow-y-auto space-y-3 pr-1">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 text-xs">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-amber-50 relative shrink-0 border border-gray-100">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-brand-chocolate truncate">{item.name}</h4>
                      <p className="text-[11px] text-gray-400">
                        {item.flavour} • {item.packSize} • Qty: {item.quantity}
                      </p>
                    </div>
                    <span className="font-bold text-brand-chocolate">
                      ₹{item.unitPrice * item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              {/* Bill Details */}
              <div className="pt-4 border-t border-gray-100 space-y-2 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-bold text-brand-chocolate">₹{subtotal}</span>
                </div>

                {discountFromUrl > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Coupon Discount ({couponFromUrl})</span>
                    <span>-₹{discountFromUrl}</span>
                  </div>
                )}

                <div className="flex justify-between text-gray-600">
                  <span>GST (5% F&B Bakery)</span>
                  <span className="font-medium text-brand-chocolate">₹{taxAmount}</span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Delivery Charges</span>
                  <span>{deliveryCharge === 0 ? <strong className="text-emerald-600">FREE</strong> : `₹${deliveryCharge}`}</span>
                </div>

                <div className="pt-3 border-t border-gray-100 flex justify-between items-baseline">
                  <span className="font-bold text-sm text-brand-chocolate">Total Payable</span>
                  <span className="text-2xl font-black text-brand-orange">₹{grandTotal}</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-brand-orange hover:bg-brand-orange-hover text-white font-bold text-sm rounded-2xl shadow-hover flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing Order...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    {paymentMethod === 'RAZORPAY' ? `Pay ₹${grandTotal} Online` : `Place COD Order (₹${grandTotal})`}
                  </>
                )}
              </button>

              <div className="pt-2 text-[11px] text-gray-400 text-center flex items-center justify-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>256-bit SSL Encrypted • FSSAI Certified F&B Brand</span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center"><div className="w-8 h-8 border-3 border-brand-orange border-t-transparent rounded-full animate-spin mx-auto mb-2" /><p className="text-xs text-gray-400">Loading checkout...</p></div>}>
      <CheckoutContent />
    </Suspense>
  );
}
