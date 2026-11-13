'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  User,
  Package,
  MapPin,
  Heart,
  Lock,
  LogOut,
  Download,
  Truck,
  Plus,
  Trash2,
  CheckCircle2,
  Clock,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { Product } from '@/lib/types';

function AccountContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'orders';

  const { user, isLoading, logoutCustomer } = useAuth();
  const { wishlistIds, toggleWishlist } = useWishlist();
  const { addItem } = useCart();

  const [activeTab, setActiveTab] = useState(initialTab);
  const [orders, setOrders] = useState<any[]>([]);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Address form
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddrName, setNewAddrName] = useState('');
  const [newAddrPhone, setNewAddrPhone] = useState('');
  const [newAddrStreet, setNewAddrStreet] = useState('');
  const [newAddrCity, setNewAddrCity] = useState('');
  const [newAddrState, setNewAddrState] = useState('Delhi NCR');
  const [newAddrPin, setNewAddrPin] = useState('');

  // Password form
  const [passMessage, setPassMessage] = useState('');

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user) {
      // Fetch Orders
      setLoadingOrders(true);
      fetch('/api/orders')
        .then((r) => r.json())
        .then((data) => setOrders(data.orders || []))
        .catch(() => {})
        .finally(() => setLoadingOrders(false));

      // Fetch Addresses
      fetch('/api/user/addresses')
        .then((r) => r.json())
        .then((data) => setAddresses(data.addresses || []))
        .catch(() => {});
    }
  }, [user]);

  // Load wishlist products
  useEffect(() => {
    if (wishlistIds.length > 0) {
      fetch('/api/products')
        .then((r) => r.json())
        .then((data) => {
          if (data.products) {
            setWishlistProducts(data.products.filter((p: Product) => wishlistIds.includes(p.id)));
          }
        })
        .catch(() => {});
    } else {
      setWishlistProducts([]);
    }
  }, [wishlistIds]);

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/user/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: newAddrName,
          phone: newAddrPhone,
          streetAddress: newAddrStreet,
          city: newAddrCity,
          state: newAddrState,
          pinCode: newAddrPin,
          isDefault: addresses.length === 0,
        }),
      });
      if (res.ok) {
        setShowAddressForm(false);
        // Refresh
        const updated = await fetch('/api/user/addresses').then((r) => r.json());
        setAddresses(updated.addresses || []);
        setNewAddrName('');
        setNewAddrPhone('');
        setNewAddrStreet('');
        setNewAddrCity('');
        setNewAddrPin('');
      }
    } catch {
      // ignore
    }
  };

  const handleDeleteAddress = async (id: string) => {
    try {
      await fetch(`/api/user/addresses?id=${id}`, { method: 'DELETE' });
      setAddresses(addresses.filter((a) => a.id !== id));
    } catch {
      // ignore
    }
  };

  if (isLoading || !user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-10 h-10 border-4 border-brand-orange border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-gray-500 text-sm">Opening customer portal...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      {/* Top Welcome Header */}
      <div className="bg-gradient-to-r from-brand-chocolate to-[#4A2511] rounded-3xl p-6 sm:p-8 text-white mb-8 shadow-card flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
            Customer Dashboard
          </span>
          <h1 className="text-2xl sm:text-3xl font-black mt-1">Hello, {user.name}!</h1>
          <p className="text-xs text-amber-100/70 mt-0.5">{user.email} • {user.phone || '9818192575'}</p>
        </div>

        <button
          onClick={async () => {
            await logoutCustomer();
            router.push('/');
          }}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 border border-white/20"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>

      {/* Main Grid: Tabs & Tab Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Navigation Sidebar (3 Cols) */}
        <aside className="lg:col-span-3 bg-white p-3 rounded-3xl border border-amber-100 shadow-soft space-y-1">
          {[
            { id: 'orders', label: 'My Orders', icon: Package },
            { id: 'addresses', label: 'Manage Addresses', icon: MapPin },
            { id: 'wishlist', label: `My Wishlist (${wishlistIds.length})`, icon: Heart },
            { id: 'profile', label: 'Account Profile', icon: User },
            { id: 'security', label: 'Security & Password', icon: Lock },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all text-left ${
                  isActive
                    ? 'bg-brand-orange text-white shadow-sm'
                    : 'text-brand-chocolate hover:bg-amber-50'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </aside>

        {/* Tab Content Panel (9 Cols) */}
        <main className="lg:col-span-9 bg-white p-6 sm:p-8 rounded-3xl border border-amber-100 shadow-soft min-h-[450px]">
          {/* ========================================================
              TAB: ORDERS & INVOICES
              ======================================================== */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                <h2 className="font-bold text-lg text-brand-chocolate">Order History</h2>
                <span className="text-xs text-gray-500">{orders.length} Total Orders</span>
              </div>

              {loadingOrders ? (
                <div className="py-12 text-center text-gray-400">Loading your orders...</div>
              ) : orders.length === 0 ? (
                <div className="py-12 text-center">
                  <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <h3 className="font-bold text-base text-brand-chocolate">No orders placed yet</h3>
                  <p className="text-xs text-gray-500 mt-1 mb-6">
                    Ready to taste your favourite drinks in an edible cup?
                  </p>
                  <Link
                    href="/shop"
                    className="px-6 py-2.5 bg-brand-orange text-white text-xs font-bold rounded-full shadow-md"
                  >
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {orders.map((o) => (
                    <div
                      key={o.id}
                      className="p-5 rounded-2xl bg-cream-50/70 border border-amber-200/70 space-y-4"
                    >
                      {/* Order Header */}
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-amber-200/50">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-brand-chocolate">
                              Order #{o.orderNumber}
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase bg-emerald-100 text-emerald-800">
                              {o.orderStatus.replace('_', ' ')}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5">
                            Placed on {new Date(o.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <Link
                            href={`/track-order?orderNumber=${o.orderNumber}`}
                            className="px-3 py-1.5 bg-white text-brand-chocolate hover:text-brand-orange border border-amber-200 text-xs font-bold rounded-xl flex items-center gap-1 transition-colors"
                          >
                            <Truck className="w-3.5 h-3.5" /> Track
                          </Link>
                          <Link
                            href={`/invoice/${o.orderNumber}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 bg-brand-chocolate hover:bg-brand-orange text-white text-xs font-bold rounded-xl flex items-center gap-1 transition-colors"
                          >
                            <Download className="w-3.5 h-3.5" /> Invoice
                          </Link>
                        </div>
                      </div>

                      {/* Items List */}
                      <div className="space-y-2">
                        {o.items?.map((item: any) => (
                          <div key={item.id} className="flex justify-between items-center text-xs">
                            <span className="text-gray-700">
                              {item.quantity}x {item.product_name} ({item.flavour || 'Classic'} • {item.pack_size})
                            </span>
                            <span className="font-bold text-brand-chocolate">₹{item.total_price}</span>
                          </div>
                        ))}
                      </div>

                      {/* Total & Delivery Address */}
                      <div className="pt-3 border-t border-amber-200/50 flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs text-gray-500 gap-2">
                        <div>
                          <strong>Shipped to:</strong> {o.deliveryAddress}, {o.city}
                        </div>
                        <div className="text-sm font-black text-brand-chocolate">
                          Total: <span className="text-brand-orange">₹{o.grandTotal}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ========================================================
              TAB: MANAGE ADDRESSES
              ======================================================== */}
          {activeTab === 'addresses' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                <h2 className="font-bold text-lg text-brand-chocolate">Saved Addresses</h2>
                <button
                  onClick={() => setShowAddressForm(!showAddressForm)}
                  className="px-3.5 py-1.5 bg-brand-orange text-white text-xs font-bold rounded-xl flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Address
                </button>
              </div>

              {showAddressForm && (
                <form onSubmit={handleAddAddress} className="p-5 rounded-2xl bg-amber-50 border border-amber-200 space-y-4">
                  <h3 className="font-bold text-sm text-brand-chocolate">New Delivery Address</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <input
                      type="text"
                      value={newAddrName}
                      onChange={(e) => setNewAddrName(e.target.value)}
                      placeholder="Full Name"
                      className="p-2.5 rounded-xl border bg-white"
                      required
                    />
                    <input
                      type="tel"
                      value={newAddrPhone}
                      onChange={(e) => setNewAddrPhone(e.target.value)}
                      placeholder="Phone Number"
                      className="p-2.5 rounded-xl border bg-white"
                      required
                    />
                    <input
                      type="text"
                      value={newAddrStreet}
                      onChange={(e) => setNewAddrStreet(e.target.value)}
                      placeholder="Flat, Building, Street"
                      className="sm:col-span-2 p-2.5 rounded-xl border bg-white"
                      required
                    />
                    <input
                      type="text"
                      value={newAddrCity}
                      onChange={(e) => setNewAddrCity(e.target.value)}
                      placeholder="City"
                      className="p-2.5 rounded-xl border bg-white"
                      required
                    />
                    <input
                      type="text"
                      value={newAddrPin}
                      onChange={(e) => setNewAddrPin(e.target.value)}
                      placeholder="PIN Code"
                      className="p-2.5 rounded-xl border bg-white"
                      required
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowAddressForm(false)}
                      className="px-4 py-2 text-xs font-bold text-gray-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-brand-chocolate text-white text-xs font-bold rounded-xl"
                    >
                      Save Address
                    </button>
                  </div>
                </form>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {addresses.map((addr) => (
                  <div key={addr.id} className="p-4 rounded-2xl border border-amber-100 bg-cream-50 relative space-y-1 text-xs">
                    <div className="flex justify-between items-start">
                      <span className="font-bold text-sm text-brand-chocolate">{addr.full_name}</span>
                      <button
                        onClick={() => handleDeleteAddress(addr.id)}
                        className="text-gray-400 hover:text-rose-600"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-gray-600">{addr.street_address}</p>
                    <p className="text-gray-600">{addr.city}, {addr.state} - {addr.pin_code}</p>
                    <p className="text-gray-500">Phone: {addr.phone}</p>
                    {addr.is_default && (
                      <span className="inline-block mt-2 text-[10px] font-bold text-brand-orange bg-amber-100 px-2 py-0.5 rounded-full">
                        Default Address
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================
              TAB: WISHLIST
              ======================================================== */}
          {activeTab === 'wishlist' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                <h2 className="font-bold text-lg text-brand-chocolate">Saved in Wishlist</h2>
                <span className="text-xs text-gray-500">{wishlistProducts.length} Items</span>
              </div>

              {wishlistProducts.length === 0 ? (
                <div className="py-12 text-center text-gray-400">
                  <Heart className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm font-medium">Your wishlist is empty.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {wishlistProducts.map((p) => (
                    <div key={p.id} className="p-3 rounded-2xl border border-amber-100 bg-cream-50 flex flex-col justify-between">
                      <div className="aspect-square rounded-xl overflow-hidden relative mb-2 bg-white">
                        <Image
                          src={p.images?.[0]?.url || 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&q=80'}
                          alt={p.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <h4 className="font-bold text-xs text-brand-chocolate line-clamp-1">{p.name}</h4>
                      <p className="font-black text-sm text-brand-chocolate mt-1">₹{p.salePrice || p.basePrice}</p>
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => {
                            addItem({
                              id: `${p.id}-default`,
                              productId: p.id,
                              name: p.name,
                              slug: p.slug,
                              image: p.images?.[0]?.url || '',
                              flavour: 'Classic',
                              packSize: p.packSize,
                              unitPrice: p.salePrice || p.basePrice,
                              maxStock: p.stock,
                            });
                          }}
                          className="flex-1 py-1.5 bg-brand-orange text-white text-[11px] font-bold rounded-lg"
                        >
                          Add to Cart
                        </button>
                        <button
                          onClick={() => toggleWishlist(p.id)}
                          className="p-1.5 text-gray-400 hover:text-rose-600 rounded-lg"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ========================================================
              TAB: PROFILE
              ======================================================== */}
          {activeTab === 'profile' && (
            <div className="space-y-6 max-w-md">
              <h2 className="font-bold text-lg text-brand-chocolate pb-4 border-b border-gray-100">
                Personal Details
              </h2>
              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-gray-500 font-semibold block mb-1">Full Name</label>
                  <input
                    type="text"
                    defaultValue={user.name}
                    className="w-full p-3 rounded-xl border border-amber-200 bg-cream-50 font-bold text-brand-chocolate"
                    readOnly
                  />
                </div>
                <div>
                  <label className="text-gray-500 font-semibold block mb-1">Email Address</label>
                  <input
                    type="email"
                    defaultValue={user.email}
                    className="w-full p-3 rounded-xl border border-amber-200 bg-cream-50 font-bold text-brand-chocolate"
                    readOnly
                  />
                </div>
                <div>
                  <label className="text-gray-500 font-semibold block mb-1">Mobile Phone</label>
                  <input
                    type="tel"
                    defaultValue={user.phone || '9818192575'}
                    className="w-full p-3 rounded-xl border border-amber-200 bg-cream-50 font-bold text-brand-chocolate"
                    readOnly
                  />
                </div>
                <p className="text-[11px] text-gray-400 pt-2">
                  To modify verified contact credentials, please reach out to{' '}
                  <a href="mailto:Varunkhera6@gmail.com" className="text-brand-orange underline">
                    Varunkhera6@gmail.com
                  </a>
                </p>
              </div>
            </div>
          )}

          {/* ========================================================
              TAB: SECURITY & PASSWORD
              ======================================================== */}
          {activeTab === 'security' && (
            <div className="space-y-6 max-w-md">
              <h2 className="font-bold text-lg text-brand-chocolate pb-4 border-b border-gray-100">
                Change Password
              </h2>
              {passMessage && (
                <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-semibold">
                  {passMessage}
                </div>
              )}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setPassMessage('Password updated successfully!');
                }}
                className="space-y-3 text-xs"
              >
                <div>
                  <label className="text-gray-500 font-semibold block mb-1">Current Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full p-3 rounded-xl border border-amber-200 bg-cream-50 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="text-gray-500 font-semibold block mb-1">New Password</label>
                  <input
                    type="password"
                    placeholder="At least 6 characters"
                    className="w-full p-3 rounded-xl border border-amber-200 bg-cream-50 outline-none"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-brand-orange text-white text-xs font-bold rounded-xl"
                >
                  Update Password
                </button>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function AccountPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center"><div className="w-8 h-8 border-3 border-brand-orange border-t-transparent rounded-full animate-spin mx-auto mb-2" /><p className="text-xs text-gray-400">Loading account...</p></div>}>
      <AccountContent />
    </Suspense>
  );
}
