'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Truck } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function CartDrawer() {
  const { isCartOpen, setIsCartOpen, items, updateQuantity, removeItem, subtotal, totalItems } = useCart();

  const freeShippingThreshold = 499;
  const remainingForFreeShip = Math.max(0, freeShippingThreshold - subtotal);
  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm animate-fadeIn">
      {/* Backdrop click */}
      <div className="flex-1" onClick={() => setIsCartOpen(false)} />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 animate-slideLeft">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-cream-50">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-brand-orange" />
            <h3 className="font-bold text-lg text-brand-chocolate">Your Cart ({totalItems})</h3>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 text-gray-400 hover:text-brand-chocolate rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Bar */}
        <div className="px-5 py-3 bg-amber-50/80 border-b border-amber-100">
          <div className="flex items-center gap-2 text-xs font-medium text-brand-chocolate">
            <Truck className="w-4 h-4 text-brand-orange shrink-0" />
            {remainingForFreeShip > 0 ? (
              <span>Add <strong className="text-brand-orange">₹{remainingForFreeShip}</strong> more for <strong>FREE Delivery</strong>!</span>
            ) : (
              <span className="text-emerald-700 font-bold">🎉 Congratulations! You unlocked FREE Delivery!</span>
            )}
          </div>
          <div className="w-full h-1.5 bg-amber-200/60 rounded-full mt-2 overflow-hidden">
            <div
              className="h-full bg-brand-orange rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="w-20 h-20 rounded-full bg-amber-50 flex items-center justify-center mb-4 text-amber-500">
                <ShoppingBag className="w-10 h-10 stroke-1" />
              </div>
              <h4 className="font-bold text-brand-chocolate text-lg">Your cart is empty</h4>
              <p className="text-sm text-gray-500 max-w-xs mt-1 mb-6">
                Discover our delicious edible cookie cups and start your zero-waste journey!
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="px-6 py-2.5 bg-brand-orange hover:bg-brand-orange-hover text-white text-sm font-semibold rounded-full shadow-md transition-colors"
              >
                Shop Popular Flavours
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 p-3 rounded-2xl bg-cream-50 border border-amber-100/60 hover:border-amber-200 transition-all"
              >
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-white shrink-0 relative border border-gray-100">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-1">
                      <h4 className="font-semibold text-brand-chocolate text-sm line-clamp-1">
                        {item.name}
                      </h4>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors p-1"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[11px] text-gray-500">{item.flavour}</span>
                      <span className="text-[11px] text-amber-800 bg-amber-100/70 px-1.5 py-0.5 rounded">
                        {item.packSize}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center border border-amber-200 rounded-lg bg-white overflow-hidden shadow-xs">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 hover:bg-amber-50 text-gray-600 transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2.5 text-xs font-bold text-brand-chocolate">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 hover:bg-amber-50 text-gray-600 transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <span className="font-bold text-sm text-brand-chocolate">
                      ₹{item.unitPrice * item.quantity}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Summary */}
        {items.length > 0 && (
          <div className="p-5 border-t border-gray-100 bg-white space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-bold text-brand-chocolate text-base">₹{subtotal}</span>
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>Delivery Charges</span>
              <span>{subtotal >= 499 ? <strong className="text-emerald-600">FREE</strong> : '₹50'}</span>
            </div>
            <p className="text-[11px] text-gray-400">
              Taxes & coupons calculated at checkout.
            </p>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <Link
                href="/cart"
                onClick={() => setIsCartOpen(false)}
                className="py-3 px-4 text-center rounded-xl font-semibold text-sm border-2 border-brand-chocolate text-brand-chocolate hover:bg-brand-chocolate hover:text-white transition-all"
              >
                View Cart
              </Link>
              <Link
                href="/checkout"
                onClick={() => setIsCartOpen(false)}
                className="py-3 px-4 text-center rounded-xl font-bold text-sm bg-brand-orange hover:bg-brand-orange-hover text-white shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1.5"
              >
                Checkout <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

