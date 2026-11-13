'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Truck,
  Tag,
  ShieldCheck,
  CheckCircle2,
  X,
  AlertCircle,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, subtotal, totalItems } = useCart();

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState('');

  const freeShippingThreshold = 499;
  const remainingForFreeShip = Math.max(0, freeShippingThreshold - subtotal);
  const deliveryCharge = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 50;

  // Coupon discount calculation
  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'PERCENT') {
      discountAmount = Math.round((subtotal * appliedCoupon.discountValue) / 100);
      if (appliedCoupon.maxDiscount && discountAmount > appliedCoupon.maxDiscount) {
        discountAmount = appliedCoupon.maxDiscount;
      }
    } else {
      discountAmount = appliedCoupon.discountValue;
    }
    discountAmount = Math.min(discountAmount, subtotal);
  }

  const taxAmount = Math.round((subtotal * 0.05) * 100) / 100; // 5% GST
  const grandTotal = Math.max(0, Math.round((subtotal + deliveryCharge + taxAmount - discountAmount) * 100) / 100);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    setCouponLoading(true);
    setCouponError('');
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode, subtotal }),
      });
      const data = await res.json();
      if (!res.ok) {
        setCouponError(data.error || 'Invalid coupon code');
      } else {
        setAppliedCoupon(data.coupon);
        setCouponCode('');
      }
    } catch {
      setCouponError('Failed to validate coupon');
    } finally {
      setCouponLoading(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponError('');
  };

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="w-24 h-24 rounded-full bg-amber-50 text-brand-orange flex items-center justify-center mx-auto mb-4">
          <ShoppingBag className="w-12 h-12 stroke-1" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-brand-chocolate">Your Cart is Empty</h1>
        <p className="text-sm text-gray-500 max-w-sm mx-auto mt-2 mb-8 leading-relaxed">
          Looks like you haven&apos;t added any delicious edible cups yet. Explore our bestsellers and kickstart your zero-waste drinks!
        </p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-brand-orange hover:bg-brand-orange-hover text-white font-bold text-sm rounded-2xl shadow-hover transition-all"
        >
          Explore All Flavours <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-brand-chocolate">
          Shopping Cart ({totalItems} {totalItems === 1 ? 'item' : 'items'})
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Review your items, apply discount coupons, and proceed to checkout.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ========================================================
            LEFT: CART ITEMS LIST (8 COLS)
            ======================================================== */}
        <div className="lg:col-span-8 space-y-4">
          {/* Free Shipping Progress Indicator */}
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80">
            <div className="flex items-center gap-2 text-xs font-bold text-brand-chocolate">
              <Truck className="w-4 h-4 text-brand-orange shrink-0" />
              {remainingForFreeShip > 0 ? (
                <span>
                  Add <strong className="text-brand-orange">₹{remainingForFreeShip}</strong> more of edible cups for <strong>FREE Express Delivery</strong>!
                </span>
              ) : (
                <span className="text-emerald-700 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  You have unlocked FREE Express Delivery!
                </span>
              )}
            </div>
            <div className="w-full h-2 bg-amber-200/60 rounded-full mt-2.5 overflow-hidden">
              <div
                className="h-full bg-brand-orange rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100))}%` }}
              />
            </div>
          </div>

          {/* Table / List */}
          <div className="bg-white rounded-3xl border border-amber-100 divide-y divide-gray-100 overflow-hidden shadow-soft">
            {items.map((item) => (
              <div
                key={item.id}
                className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                {/* Product Thumbnail & Details */}
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden bg-amber-50 shrink-0 relative border border-amber-100">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <Link
                      href={`/product/${item.slug}`}
                      className="font-bold text-sm sm:text-base text-brand-chocolate hover:text-brand-orange transition-colors line-clamp-1"
                    >
                      {item.name}
                    </Link>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                      <span>{item.flavour}</span>
                      <span>•</span>
                      <span className="font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                        {item.packSize}
                      </span>
                    </div>
                    <div className="sm:hidden font-black text-brand-chocolate text-sm mt-2">
                      ₹{item.unitPrice} each
                    </div>
                  </div>
                </div>

                {/* Quantity Controls & Total */}
                <div className="flex items-center justify-between w-full sm:w-auto gap-6 pt-2 sm:pt-0 border-t sm:border-0 border-gray-100">
                  {/* Quantity */}
                  <div className="flex items-center border border-amber-200 rounded-xl bg-white overflow-hidden shadow-xs">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-2 hover:bg-amber-50 text-gray-600 transition-colors"
                      title="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-bold text-brand-chocolate">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-2 hover:bg-amber-50 text-gray-600 transition-colors"
                      title="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Price */}
                  <div className="text-right min-w-[70px]">
                    <div className="font-black text-brand-chocolate text-base">
                      ₹{item.unitPrice * item.quantity}
                    </div>
                    <span className="text-[11px] text-gray-400 hidden sm:block">
                      ₹{item.unitPrice} / pack
                    </span>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-2 text-gray-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center pt-2">
            <Link
              href="/shop"
              className="text-xs font-bold text-brand-orange hover:underline inline-flex items-center gap-1"
            >
              ← Continue Shopping
            </Link>
            <button
              onClick={clearCart}
              className="text-xs font-medium text-gray-400 hover:text-rose-500"
            >
              Clear Cart
            </button>
          </div>
        </div>

        {/* ========================================================
            RIGHT: ORDER SUMMARY & COUPON (4 COLS)
            ======================================================== */}
        <div className="lg:col-span-4 space-y-6">
          {/* Coupon Code Card */}
          <div className="bg-white p-5 rounded-3xl border border-amber-100 shadow-soft">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-2 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-brand-orange" />
              Have a Discount Coupon?
            </label>

            {appliedCoupon ? (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between text-xs">
                <div>
                  <span className="font-black text-emerald-800 uppercase tracking-wide">
                    {appliedCoupon.code}
                  </span>
                  <p className="text-[11px] text-emerald-600 mt-0.5">
                    Saved ₹{discountAmount} on this order!
                  </p>
                </div>
                <button
                  onClick={removeCoupon}
                  className="text-rose-600 hover:text-rose-800 p-1"
                  title="Remove coupon"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="e.g. WELCOME10"
                    className="flex-1 text-xs uppercase font-bold p-2.5 rounded-xl border border-amber-200 bg-cream-50 outline-none focus:border-brand-orange"
                  />
                  <button
                    type="submit"
                    disabled={couponLoading || !couponCode.trim()}
                    className="px-4 py-2.5 bg-brand-chocolate hover:bg-brand-orange text-white text-xs font-bold rounded-xl transition-colors disabled:opacity-50"
                  >
                    {couponLoading ? 'Checking...' : 'Apply'}
                  </button>
                </div>
                {couponError && (
                  <p className="text-[11px] text-rose-500 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    {couponError}
                  </p>
                )}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[10px] text-gray-400">Try:</span>
                  {['WELCOME10', 'CUPDELIGHT', 'EATYOURDRINK'].map((sample) => (
                    <button
                      key={sample}
                      type="button"
                      onClick={() => setCouponCode(sample)}
                      className="text-[10px] font-semibold text-brand-orange bg-amber-50 px-2 py-0.5 rounded-md hover:bg-amber-100"
                    >
                      {sample}
                    </button>
                  ))}
                </div>
              </form>
            )}
          </div>

          {/* Bill Breakdown Summary Card */}
          <div className="bg-white p-6 rounded-3xl border border-amber-100 shadow-soft space-y-4">
            <h2 className="font-bold text-base text-brand-chocolate pb-3 border-b border-gray-100">
              Order Summary
            </h2>

            <div className="space-y-2.5 text-xs sm:text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({totalItems} items)</span>
                <span className="font-bold text-brand-chocolate">₹{subtotal}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Coupon Discount ({appliedCoupon?.code})</span>
                  <span>-₹{discountAmount}</span>
                </div>
              )}

              <div className="flex justify-between text-gray-600">
                <span>GST (5% F&B Bakery)</span>
                <span className="font-medium text-brand-chocolate">₹{taxAmount}</span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>Delivery Charges</span>
                <span>
                  {deliveryCharge === 0 ? (
                    <strong className="text-emerald-600">FREE</strong>
                  ) : (
                    <span className="font-medium">₹{deliveryCharge}</span>
                  )}
                </span>
              </div>

              <div className="pt-3 border-t border-gray-100 flex justify-between items-baseline">
                <span className="font-bold text-base text-brand-chocolate">Total Payable</span>
                <div className="text-right">
                  <span className="text-2xl font-black text-brand-orange">
                    ₹{grandTotal}
                  </span>
                  <span className="text-[10px] text-gray-400 block">All taxes included</span>
                </div>
              </div>
            </div>

            <Link
              href={{
                pathname: '/checkout',
                query: appliedCoupon ? { coupon: appliedCoupon.code, discount: discountAmount } : {},
              }}
              className="w-full py-4 bg-brand-orange hover:bg-brand-orange-hover text-white font-bold text-sm rounded-2xl shadow-hover flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
            >
              Proceed to Checkout <ArrowRight className="w-4 h-4" />
            </Link>

            <div className="pt-2 flex items-center justify-center gap-2 text-xs text-gray-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>100% Safe & Secure Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

