'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Boxes,
  Tag,
  MessageSquare,
  Settings,
  LogOut,
  TrendingUp,
  DollarSign,
  Users,
  AlertTriangle,
  Plus,
  Trash2,
  Edit,
  Download,
  ExternalLink,
  CheckCircle,
  Clock,
  Search,
  Filter,
  RefreshCw,
  Eye,
  Truck,
  Sparkles,
  ShieldCheck,
  X,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Product, CouponType } from '@/lib/types';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { adminUser, isLoading, logoutAdmin } = useAuth();

  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'inventory' | 'coupons' | 'messages' | 'settings'>('overview');

  // Stats Data
  const [stats, setStats] = useState<any>(null);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [bestSellers, setBestSellers] = useState<any[]>([]);

  // Products Data
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  // Orders Data
  const [allOrders, setAllOrders] = useState<any[]>([]);
  const [orderFilter, setOrderFilter] = useState('ALL');
  const [orderSearch, setOrderSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  // Inventory Data
  const [inventoryList, setInventoryList] = useState<any[]>([]);
  const [inventoryLogs, setInventoryLogs] = useState<any[]>([]);
  const [adjustProductId, setAdjustProductId] = useState('');
  const [adjustQty, setAdjustQty] = useState(20);
  const [adjustReason, setAdjustReason] = useState('Fresh Bakery Restock');

  // Coupons Data
  const [coupons, setCoupons] = useState<any[]>([]);
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponVal, setNewCouponVal] = useState(10);
  const [newCouponMin, setNewCouponMin] = useState(299);
  const [newCouponDesc, setNewCouponDesc] = useState('');

  // Messages Data
  const [messages, setMessages] = useState<any[]>([]);

  // Settings Data
  const [settings, setSettings] = useState<Record<string, string>>({
    announcement_bar: '🎉 Free Express Delivery on orders above ₹499! Use code WELCOME10 for 10% OFF',
    whatsapp_support: '9818192575',
    contact_email: 'Varunkhera6@gmail.com',
    shipping_flat_rate: '50',
    free_shipping_threshold: '499',
  });
  const [settingsSaved, setSettingsSaved] = useState(false);

  // New Product Form State
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState('');
  const [newProdBasePrice, setNewProdBasePrice] = useState(399);
  const [newProdSalePrice, setNewProdSalePrice] = useState(349);
  const [newProdStock, setNewProdStock] = useState(50);
  const [newProdPackSize, setNewProdPackSize] = useState('Pack of 4');
  const [newProdTagline, setNewProdTagline] = useState('');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdImg, setNewProdImg] = useState('https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=900&q=80');
  const [newProdFeatured, setNewProdFeatured] = useState(true);
  const [newProdBestSeller, setNewProdBestSeller] = useState(false);

  // Verify Admin Authentication
  useEffect(() => {
    if (!isLoading && !adminUser) {
      router.push('/admin/login');
    }
  }, [adminUser, isLoading, router]);

  // Load Tab Specific Data
  const loadDashboardData = async () => {
    try {
      const statsRes = await fetch('/api/admin/stats');
      if (statsRes.ok) {
        const d = await statsRes.json();
        setStats(d.stats);
        setRecentOrders(d.recentOrders || []);
        setBestSellers(d.bestSellers || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const loadProductsData = async () => {
    try {
      const [pRes, cRes] = await Promise.all([fetch('/api/products'), fetch('/api/categories')]);
      if (pRes.ok) setProducts((await pRes.json()).products || []);
      if (cRes.ok) {
        const cats = (await cRes.json()).categories || [];
        setCategories(cats);
        if (cats.length > 0 && !newProdCategory) setNewProdCategory(cats[0].id);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const loadOrdersData = async () => {
    try {
      const res = await fetch('/api/orders');
      if (res.ok) setAllOrders((await res.json()).orders || []);
    } catch (e) {
      console.error(e);
    }
  };

  const loadInventoryData = async () => {
    try {
      const res = await fetch('/api/inventory');
      if (res.ok) {
        const d = await res.json();
        setInventoryList(d.inventory || []);
        setInventoryLogs(d.logs || []);
        if (d.inventory?.length > 0 && !adjustProductId) {
          setAdjustProductId(d.inventory[0].product_id);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const loadCouponsData = async () => {
    try {
      const res = await fetch('/api/coupons');
      if (res.ok) setCoupons((await res.json()).coupons || []);
    } catch (e) {
      console.error(e);
    }
  };

  const loadMessagesData = async () => {
    try {
      const res = await fetch('/api/contact');
      if (res.ok) setMessages((await res.json()).messages || []);
    } catch (e) {
      console.error(e);
    }
  };

  const loadSettingsData = async () => {
    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const d = await res.json();
        if (d.settings) setSettings((prev) => ({ ...prev, ...d.settings }));
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (adminUser) {
      loadDashboardData();
      loadProductsData();
      loadOrdersData();
      loadInventoryData();
      loadCouponsData();
      loadMessagesData();
      loadSettingsData();
    }
  }, [adminUser]);

  // Handlers for Products
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newProdName,
          categoryId: newProdCategory,
          basePrice: newProdBasePrice,
          salePrice: newProdSalePrice,
          stock: newProdStock,
          packSize: newProdPackSize,
          tagline: newProdTagline,
          description: newProdDesc,
          imageUrl: newProdImg,
          isFeatured: newProdFeatured,
          isBestSeller: newProdBestSeller,
        }),
      });
      if (res.ok) {
        setShowAddProduct(false);
        loadProductsData();
        loadDashboardData();
        // Reset form
        setNewProdName('');
        setNewProdTagline('');
        setNewProdDesc('');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await fetch(`/api/products/${id}`, { method: 'DELETE' });
      loadProductsData();
      loadDashboardData();
    } catch (e) {
      console.error(e);
    }
  };

  // Handlers for Orders
  const handleUpdateOrderStatus = async (orderId: string, status: string, trackingNum?: string, courier?: string) => {
    try {
      await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderStatus: status,
          trackingNumber: trackingNum,
          courierName: courier || 'Delhivery Express',
        }),
      });
      loadOrdersData();
      loadDashboardData();
    } catch (e) {
      console.error(e);
    }
  };

  // Handlers for Inventory
  const handleStockAdjust = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustProductId) return;
    try {
      await fetch('/api/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: adjustProductId,
          changeQuantity: adjustQty,
          reason: adjustReason,
        }),
      });
      loadInventoryData();
      loadProductsData();
      loadDashboardData();
    } catch (e) {
      console.error(e);
    }
  };

  // Handlers for Coupons
  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode) return;
    try {
      await fetch('/api/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: newCouponCode,
          discountType: 'PERCENT',
          discountValue: newCouponVal,
          minOrderValue: newCouponMin,
          description: newCouponDesc,
        }),
      });
      setNewCouponCode('');
      setNewCouponDesc('');
      loadCouponsData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteCoupon = async (id: string) => {
    try {
      await fetch(`/api/coupons?id=${id}`, { method: 'DELETE' });
      loadCouponsData();
    } catch (e) {
      console.error(e);
    }
  };

  // Handlers for Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings }),
      });
      setSettingsSaved(true);
      setTimeout(() => setSettingsSaved(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  if (isLoading || !adminUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-100">
        <div className="w-10 h-10 border-4 border-brand-orange border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const filteredOrders = allOrders.filter((o) => {
    if (orderFilter !== 'ALL' && o.orderStatus !== orderFilter) return false;
    if (orderSearch) {
      const term = orderSearch.toLowerCase();
      return (
        o.orderNumber.toLowerCase().includes(term) ||
        o.customerName.toLowerCase().includes(term) ||
        o.customerEmail.toLowerCase().includes(term) ||
        o.customerPhone.includes(term)
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-cream-100 flex flex-col">
      {/* Top Admin Bar */}
      <header className="bg-brand-chocolate text-white px-6 py-4 flex items-center justify-between border-b border-amber-900/40 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-brand-orange flex items-center justify-center font-black">
            ☕
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-lg">CUP2EAT Admin</span>
              <span className="bg-emerald-950 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                PROD-READY
              </span>
            </div>
            <p className="text-[11px] text-amber-200/70">Eat Your Drink! • Master Dashboard</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/"
            target="_blank"
            className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-amber-200 hover:text-white bg-white/10 px-3 py-1.5 rounded-xl border border-white/15"
          >
            <span>Live Storefront</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <div className="flex items-center gap-2 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold">{adminUser.name}</span>
          </div>

          <button
            onClick={async () => {
              await logoutAdmin();
              router.push('/admin/login');
            }}
            className="p-2 text-amber-200/70 hover:text-rose-400 hover:bg-white/10 rounded-xl transition-colors"
            title="Sign out of admin"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none bg-white p-2 rounded-2xl border border-amber-200 shadow-soft">
          {[
            { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'orders', label: `Orders (${allOrders.length})`, icon: ShoppingCart },
            { id: 'products', label: `Products (${products.length})`, icon: Package },
            { id: 'inventory', label: 'Stock & Inventory', icon: Boxes },
            { id: 'coupons', label: 'Coupons & Offers', icon: Tag },
            { id: 'messages', label: `Inquiries (${messages.length})`, icon: MessageSquare },
            { id: 'settings', label: 'Store Settings', icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-brand-orange text-white shadow-sm'
                    : 'text-brand-chocolate hover:bg-cream-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ========================================================
            TAB 1: OVERVIEW DASHBOARD
            ======================================================== */}
        {activeTab === 'overview' && stats && (
          <div className="space-y-8">
            {/* KPI Cards Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-amber-100 shadow-soft text-center sm:text-left">
                <span className="text-[11px] font-bold text-gray-400 uppercase">Total Revenue</span>
                <p className="text-xl font-black text-brand-chocolate mt-1">₹{stats.totalRevenue.toLocaleString()}</p>
                <span className="text-[10px] text-emerald-600 font-bold">Paid Orders</span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-amber-100 shadow-soft text-center sm:text-left">
                <span className="text-[11px] font-bold text-gray-400 uppercase">Total Orders</span>
                <p className="text-xl font-black text-brand-chocolate mt-1">{stats.totalOrders}</p>
                <span className="text-[10px] text-brand-orange font-bold">Lifetime</span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-amber-100 shadow-soft text-center sm:text-left">
                <span className="text-[11px] font-bold text-gray-400 uppercase">Pending</span>
                <p className="text-xl font-black text-amber-600 mt-1">{stats.pendingOrders}</p>
                <span className="text-[10px] text-gray-400 font-medium">To Dispatch</span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-amber-100 shadow-soft text-center sm:text-left">
                <span className="text-[11px] font-bold text-gray-400 uppercase">Delivered</span>
                <p className="text-xl font-black text-emerald-600 mt-1">{stats.deliveredOrders}</p>
                <span className="text-[10px] text-emerald-600 font-medium">Completed</span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-amber-100 shadow-soft text-center sm:text-left">
                <span className="text-[11px] font-bold text-gray-400 uppercase">Customers</span>
                <p className="text-xl font-black text-brand-chocolate mt-1">{stats.totalCustomers}</p>
                <span className="text-[10px] text-gray-400 font-medium">Registered</span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-amber-100 shadow-soft text-center sm:text-left">
                <span className="text-[11px] font-bold text-gray-400 uppercase">Products</span>
                <p className="text-xl font-black text-brand-chocolate mt-1">{stats.totalProducts}</p>
                <span className="text-[10px] text-gray-400 font-medium">In Catalog</span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-rose-200 bg-rose-50/50 shadow-soft text-center sm:text-left">
                <span className="text-[11px] font-bold text-rose-500 uppercase">Low Stock</span>
                <p className="text-xl font-black text-rose-600 mt-1">{stats.lowStockProducts}</p>
                <span className="text-[10px] text-rose-500 font-bold">&lt; 15 units</span>
              </div>
            </div>

            {/* Quick Overview Layout: Recent Orders + Best Sellers */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Recent Orders (8 cols) */}
              <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-amber-100 shadow-soft space-y-4">
                <div className="flex justify-between items-center pb-3 border-b">
                  <h3 className="font-bold text-base text-brand-chocolate flex items-center gap-2">
                    <Clock className="w-4 h-4 text-brand-orange" />
                    Recent Customer Orders
                  </h3>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs font-bold text-brand-orange hover:underline"
                  >
                    View All Orders →
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-cream-50 text-gray-400 uppercase font-bold text-[10px]">
                      <tr>
                        <th className="p-3">Order Number</th>
                        <th className="p-3">Customer</th>
                        <th className="p-3">Amount</th>
                        <th className="p-3">Payment</th>
                        <th className="p-3">Order Status</th>
                        <th className="p-3">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 font-medium">
                      {recentOrders.map((ord) => (
                        <tr key={ord.id} className="hover:bg-amber-50/50">
                          <td className="p-3 font-mono font-bold text-brand-chocolate">{ord.order_number}</td>
                          <td className="p-3 font-bold">{ord.customer_name}</td>
                          <td className="p-3 font-black text-brand-chocolate">₹{ord.grand_total}</td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                ord.payment_status === 'PAID'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {ord.payment_status}
                            </span>
                          </td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-brand-chocolate uppercase">
                              {ord.order_status.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="p-3">
                            <Link
                              href={`/invoice/${ord.order_number}`}
                              target="_blank"
                              className="text-brand-orange hover:underline font-bold"
                            >
                              Invoice
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Top Selling Products (4 cols) */}
              <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-amber-100 shadow-soft space-y-4">
                <h3 className="font-bold text-base text-brand-chocolate pb-3 border-b flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-brand-orange" />
                  Top Selling Edible Cups
                </h3>

                <div className="space-y-3">
                  {bestSellers.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-cream-50">
                      <div className="w-12 h-12 rounded-xl bg-amber-50 overflow-hidden relative shrink-0 border border-gray-100">
                        <Image
                          src={item.image_url || 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&q=80'}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-xs text-brand-chocolate truncate">{item.name}</h4>
                        <p className="text-[11px] text-gray-500">
                          Stock: {item.stock} • ₹{item.sale_price || item.base_price}
                        </p>
                      </div>
                      <span className="text-[11px] font-bold text-brand-orange bg-amber-50 px-2 py-1 rounded-lg">
                        {item.units_ordered} sold
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 2: ORDERS MANAGEMENT
            ======================================================== */}
        {activeTab === 'orders' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-amber-100 shadow-soft space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b">
              <div>
                <h2 className="text-xl font-black text-brand-chocolate">Customer Orders</h2>
                <p className="text-xs text-gray-500">Manage orders, update status, and courier tracking details.</p>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-3">
                <input
                  type="text"
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  placeholder="Search order #, customer..."
                  className="text-xs p-2.5 rounded-xl border border-amber-200 bg-cream-50 outline-none w-48"
                />
                <select
                  value={orderFilter}
                  onChange={(e) => setOrderFilter(e.target.value)}
                  className="text-xs p-2.5 rounded-xl border border-amber-200 bg-cream-50 font-bold outline-none"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="PENDING">Pending</option>
                  <option value="PAYMENT_CONFIRMED">Payment Confirmed</option>
                  <option value="ORDER_ACCEPTED">Order Accepted</option>
                  <option value="PROCESSING">Processing</option>
                  <option value="PACKED">Packed</option>
                  <option value="SHIPPED">Shipped</option>
                  <option value="DELIVERED">Delivered</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-cream-50 text-gray-400 uppercase font-bold text-[10px]">
                  <tr>
                    <th className="p-3">Order #</th>
                    <th className="p-3">Date</th>
                    <th className="p-3">Customer</th>
                    <th className="p-3">Items</th>
                    <th className="p-3">Total</th>
                    <th className="p-3">Payment</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Courier AWB</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium">
                  {filteredOrders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-amber-50/40">
                      <td className="p-3 font-mono font-bold text-brand-chocolate">{ord.orderNumber}</td>
                      <td className="p-3 text-gray-500">{new Date(ord.createdAt).toLocaleDateString()}</td>
                      <td className="p-3">
                        <p className="font-bold text-brand-chocolate">{ord.customerName}</p>
                        <p className="text-[10px] text-gray-400">{ord.customerPhone}</p>
                      </td>
                      <td className="p-3">
                        {ord.items?.length || 1} items
                        <p className="text-[10px] text-gray-400 line-clamp-1">
                          {ord.items?.map((i: any) => i.product_name).join(', ')}
                        </p>
                      </td>
                      <td className="p-3 font-black text-brand-chocolate">₹{ord.grandTotal}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            ord.paymentStatus === 'PAID' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {ord.paymentStatus}
                        </span>
                      </td>
                      <td className="p-3">
                        <select
                          value={ord.orderStatus}
                          onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value, ord.trackingNumber, ord.courierName)}
                          className="text-[11px] font-bold p-1 rounded-lg border border-amber-200 bg-white"
                        >
                          <option value="PENDING">Pending</option>
                          <option value="PAYMENT_CONFIRMED">Payment Confirmed</option>
                          <option value="ORDER_ACCEPTED">Order Accepted</option>
                          <option value="PROCESSING">Processing</option>
                          <option value="PACKED">Packed</option>
                          <option value="SHIPPED">Shipped</option>
                          <option value="DELIVERED">Delivered</option>
                          <option value="CANCELLED">Cancelled</option>
                        </select>
                      </td>
                      <td className="p-3">
                        <input
                          type="text"
                          defaultValue={ord.trackingNumber || ''}
                          placeholder="Assign AWB"
                          onBlur={(e) => handleUpdateOrderStatus(ord.id, ord.orderStatus, e.target.value, ord.courierName)}
                          className="w-28 text-[11px] p-1 border rounded bg-cream-50 font-mono"
                        />
                      </td>
                      <td className="p-3 flex items-center gap-2">
                        <Link
                          href={`/invoice/${ord.orderNumber}`}
                          target="_blank"
                          className="p-1.5 text-brand-chocolate hover:text-brand-orange bg-cream-50 rounded-lg"
                          title="View / Download Invoice"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </Link>
                        <Link
                          href={`/track-order?orderNumber=${ord.orderNumber}`}
                          target="_blank"
                          className="p-1.5 text-brand-chocolate hover:text-brand-orange bg-cream-50 rounded-lg"
                          title="Track Order Progress"
                        >
                          <Truck className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 3: PRODUCTS MANAGEMENT
            ======================================================== */}
        {activeTab === 'products' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-amber-100 shadow-soft space-y-6">
            <div className="flex justify-between items-center pb-4 border-b">
              <div>
                <h2 className="text-xl font-black text-brand-chocolate">Product Catalog</h2>
                <p className="text-xs text-gray-500">Add new flavours, update pricing, stock, and descriptions.</p>
              </div>

              <button
                onClick={() => setShowAddProduct(true)}
                className="px-4 py-2 bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md"
              >
                <Plus className="w-4 h-4" /> Add New Product
              </button>
            </div>

            {/* Products Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-cream-50 text-gray-400 uppercase font-bold text-[10px]">
                  <tr>
                    <th className="p-3">Product</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Base Price</th>
                    <th className="p-3">Sale Price</th>
                    <th className="p-3">Stock Units</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Featured / Best Seller</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-amber-50/40">
                      <td className="p-3 flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-amber-50 overflow-hidden relative shrink-0 border border-gray-100">
                          <Image
                            src={p.images?.[0]?.url || 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&q=80'}
                            alt={p.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-bold text-brand-chocolate text-xs">{p.name}</p>
                          <span className="text-[10px] text-gray-400 font-mono">{p.sku}</span>
                        </div>
                      </td>
                      <td className="p-3 text-gray-600">{p.category?.name || 'General'}</td>
                      <td className="p-3 font-semibold text-gray-500">₹{p.basePrice}</td>
                      <td className="p-3 font-black text-brand-chocolate">₹{p.salePrice || p.basePrice}</td>
                      <td className="p-3">
                        <span
                          className={`font-bold ${
                            p.stock <= 10 ? 'text-rose-600' : 'text-emerald-700'
                          }`}
                        >
                          {p.stock} units
                        </span>
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            p.stock > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {p.stock > 0 ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </td>
                      <td className="p-3 flex items-center gap-1.5 pt-4">
                        {p.isFeatured && (
                          <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 py-0.5 rounded">
                            Featured
                          </span>
                        )}
                        {p.isBestSeller && (
                          <span className="bg-brand-chocolate text-amber-200 text-[10px] font-bold px-1.5 py-0.5 rounded">
                            Best Seller
                          </span>
                        )}
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/product/${p.slug}`}
                            target="_blank"
                            className="p-1.5 text-gray-400 hover:text-brand-orange"
                            title="View product page"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            className="p-1.5 text-gray-400 hover:text-rose-600"
                            title="Delete product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Modal: Add New Product */}
            {showAddProduct && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
                <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-4 border border-amber-100 shadow-2xl">
                  <div className="flex justify-between items-center pb-2 border-b">
                    <h3 className="font-bold text-lg text-brand-chocolate">Add New CUP2EAT Product</h3>
                    <button onClick={() => setShowAddProduct(false)} className="text-gray-400 hover:text-gray-600">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="font-semibold text-gray-600 block mb-1">Product Name *</label>
                        <input
                          type="text"
                          value={newProdName}
                          onChange={(e) => setNewProdName(e.target.value)}
                          placeholder="e.g. Pistachio Praline Edible Cup"
                          className="w-full p-2.5 rounded-xl border bg-cream-50"
                          required
                        />
                      </div>

                      <div>
                        <label className="font-semibold text-gray-600 block mb-1">Category *</label>
                        <select
                          value={newProdCategory}
                          onChange={(e) => setNewProdCategory(e.target.value)}
                          className="w-full p-2.5 rounded-xl border bg-cream-50"
                        >
                          {categories.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="font-semibold text-gray-600 block mb-1">Base Price (₹) *</label>
                        <input
                          type="number"
                          value={newProdBasePrice}
                          onChange={(e) => setNewProdBasePrice(Number(e.target.value))}
                          className="w-full p-2.5 rounded-xl border bg-cream-50"
                          required
                        />
                      </div>

                      <div>
                        <label className="font-semibold text-gray-600 block mb-1">Sale Price (₹)</label>
                        <input
                          type="number"
                          value={newProdSalePrice}
                          onChange={(e) => setNewProdSalePrice(Number(e.target.value))}
                          className="w-full p-2.5 rounded-xl border bg-cream-50"
                        />
                      </div>

                      <div>
                        <label className="font-semibold text-gray-600 block mb-1">Initial Stock (Units) *</label>
                        <input
                          type="number"
                          value={newProdStock}
                          onChange={(e) => setNewProdStock(Number(e.target.value))}
                          className="w-full p-2.5 rounded-xl border bg-cream-50"
                          required
                        />
                      </div>

                      <div>
                        <label className="font-semibold text-gray-600 block mb-1">Pack Size *</label>
                        <input
                          type="text"
                          value={newProdPackSize}
                          onChange={(e) => setNewProdPackSize(e.target.value)}
                          placeholder="e.g. Pack of 4"
                          className="w-full p-2.5 rounded-xl border bg-cream-50"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="font-semibold text-gray-600 block mb-1">Tagline</label>
                      <input
                        type="text"
                        value={newProdTagline}
                        onChange={(e) => setNewProdTagline(e.target.value)}
                        placeholder="e.g. Roasted Mediterranean pistachios and white cocoa glaze."
                        className="w-full p-2.5 rounded-xl border bg-cream-50"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-gray-600 block mb-1">Description *</label>
                      <textarea
                        value={newProdDesc}
                        onChange={(e) => setNewProdDesc(e.target.value)}
                        rows={3}
                        placeholder="Detailed food description, flavour profile, temperature notes..."
                        className="w-full p-2.5 rounded-xl border bg-cream-50"
                        required
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-gray-600 block mb-1">Image URL</label>
                      <input
                        type="url"
                        value={newProdImg}
                        onChange={(e) => setNewProdImg(e.target.value)}
                        className="w-full p-2.5 rounded-xl border bg-cream-50"
                      />
                    </div>

                    <div className="flex gap-6 pt-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={newProdFeatured}
                          onChange={(e) => setNewProdFeatured(e.target.checked)}
                          className="accent-brand-orange"
                        />
                        <span className="font-bold">Feature on Homepage</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={newProdBestSeller}
                          onChange={(e) => setNewProdBestSeller(e.target.checked)}
                          className="accent-brand-orange"
                        />
                        <span className="font-bold">Mark as Best Seller</span>
                      </label>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t">
                      <button
                        type="button"
                        onClick={() => setShowAddProduct(false)}
                        className="px-5 py-2.5 text-xs font-bold text-gray-500"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-brand-orange text-white text-xs font-bold rounded-xl shadow-md"
                      >
                        Save Product
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            TAB 4: INVENTORY & STOCK MANAGEMENT
            ======================================================== */}
        {activeTab === 'inventory' && (
          <div className="space-y-8">
            {/* Quick Adjustment Tool */}
            <div className="bg-white p-6 rounded-3xl border border-amber-100 shadow-soft">
              <h3 className="font-bold text-base text-brand-chocolate mb-4 flex items-center gap-2">
                <Boxes className="w-5 h-5 text-brand-orange" />
                Quick Stock Adjustment & Restock Tool
              </h3>

              <form onSubmit={handleStockAdjust} className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end text-xs">
                <div>
                  <label className="font-semibold text-gray-600 block mb-1">Select Product</label>
                  <select
                    value={adjustProductId}
                    onChange={(e) => setAdjustProductId(e.target.value)}
                    className="w-full p-2.5 rounded-xl border bg-cream-50 font-bold"
                  >
                    {inventoryList.map((inv) => (
                      <option key={inv.product_id} value={inv.product_id}>
                        {inv.product_name} (Current: {inv.stock_quantity})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-gray-600 block mb-1">Change Quantity (+/-)</label>
                  <input
                    type="number"
                    value={adjustQty}
                    onChange={(e) => setAdjustQty(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border bg-cream-50 font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="font-semibold text-gray-600 block mb-1">Reason / Note</label>
                  <input
                    type="text"
                    value={adjustReason}
                    onChange={(e) => setAdjustReason(e.target.value)}
                    className="w-full p-2.5 rounded-xl border bg-cream-50"
                  />
                </div>

                <div>
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-brand-chocolate hover:bg-brand-orange text-white font-bold rounded-xl transition-colors shadow-sm"
                  >
                    Apply Stock Adjustment
                  </button>
                </div>
              </form>
            </div>

            {/* Inventory Status Table */}
            <div className="bg-white p-6 rounded-3xl border border-amber-100 shadow-soft space-y-4">
              <h3 className="font-bold text-base text-brand-chocolate pb-3 border-b">
                Live Inventory Status
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-cream-50 text-gray-400 uppercase font-bold text-[10px]">
                    <tr>
                      <th className="p-3">Product Name</th>
                      <th className="p-3">SKU</th>
                      <th className="p-3">Available Stock</th>
                      <th className="p-3">Safety Stock</th>
                      <th className="p-3">Inventory Status</th>
                      <th className="p-3">Last Restocked</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-medium">
                    {inventoryList.map((inv) => (
                      <tr key={inv.id} className="hover:bg-amber-50/40">
                        <td className="p-3 font-bold text-brand-chocolate">{inv.product_name}</td>
                        <td className="p-3 font-mono text-gray-500">{inv.sku}</td>
                        <td className="p-3 font-black text-sm">{inv.stock_quantity} units</td>
                        <td className="p-3 text-gray-500">{inv.safety_stock} units</td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              inv.status === 'IN_STOCK'
                                ? 'bg-emerald-100 text-emerald-800'
                                : inv.status === 'LOW_STOCK'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {inv.status}
                          </span>
                        </td>
                        <td className="p-3 text-gray-400">{new Date(inv.last_restocked_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Audit Log */}
            <div className="bg-white p-6 rounded-3xl border border-amber-100 shadow-soft space-y-4">
              <h3 className="font-bold text-base text-brand-chocolate pb-3 border-b">
                Inventory Audit Logs
              </h3>

              <div className="overflow-x-auto max-h-60">
                <table className="w-full text-xs text-left">
                  <thead className="bg-cream-50 text-gray-400 uppercase font-bold text-[10px]">
                    <tr>
                      <th className="p-2.5">Date</th>
                      <th className="p-2.5">Product</th>
                      <th className="p-2.5">Change Type</th>
                      <th className="p-2.5">Qty Changed</th>
                      <th className="p-2.5">Previous → New</th>
                      <th className="p-2.5">Reason</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-[11px]">
                    {inventoryLogs.map((log) => (
                      <tr key={log.id}>
                        <td className="p-2.5 text-gray-400">{new Date(log.created_at).toLocaleString()}</td>
                        <td className="p-2.5 font-bold text-brand-chocolate">{log.product_name}</td>
                        <td className="p-2.5 font-bold uppercase">{log.change_type}</td>
                        <td className="p-2.5 font-black text-brand-orange">{log.quantity_changed > 0 ? `+${log.quantity_changed}` : log.quantity_changed}</td>
                        <td className="p-2.5 text-gray-500">{log.previous_stock} → {log.new_stock}</td>
                        <td className="p-2.5 text-gray-500">{log.reason || 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 5: OFFERS & COUPONS
            ======================================================== */}
        {activeTab === 'coupons' && (
          <div className="space-y-8">
            {/* Create Coupon Box */}
            <div className="bg-white p-6 rounded-3xl border border-amber-100 shadow-soft space-y-4">
              <h3 className="font-bold text-base text-brand-chocolate flex items-center gap-2">
                <Tag className="w-5 h-5 text-brand-orange" />
                Create New Discount Coupon
              </h3>

              <form onSubmit={handleCreateCoupon} className="grid grid-cols-1 sm:grid-cols-5 gap-3 items-end text-xs">
                <div>
                  <label className="font-semibold text-gray-600 block mb-1">Coupon Code *</label>
                  <input
                    type="text"
                    value={newCouponCode}
                    onChange={(e) => setNewCouponCode(e.target.value.toUpperCase())}
                    placeholder="e.g. CRUNCH20"
                    className="w-full p-2.5 rounded-xl border bg-cream-50 font-bold uppercase"
                    required
                  />
                </div>

                <div>
                  <label className="font-semibold text-gray-600 block mb-1">Discount % *</label>
                  <input
                    type="number"
                    value={newCouponVal}
                    onChange={(e) => setNewCouponVal(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border bg-cream-50 font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="font-semibold text-gray-600 block mb-1">Min Order Value (₹)</label>
                  <input
                    type="number"
                    value={newCouponMin}
                    onChange={(e) => setNewCouponMin(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border bg-cream-50"
                  />
                </div>

                <div>
                  <label className="font-semibold text-gray-600 block mb-1">Description</label>
                  <input
                    type="text"
                    value={newCouponDesc}
                    onChange={(e) => setNewCouponDesc(e.target.value)}
                    placeholder="e.g. 20% off for festival"
                    className="w-full p-2.5 rounded-xl border bg-cream-50"
                  />
                </div>

                <div>
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-brand-orange hover:bg-brand-orange-hover text-white font-bold rounded-xl transition-colors shadow-sm"
                  >
                    Add Coupon
                  </button>
                </div>
              </form>
            </div>

            {/* Coupons List */}
            <div className="bg-white p-6 rounded-3xl border border-amber-100 shadow-soft space-y-4">
              <h3 className="font-bold text-base text-brand-chocolate pb-3 border-b">
                Active Promo Codes
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {coupons.map((c) => (
                  <div key={c.id} className="p-4 rounded-2xl border border-amber-200 bg-cream-50/80 space-y-2 text-xs relative">
                    <button
                      onClick={() => handleDeleteCoupon(c.id)}
                      className="absolute top-3 right-3 text-gray-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-black text-base text-brand-orange font-mono tracking-wider block">
                      {c.code}
                    </span>
                    <p className="text-gray-600 font-medium">{c.description || `${c.discount_value}% Discount`}</p>
                    <div className="text-[11px] text-gray-500 pt-1 border-t space-y-0.5">
                      <div>Min Order: ₹{c.min_order_value}</div>
                      <div>Times Used: <strong className="text-brand-chocolate">{c.used_count}</strong></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 6: MESSAGES & INQUIRIES
            ======================================================== */}
        {activeTab === 'messages' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-amber-100 shadow-soft space-y-6">
            <div className="flex justify-between items-center pb-4 border-b">
              <div>
                <h2 className="text-xl font-black text-brand-chocolate">Customer Inquiries</h2>
                <p className="text-xs text-gray-500">Messages sent via the Contact Us form.</p>
              </div>
              <span className="text-xs font-bold text-brand-orange bg-amber-50 px-3 py-1 rounded-full">
                {messages.length} Messages Received
              </span>
            </div>

            {messages.length === 0 ? (
              <p className="text-xs text-gray-400 italic py-8 text-center">No messages received yet.</p>
            ) : (
              <div className="space-y-4">
                {messages.map((m) => (
                  <div key={m.id} className="p-5 rounded-2xl bg-cream-50 border border-amber-100 space-y-2 text-xs">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-bold text-sm text-brand-chocolate">{m.name}</span>
                        <p className="text-gray-500">{m.email} • {m.phone || 'No phone'}</p>
                      </div>
                      <span className="text-[10px] text-gray-400">{new Date(m.created_at).toLocaleString()}</span>
                    </div>
                    {m.subject && <p className="font-bold text-brand-orange">Subject: {m.subject}</p>}
                    <p className="text-gray-700 bg-white p-3 rounded-xl border border-amber-100/60 leading-relaxed">
                      &quot;{m.message}&quot;
                    </p>
                    <div className="flex gap-3 pt-1">
                      <a
                        href={`mailto:${m.email}?subject=Reply from CUP2EAT: ${encodeURIComponent(m.subject || 'Your Inquiry')}`}
                        className="text-xs font-bold text-brand-orange hover:underline"
                      >
                        Reply via Email →
                      </a>
                      {m.phone && (
                        <a
                          href={`https://wa.me/91${m.phone.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-bold text-emerald-700 hover:underline"
                        >
                          Chat on WhatsApp →
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            TAB 7: STORE SETTINGS
            ======================================================== */}
        {activeTab === 'settings' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-amber-100 shadow-soft max-w-2xl space-y-6">
            <div className="pb-4 border-b">
              <h2 className="text-xl font-black text-brand-chocolate">Store Settings</h2>
              <p className="text-xs text-gray-500">Configure global business information, announcement bar, and rates.</p>
            </div>

            {settingsSaved && (
              <div className="p-3 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                Settings saved successfully!
              </div>
            )}

            <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-gray-600 block mb-1">Homepage Announcement Top Bar</label>
                <input
                  type="text"
                  value={settings.announcement_bar || ''}
                  onChange={(e) => setSettings({ ...settings, announcement_bar: e.target.value })}
                  className="w-full p-3 rounded-xl border bg-cream-50 font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-gray-600 block mb-1">WhatsApp Customer Number</label>
                  <input
                    type="text"
                    value={settings.whatsapp_support || ''}
                    onChange={(e) => setSettings({ ...settings, whatsapp_support: e.target.value })}
                    className="w-full p-3 rounded-xl border bg-cream-50 font-medium"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-600 block mb-1">Official Contact Email</label>
                  <input
                    type="email"
                    value={settings.contact_email || ''}
                    onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
                    className="w-full p-3 rounded-xl border bg-cream-50 font-medium"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-600 block mb-1">Flat Delivery Fee (₹)</label>
                  <input
                    type="number"
                    value={settings.shipping_flat_rate || '50'}
                    onChange={(e) => setSettings({ ...settings, shipping_flat_rate: e.target.value })}
                    className="w-full p-3 rounded-xl border bg-cream-50 font-medium"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-600 block mb-1">Free Shipping Threshold (₹)</label>
                  <input
                    type="number"
                    value={settings.free_shipping_threshold || '499'}
                    onChange={(e) => setSettings({ ...settings, free_shipping_threshold: e.target.value })}
                    className="w-full p-3 rounded-xl border bg-cream-50 font-medium"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="px-6 py-3 bg-brand-orange hover:bg-brand-orange-hover text-white font-bold text-xs rounded-xl shadow-md transition-all"
              >
                Save Settings
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
