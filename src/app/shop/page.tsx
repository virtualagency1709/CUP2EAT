'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, Filter, SlidersHorizontal, Sparkles, X, ArrowUpDown } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { Product, FlavourItem } from '@/lib/types';

function ShopContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  const initialFlavour = searchParams.get('flavour') || 'all';

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string; slug: string }[]>([]);
  const [flavours, setFlavours] = useState<FlavourItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedFlavour, setSelectedFlavour] = useState(initialFlavour);
  const [priceRange, setPriceRange] = useState<number>(2500);
  const [sortBy, setSortBy] = useState('popularity'); // popularity, price_asc, price_desc, rating, newest
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [prodRes, catRes, flavRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/categories'),
          fetch('/api/flavours'),
        ]);

        if (prodRes.ok) {
          const data = await prodRes.json();
          setProducts(data.products || []);
        }
        if (catRes.ok) {
          const data = await catRes.json();
          setCategories(data.categories || []);
        }
        if (flavRes.ok) {
          const data = await flavRes.json();
          setFlavours(data.flavours || []);
        }
      } catch (err) {
        console.error('Error loading shop data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Search
        if (search.trim()) {
          const term = search.toLowerCase();
          const matchName = p.name.toLowerCase().includes(term);
          const matchDesc = p.description.toLowerCase().includes(term);
          const matchTag = p.tagline?.toLowerCase().includes(term);
          if (!matchName && !matchDesc && !matchTag) return false;
        }

        // Category
        if (selectedCategory !== 'all') {
          if (p.category?.slug !== selectedCategory && p.categoryId !== selectedCategory) {
            return false;
          }
        }

        // Flavour
        if (selectedFlavour !== 'all') {
          const term = selectedFlavour.toLowerCase();
          const hasFlavour =
            p.variants?.some((v) => v.flavour?.name.toLowerCase().includes(term)) ||
            p.name.toLowerCase().includes(term);
          if (!hasFlavour) return false;
        }

        // Price
        const effectivePrice = p.salePrice || p.basePrice;
        if (effectivePrice > priceRange) return false;

        return true;
      })
      .sort((a, b) => {
        const priceA = a.salePrice || a.basePrice;
        const priceB = b.salePrice || b.basePrice;

        if (sortBy === 'price_asc') return priceA - priceB;
        if (sortBy === 'price_desc') return priceB - priceA;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'newest') return b.id.localeCompare(a.id);
        // popularity
        return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0) || b.rating - a.rating;
      });
  }, [products, search, selectedCategory, selectedFlavour, priceRange, sortBy]);

  const resetFilters = () => {
    setSearch('');
    setSelectedCategory('all');
    setSelectedFlavour('all');
    setPriceRange(2500);
    setSortBy('popularity');
  };

  const hasActiveFilters =
    search !== '' ||
    selectedCategory !== 'all' ||
    selectedFlavour !== 'all' ||
    priceRange < 2500 ||
    sortBy !== 'popularity';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Page Title & Breadcrumbs */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
          <span>Home</span>
          <span>/</span>
          <span className="text-brand-orange font-semibold">Shop All Products</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-brand-chocolate">
          All Products & Edible Cups
        </h1>
        <p className="text-sm text-gray-600 mt-1 max-w-xl">
          Explore our handcrafted assortment of double-chocolate lined edible cups, wafer cups, gift hampers, and DIY dessert kits.
        </p>
      </div>

      {/* Main Layout: Sidebar Filters + Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* ========================================================
            DESKTOP SIDEBAR FILTERS
            ======================================================== */}
        <aside className="hidden lg:block bg-white p-6 rounded-3xl border border-amber-100/90 shadow-soft space-y-6 sticky top-28">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <h2 className="font-bold text-base text-brand-chocolate flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-brand-orange" />
              Filter Products
            </h2>
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="text-xs text-brand-orange font-bold hover:underline"
              >
                Reset
              </button>
            )}
          </div>

          {/* Search in Shop */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-2">
              Search
            </label>
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search flavour, pack..."
                className="w-full text-xs bg-cream-50 border border-amber-200/80 rounded-xl px-3.5 py-2.5 outline-none focus:border-brand-orange"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-2">
              Category
            </label>
            <div className="space-y-1">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center justify-between ${
                  selectedCategory === 'all'
                    ? 'bg-brand-orange text-white'
                    : 'text-brand-chocolate hover:bg-amber-50'
                }`}
              >
                <span>All Categories</span>
                <span className="text-[11px] opacity-80">{products.length}</span>
              </button>
              {categories.map((cat) => {
                const count = products.filter((p) => p.categoryId === cat.id || p.category?.slug === cat.slug).length;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.slug)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center justify-between ${
                      selectedCategory === cat.slug
                        ? 'bg-brand-orange text-white'
                        : 'text-brand-chocolate hover:bg-amber-50'
                    }`}
                  >
                    <span className="truncate">{cat.name}</span>
                    <span className="text-[11px] opacity-80">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Flavour Filter */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-2">
              Flavour
            </label>
            <div className="space-y-1">
              <button
                onClick={() => setSelectedFlavour('all')}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                  selectedFlavour === 'all'
                    ? 'bg-brand-chocolate text-amber-200'
                    : 'text-brand-chocolate hover:bg-amber-50'
                }`}
              >
                All Flavours
              </button>
              {flavours.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setSelectedFlavour(f.name)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 ${
                    selectedFlavour === f.name
                      ? 'bg-brand-chocolate text-amber-200'
                      : 'text-brand-chocolate hover:bg-amber-50'
                  }`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: f.color }}
                  />
                  <span className="truncate">{f.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Max Price Slider */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold mb-2">
              <span className="uppercase tracking-wider text-gray-400">Max Price</span>
              <span className="text-brand-orange font-black">₹{priceRange}</span>
            </div>
            <input
              type="range"
              min="200"
              max="2500"
              step="50"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-full accent-brand-orange"
            />
            <div className="flex justify-between text-[11px] text-gray-400 mt-1">
              <span>₹200</span>
              <span>₹2,500</span>
            </div>
          </div>
        </aside>

        {/* ========================================================
            MAIN PRODUCTS LISTING AREA
            ======================================================== */}
        <div className="lg:col-span-3 space-y-6">
          {/* Top Filter & Sort Bar */}
          <div className="bg-white p-4 rounded-2xl border border-amber-100 flex flex-wrap items-center justify-between gap-4 shadow-xs">
            <div className="text-xs sm:text-sm text-gray-600 font-medium">
              Showing <strong className="text-brand-chocolate">{filteredProducts.length}</strong> of{' '}
              {products.length} products
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                className="lg:hidden px-3 py-2 rounded-xl border border-amber-200 text-xs font-bold text-brand-chocolate flex items-center gap-1.5"
              >
                <Filter className="w-3.5 h-3.5" />
                Filters
              </button>

              {/* Sort Selector */}
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-gray-400 hidden sm:inline">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-cream-50 border border-amber-200 text-brand-chocolate font-semibold rounded-xl px-3 py-2 text-xs outline-none focus:border-brand-orange"
                >
                  <option value="popularity">Most Popular</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="newest">Newest Arrivals</option>
                </select>
              </div>
            </div>
          </div>

          {/* Mobile Filter Drawer (Expandable) */}
          {mobileFilterOpen && (
            <div className="lg:hidden p-5 bg-white rounded-2xl border border-amber-200 shadow-md space-y-4">
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="font-bold text-sm">Filters</span>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="text-xs text-brand-orange font-bold"
                >
                  Close
                </button>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 block mb-1">Category</label>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      selectedCategory === 'all' ? 'bg-brand-orange text-white' : 'bg-gray-100'
                    }`}
                  >
                    All
                  </button>
                  {categories.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedCategory(c.slug)}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        selectedCategory === c.slug ? 'bg-brand-orange text-white' : 'bg-gray-100'
                      }`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Grid of Product Cards */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 py-12">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-96 rounded-3xl bg-amber-50/60 animate-pulse border border-amber-100"
                />
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-amber-100 max-w-md mx-auto my-8">
              <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center mx-auto mb-3">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-lg text-brand-chocolate">No products match your filters</h3>
              <p className="text-xs text-gray-500 mt-1 mb-6">
                Try clearing some filters or searching for something else.
              </p>
              <button
                onClick={resetFilters}
                className="px-6 py-2.5 bg-brand-orange text-white text-xs font-bold rounded-full shadow-md"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center"><div className="w-8 h-8 border-3 border-brand-orange border-t-transparent rounded-full animate-spin mx-auto mb-2" /><p className="text-xs text-gray-400">Loading products...</p></div>}>
      <ShopContent />
    </Suspense>
  );
}
