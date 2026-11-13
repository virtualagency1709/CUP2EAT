'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Star, ShoppingBag, Check } from 'lucide-react';
import { Product } from '@/lib/types';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [added, setAdded] = useState(false);

  const primaryImage = product.images?.[0]?.url || 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&q=80';
  const effectivePrice = product.salePrice || product.basePrice;
  const isWishlisted = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addItem({
      id: `${product.id}-default`,
      productId: product.id,
      name: product.name,
      slug: product.slug,
      image: primaryImage,
      flavour: product.variants?.[0]?.flavour?.name || 'Classic',
      packSize: product.packSize || 'Pack of 4',
      unitPrice: effectivePrice,
      maxStock: product.stock,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  return (
    <div className="group relative bg-white rounded-3xl p-3 sm:p-4 border border-amber-100/80 shadow-soft hover:shadow-hover hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between">
      {/* Top Image Container */}
      <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-amber-50/50 mb-3.5">
        <Link href={`/product/${product.slug}`} className="block w-full h-full">
          <Image
            src={primaryImage}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-108 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          {product.isBestSeller && (
            <span className="bg-brand-chocolate text-amber-200 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
              Best Seller
            </span>
          )}
          {product.discountPercent > 0 && (
            <span className="bg-brand-orange text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm">
              {product.discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-sm ${
            isWishlisted
              ? 'bg-rose-50 text-rose-600 scale-110'
              : 'bg-white/90 text-gray-400 hover:text-rose-500 hover:bg-white'
          }`}
          title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-600' : ''}`} />
        </button>

        {/* Stock Alert */}
        {product.stock <= 10 && product.stock > 0 && (
          <div className="absolute bottom-2 left-2 right-2 bg-amber-900/80 backdrop-blur-xs text-white text-[10px] py-0.5 text-center font-medium rounded-lg">
            Only {product.stock} left in stock!
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-amber-800/80 font-medium bg-amber-50 px-2 py-0.5 rounded-full text-[11px]">
              {product.category?.name || product.packSize}
            </span>
            <div className="flex items-center gap-1 text-amber-600 font-semibold text-[11px]">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{product.rating}</span>
              <span className="text-gray-400 font-normal">({product.reviewCount})</span>
            </div>
          </div>

          {/* Title */}
          <Link href={`/product/${product.slug}`} className="block">
            <h3 className="font-bold text-brand-chocolate text-base group-hover:text-brand-orange transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>

          {/* Subtitle / Tagline */}
          <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">
            {product.tagline || product.shortDescription}
          </p>
        </div>

        {/* Pricing & Add to Cart */}
        <div className="pt-3 mt-2 border-t border-amber-100/60 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-black text-brand-chocolate">
                ₹{effectivePrice}
              </span>
              {product.salePrice && (
                <span className="text-xs text-gray-400 line-through">
                  ₹{product.basePrice}
                </span>
              )}
            </div>
            <span className="text-[10px] text-gray-400 block -mt-0.5">
              {product.packSize}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className={`px-3.5 py-2 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm ${
              added
                ? 'bg-emerald-600 text-white'
                : product.stock <= 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-brand-chocolate hover:bg-brand-orange text-white hover:shadow-md'
            }`}
          >
            {added ? (
              <>
                <Check className="w-3.5 h-3.5" /> Added
              </>
            ) : product.stock <= 0 ? (
              'Sold Out'
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" /> Add
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

