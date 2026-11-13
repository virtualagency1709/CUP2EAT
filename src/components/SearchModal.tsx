'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, X, ArrowRight, Sparkles } from 'lucide-react';
import { Product } from '@/lib/types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setResults([]);
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/products?search=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.products || []);
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-amber-100 overflow-hidden">
        {/* Search Input Bar */}
        <div className="flex items-center px-6 py-4 border-b border-gray-100">
          <Search className="w-5 h-5 text-amber-600 mr-3 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search chocolate cups, vanilla wafers, party boxes..."
            className="w-full text-base sm:text-lg text-brand-chocolate placeholder-gray-400 bg-transparent outline-none font-medium"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 mr-2 text-gray-400 hover:text-gray-600 rounded-full"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-brand-chocolate rounded-xl hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Area */}
        <div className="max-h-[60vh] overflow-y-auto p-4 sm:p-6">
          {loading ? (
            <div className="py-12 text-center text-gray-400">
              <div className="w-8 h-8 border-3 border-brand-orange border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-sm">Searching delicious cups...</p>
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 px-2">
                Products Found ({results.length})
              </p>
              {results.map((product) => {
                const primaryImg = product.images?.[0]?.url || 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&q=80';
                return (
                  <Link
                    key={product.id}
                    href={`/product/${product.slug}`}
                    onClick={onClose}
                    className="flex items-center gap-4 p-3 rounded-2xl hover:bg-amber-50/70 border border-transparent hover:border-amber-200 transition-all group"
                  >
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-amber-100 shrink-0 relative">
                      <Image
                        src={primaryImg}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-brand-chocolate text-sm sm:text-base truncate group-hover:text-brand-orange transition-colors">
                        {product.name}
                      </h4>
                      <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">
                        {product.tagline || product.packSize}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-bold text-brand-chocolate text-sm">
                          ₹{product.salePrice || product.basePrice}
                        </span>
                        {product.salePrice && (
                          <span className="text-xs text-gray-400 line-through">
                            ₹{product.basePrice}
                          </span>
                        )}
                        <span className="text-[11px] font-medium text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                          {product.packSize}
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-brand-orange group-hover:translate-x-1 transition-all shrink-0 mr-2" />
                  </Link>
                );
              })}
            </div>
          ) : query ? (
            <div className="py-12 text-center">
              <p className="text-gray-500 text-sm">No delicious cups found matching &quot;{query}&quot;</p>
              <Link
                href="/shop"
                onClick={onClose}
                className="inline-flex items-center gap-2 mt-3 text-sm font-semibold text-brand-orange hover:underline"
              >
                Explore all products <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3 px-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Popular Searches
              </div>
              <div className="flex flex-wrap gap-2 px-2">
                {['Chocolate Cups', 'Lotus Biscoff', 'Vanilla Wafer', 'Party Starter Box', 'DIY Kit', 'Strawberry Swirl'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-amber-50 text-brand-chocolate hover:bg-brand-orange hover:text-white transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

