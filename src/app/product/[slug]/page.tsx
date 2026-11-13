'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  Star,
  ShoppingBag,
  Zap,
  Heart,
  ShieldCheck,
  Truck,
  RotateCcw,
  CheckCircle2,
  Clock,
  Flame,
  Plus,
  Minus,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { Product } from '@/lib/types';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import ProductCard from '@/components/ProductCard';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Local Selection State
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedPackSize, setSelectedPackSize] = useState('');
  const [selectedFlavour, setSelectedFlavour] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  // Review submission state
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        const res = await fetch(`/api/products/${slug}`);
        if (!res.ok) {
          throw new Error('Product not found');
        }
        const data = await res.json();
        setProduct(data.product);
        setRelated(data.related || []);
        setSelectedPackSize(data.product.packSize || 'Pack of 4');
        setSelectedFlavour(data.product.variants?.[0]?.flavour?.name || 'Classic');
      } catch (err: any) {
        setError(err.message || 'Error loading product');
      } finally {
        setLoading(false);
      }
    }
    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-12 h-12 border-4 border-brand-orange border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-500 font-medium">Baking delicious details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-black text-brand-chocolate mb-2">Product Not Found</h2>
        <p className="text-sm text-gray-500 mb-6">The product you are looking for does not exist or has been removed.</p>
        <Link
          href="/shop"
          className="px-6 py-3 bg-brand-orange text-white font-bold text-sm rounded-xl"
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  const effectivePrice = product.salePrice || product.basePrice;
  const images = product.images?.length > 0 ? product.images : [{ id: '1', url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=900&q=80', alt: product.name, isPrimary: true }];
  const currentImage = images[selectedImageIndex]?.url || images[0].url;
  const isWishlisted = isInWishlist(product.id);

  const handleAddToCart = () => {
    addItem(
      {
        id: `${product.id}-${selectedFlavour}-${selectedPackSize}`,
        productId: product.id,
        name: product.name,
        slug: product.slug,
        image: currentImage,
        flavour: selectedFlavour,
        packSize: selectedPackSize,
        unitPrice: effectivePrice,
        maxStock: product.stock,
      },
      quantity
    );

    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleBuyNow = () => {
    addItem(
      {
        id: `${product.id}-${selectedFlavour}-${selectedPackSize}`,
        productId: product.id,
        name: product.name,
        slug: product.slug,
        image: currentImage,
        flavour: selectedFlavour,
        packSize: selectedPackSize,
        unitPrice: effectivePrice,
        maxStock: product.stock,
      },
      quantity
    );
    router.push('/checkout');
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment || !reviewRating) return;

    setSubmittingReview(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          userName: reviewName || 'CUP2EAT Lover',
          rating: reviewRating,
          title: reviewTitle,
          comment: reviewComment,
        }),
      });
      if (res.ok) {
        setReviewSuccess(true);
        setReviewComment('');
        setReviewTitle('');
        setReviewName('');
      }
    } catch {
      // ignore
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-16">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <Link href="/" className="hover:text-brand-orange">
          Home
        </Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-brand-orange">
          Shop
        </Link>
        <span>/</span>
        <span className="text-brand-chocolate font-bold truncate">{product.name}</span>
      </div>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        {/* ========================================================
            LEFT: IMAGE GALLERY (5 COLS)
            ======================================================== */}
        <div className="lg:col-span-6 space-y-4">
          {/* Main Selected Image */}
          <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-amber-50 border border-amber-100 shadow-card">
            <Image
              src={currentImage}
              alt={product.name}
              fill
              priority
              className="object-cover"
            />
            {product.isBestSeller && (
              <span className="absolute top-4 left-4 bg-brand-chocolate text-amber-200 text-xs font-black px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
                Best Seller
              </span>
            )}
            {product.discountPercent > 0 && (
              <span className="absolute top-4 right-4 bg-brand-orange text-white text-xs font-black px-3 py-1.5 rounded-full shadow-sm">
                {product.discountPercent}% OFF
              </span>
            )}
          </div>

          {/* Thumbnail Strip */}
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={img.id || idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden relative shrink-0 border-2 transition-all ${
                    selectedImageIndex === idx
                      ? 'border-brand-orange scale-105 shadow-sm'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <Image src={img.url} alt={img.alt || product.name} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Reassurance Badges */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-amber-100">
            <div className="p-3 bg-amber-50/60 rounded-2xl text-center">
              <Clock className="w-5 h-5 text-brand-orange mx-auto mb-1" />
              <p className="text-[11px] font-bold text-brand-chocolate">45+ Mins Crisp</p>
              <p className="text-[10px] text-gray-500">Zero sogginess</p>
            </div>
            <div className="p-3 bg-amber-50/60 rounded-2xl text-center">
              <Flame className="w-5 h-5 text-amber-600 mx-auto mb-1" />
              <p className="text-[11px] font-bold text-brand-chocolate">Holds 85°C Hot</p>
              <p className="text-[10px] text-gray-500">Or cold drinks</p>
            </div>
            <div className="p-3 bg-amber-50/60 rounded-2xl text-center">
              <ShieldCheck className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
              <p className="text-[11px] font-bold text-brand-chocolate">100% Edible</p>
              <p className="text-[10px] text-gray-500">Zero plastic/wax</p>
            </div>
          </div>
        </div>

        {/* ========================================================
            RIGHT: PRODUCT DETAILS & BUY BOX (7 COLS)
            ======================================================== */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-orange bg-brand-orange/10 px-3 py-1 rounded-full">
              {product.category?.name || 'Edible Cups'}
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-brand-chocolate mt-2">
              {product.name}
            </h1>
            {product.tagline && (
              <p className="text-sm sm:text-base text-gray-500 mt-1 font-medium italic">
                &quot;{product.tagline}&quot;
              </p>
            )}

            {/* Rating Stars */}
            <div className="flex items-center gap-3 mt-3">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-sm font-bold text-brand-chocolate">{product.rating}</span>
              <span className="text-xs text-gray-400">({product.reviewCount} customer reviews)</span>
            </div>
          </div>

          {/* Pricing */}
          <div className="p-4 rounded-2xl bg-cream-50 border border-amber-200/80 flex items-baseline gap-3">
            <span className="text-3xl font-black text-brand-chocolate">
              ₹{effectivePrice}
            </span>
            {product.salePrice && (
              <span className="text-base text-gray-400 line-through">
                ₹{product.basePrice}
              </span>
            )}
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
              Inclusive of all taxes
            </span>
          </div>

          {/* Short Description */}
          <p className="text-sm text-gray-600 leading-relaxed">
            {product.description}
          </p>

          {/* Pack Size Selector */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-2">
              Select Pack Size
            </label>
            <div className="flex flex-wrap gap-2.5">
              {[product.packSize || 'Pack of 4', 'Pack of 8', 'Party Box of 12'].map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedPackSize(size)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                    selectedPackSize === size
                      ? 'border-brand-chocolate bg-brand-chocolate text-white shadow-sm'
                      : 'border-amber-200 bg-white text-brand-chocolate hover:bg-amber-50'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Flavour Selector */}
          {product.variants && product.variants.length > 0 && (
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-2">
                Flavour Lining: <strong className="text-brand-chocolate">{selectedFlavour}</strong>
              </label>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedFlavour(v.flavour?.name || 'Classic')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-all ${
                      selectedFlavour === v.flavour?.name
                        ? 'border-brand-orange bg-brand-orange-light text-brand-chocolate font-bold shadow-xs'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-amber-300'
                    }`}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: v.flavour?.color || '#FF5E1E' }}
                    />
                    <span>{v.flavour?.name || 'Classic'}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity & Buy Box */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Quantity:</span>
              <div className="flex items-center border border-amber-200 rounded-xl bg-white overflow-hidden shadow-xs">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2.5 hover:bg-amber-50 text-gray-600 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 text-sm font-bold text-brand-chocolate">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="p-2.5 hover:bg-amber-50 text-gray-600 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <span className="text-xs font-medium text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> In Stock ({product.stock} units ready)
              </span>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className={`py-3.5 px-6 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md ${
                  added
                    ? 'bg-emerald-600 text-white'
                    : 'bg-brand-chocolate hover:bg-brand-chocolate-dark text-white'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                {added ? 'Added to Cart!' : 'Add to Cart'}
              </button>

              <button
                onClick={handleBuyNow}
                disabled={product.stock <= 0}
                className="py-3.5 px-6 rounded-2xl font-bold text-sm bg-brand-orange hover:bg-brand-orange-hover text-white flex items-center justify-center gap-2 shadow-hover transition-all"
              >
                <Zap className="w-4 h-4 fill-white" />
                Buy Now
              </button>
            </div>

            {/* Wishlist Toggle */}
            <button
              onClick={() => toggleWishlist(product.id)}
              className="w-full py-2.5 rounded-xl border border-amber-200 text-xs font-bold text-brand-chocolate hover:bg-amber-50 flex items-center justify-center gap-2 transition-colors"
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : 'text-gray-400'}`} />
              {isWishlisted ? 'Saved in Wishlist' : 'Add to Wishlist'}
            </button>
          </div>

          {/* Shipping Perks */}
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-100 text-xs text-brand-chocolate space-y-2">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-brand-orange" />
              <span><strong>Free Express Delivery</strong> across India on orders over ₹499.</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-brand-orange" />
              <span><strong>Damage-Free Guarantee:</strong> Heavy-duty shockproof protective packaging.</span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          PRODUCT SPECIFICATIONS & NUTRITIONAL FACTS
          ======================================================== */}
      <section className="bg-white rounded-3xl p-6 sm:p-10 border border-amber-100 shadow-soft">
        <h2 className="text-xl sm:text-2xl font-black text-brand-chocolate mb-6">
          Product Details & Ingredients
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-brand-chocolate text-base mb-1">Ingredients</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                {product.ingredients || 'Wheat Flour, Belgian Cocoa Solids, Pure Butter, Demerara Cane Sugar, Natural Vanilla Extract, Soy Lecithin.'}
              </p>
            </div>
            <div>
              <h3 className="font-bold text-brand-chocolate text-base mb-1">Temperature Resistance</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                {product.temperature || 'Withstands liquids up to 85°C (185°F). Perfect for espresso, cappuccino, hot chocolate, green tea, iced latte, and cold milkshakes.'}
              </p>
            </div>
            <div>
              <h3 className="font-bold text-brand-chocolate text-base mb-1">Shelf Life</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                {product.shelfLife || '9 Months from manufacturing date. Store in a cool, dry place.'}
              </p>
            </div>
          </div>

          <div className="bg-cream-50 p-6 rounded-2xl border border-amber-100">
            <h3 className="font-bold text-brand-chocolate text-base mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-orange" />
              Nutritional Highlights
            </h3>
            <p className="text-xs text-gray-600 mb-4">
              {product.nutritionalInfo || 'Average 135 kcal per cup | Protein: 2.4g | Carbohydrates: 18g | Dietary Fats: 6g | Trans Fat: 0g'}
            </p>
            <div className="space-y-2 text-xs text-gray-700">
              <div className="flex justify-between py-1 border-b border-amber-200/50">
                <span>Vegetarian</span>
                <strong className="text-emerald-700 font-bold">100% Veg (Green Dot)</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-amber-200/50">
                <span>Preservatives</span>
                <strong>Zero Chemical Additives</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-amber-200/50">
                <span>Plastic / Wax Lining</span>
                <strong className="text-emerald-700">None (Pure Cocoa Butter)</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          CUSTOMER REVIEWS SECTION
          ======================================================== */}
      <section className="bg-white rounded-3xl p-6 sm:p-10 border border-amber-100 shadow-soft space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-brand-chocolate">
              Customer Reviews ({product.reviews?.length || 0})
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-sm font-bold text-brand-chocolate">{product.rating} out of 5</span>
            </div>
          </div>
        </div>

        {/* Write a Review Box */}
        <div className="bg-amber-50/70 p-6 rounded-2xl border border-amber-100">
          <h3 className="font-bold text-base text-brand-chocolate mb-3 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-brand-orange" />
            Write a Review
          </h3>

          {reviewSuccess ? (
            <div className="p-4 bg-emerald-100 text-emerald-800 rounded-xl text-sm font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              Thank you! Your verified review has been submitted and published.
            </div>
          ) : (
            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Your Name</label>
                  <input
                    type="text"
                    value={reviewName}
                    onChange={(e) => setReviewName(e.target.value)}
                    placeholder="e.g. Rahul Gupta"
                    className="w-full text-xs p-2.5 rounded-xl border border-amber-200 bg-white outline-none focus:border-brand-orange"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Rating</label>
                  <select
                    value={reviewRating}
                    onChange={(e) => setReviewRating(Number(e.target.value))}
                    className="w-full text-xs p-2.5 rounded-xl border border-amber-200 bg-white outline-none focus:border-brand-orange"
                  >
                    <option value="5">⭐⭐⭐⭐⭐ 5 Stars - Phenomenal!</option>
                    <option value="4">⭐⭐⭐⭐ 4 Stars - Very Good</option>
                    <option value="3">⭐⭐⭐ 3 Stars - Average</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Review Headline</label>
                <input
                  type="text"
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  placeholder="e.g. Perfect for morning espresso!"
                  className="w-full text-xs p-2.5 rounded-xl border border-amber-200 bg-white outline-none focus:border-brand-orange"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Your Feedback</label>
                <textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  rows={3}
                  placeholder="Tell others how long your cup stayed crispy and what drink you paired with it..."
                  className="w-full text-xs p-2.5 rounded-xl border border-amber-200 bg-white outline-none focus:border-brand-orange"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={submittingReview}
                className="px-6 py-2.5 bg-brand-orange text-white text-xs font-bold rounded-xl shadow-sm hover:bg-brand-orange-hover transition-colors"
              >
                {submittingReview ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          )}
        </div>

        {/* Existing Reviews List */}
        <div className="space-y-4">
          {product.reviews && product.reviews.length > 0 ? (
            product.reviews.map((r: any) => (
              <div key={r.id} className="p-4 rounded-2xl bg-cream-50 border border-amber-100">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-brand-chocolate">{r.user_name}</span>
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      Verified Purchase
                    </span>
                  </div>
                  <div className="flex text-amber-400">
                    {[...Array(r.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>
                {r.title && <h4 className="font-bold text-xs text-brand-chocolate mb-1">&quot;{r.title}&quot;</h4>}
                <p className="text-xs text-gray-600 leading-relaxed">&quot;{r.comment}&quot;</p>
              </div>
            ))
          ) : (
            <p className="text-xs text-gray-400 italic">No reviews yet. Be the first to crunch and review!</p>
          )}
        </div>
      </section>

      {/* ========================================================
          RELATED PRODUCTS
          ======================================================== */}
      {related.length > 0 && (
        <section className="space-y-6">
          <h2 className="text-2xl font-black text-brand-chocolate">
            You Might Also Crave
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((item) => (
              <Link
                key={item.id}
                href={`/product/${item.slug}`}
                className="bg-white p-4 rounded-3xl border border-amber-100 shadow-soft hover:shadow-hover hover:-translate-y-1 transition-all group"
              >
                <div className="aspect-square rounded-2xl overflow-hidden relative mb-3 bg-amber-50">
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <h3 className="font-bold text-sm text-brand-chocolate group-hover:text-brand-orange transition-colors line-clamp-1">
                  {item.name}
                </h3>
                <div className="flex items-center justify-between mt-2">
                  <span className="font-black text-brand-chocolate text-base">
                    ₹{item.salePrice || item.basePrice}
                  </span>
                  <span className="text-xs font-semibold text-brand-orange">View Details →</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

