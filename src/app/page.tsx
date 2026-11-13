import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Sparkles,
  ArrowRight,
  Flame,
  CheckCircle,
  ShieldCheck,
  Coffee,
  Heart,
  Star,
  Instagram,
  Clock,
  Leaf,
  ChevronRight,
  Zap,
} from 'lucide-react';
import { getHomepageData } from '@/lib/db-queries';
import ProductCard from '@/components/ProductCard';

export const revalidate = 0; // Dynamic server rendering

export default async function HomePage() {
  const { products, categories, flavours, reviews } = getHomepageData();

  const featuredProducts = products.filter((p: any) => p.isFeatured).slice(0, 6);
  const bestSellers = products.filter((p: any) => p.isBestSeller).slice(0, 4);

  return (
    <div className="space-y-16 sm:space-y-24 pb-20 overflow-hidden">
      {/* ========================================================
          HERO SECTION
          ======================================================== */}
      <section className="relative pt-6 sm:pt-12 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-amber-50/70 via-cream-100 to-transparent">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-orange/10 border border-brand-orange/30 text-brand-orange text-xs sm:text-sm font-bold tracking-wide">
              <Sparkles className="w-4 h-4 text-brand-orange animate-pulse" />
              <span>India&apos;s 1st Edible Cookie & Wafer Cups</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-brand-chocolate tracking-tight leading-[1.1]">
              CUP<span className="text-brand-orange">2</span>EAT –{' '}
              <span className="text-brand-orange underline decoration-amber-300 decoration-wavy decoration-2">
                Eat Your Drink!
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-lg sm:text-xl text-brand-chocolate-light font-medium leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Your favourite flavours, your favourite drinks, all in one cup.
              Discover delicious zero-waste experiences with CUP2EAT. Pour your hot coffee or iced shake, sip for 45+ minutes, and crunch the delicious cookie cup!
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                href="/shop"
                className="w-full sm:w-auto px-8 py-4 bg-brand-orange hover:bg-brand-orange-hover text-white font-bold text-base rounded-2xl shadow-hover flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
              >
                Shop Now <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="#flavours"
                className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-amber-50 text-brand-chocolate font-bold text-base rounded-2xl border-2 border-brand-chocolate shadow-sm flex items-center justify-center gap-2 transition-all"
              >
                Explore Flavours <Coffee className="w-5 h-5 text-amber-700" />
              </Link>
            </div>

            {/* Key Trust Signals */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-amber-200/60 max-w-lg mx-auto lg:mx-0">
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-1 text-brand-chocolate font-black text-xl sm:text-2xl">
                  <span>45+</span>
                  <span className="text-brand-orange text-sm font-semibold">min</span>
                </div>
                <p className="text-xs text-gray-500 font-medium">Crisp & Leak-Proof</p>
              </div>

              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-1 text-brand-chocolate font-black text-xl sm:text-2xl">
                  <span>100%</span>
                </div>
                <p className="text-xs text-gray-500 font-medium">Edible & Zero Waste</p>
              </div>

              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-1 text-brand-chocolate font-black text-xl sm:text-2xl">
                  <span>85°C</span>
                </div>
                <p className="text-xs text-gray-500 font-medium">Hot Liquid Safe</p>
              </div>
            </div>
          </div>

          {/* Right Hero Image & Visual Badges */}
          <div className="lg:col-span-5 relative">
            {/* Background Glow */}
            <div className="absolute -inset-4 bg-gradient-to-tr from-amber-300/40 via-brand-orange/30 to-pink-300/30 rounded-full blur-3xl opacity-70" />

            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-square bg-amber-100">
              <Image
                src="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=1000&q=85"
                alt="CUP2EAT Edible Coffee Cookie Cup"
                fill
                priority
                className="object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>

            {/* Floating Badge 1 - Top Left */}
            <div className="absolute -top-4 -left-4 sm:top-4 sm:-left-8 bg-white/95 backdrop-blur-md p-3 sm:p-4 rounded-2xl shadow-xl border border-amber-100 flex items-center gap-3 animate-float">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700">
                <Leaf className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs font-bold text-brand-chocolate">100% Zero Trash</p>
                <p className="text-[11px] text-gray-500">Eat your cup after drinking</p>
              </div>
            </div>

            {/* Floating Badge 2 - Bottom Right */}
            <div className="absolute -bottom-4 -right-4 sm:bottom-6 sm:-right-6 bg-white/95 backdrop-blur-md p-3 sm:p-4 rounded-2xl shadow-xl border border-amber-100 flex items-center gap-3 animate-float" style={{ animationDelay: '1.5s' }}>
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-700">
                <Flame className="w-5 h-5 text-brand-orange" />
              </div>
              <div>
                <p className="text-xs font-bold text-brand-chocolate">Double Chocolate Lined</p>
                <p className="text-[11px] text-gray-500">Rich Belgian Cocoa Glaze</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          SHOP BY FLAVOUR
          ======================================================== */}
      <section id="flavours" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-orange bg-brand-orange/10 px-3.5 py-1 rounded-full">
            Taste The Magic
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-brand-chocolate mt-2">
            Shop By Flavour
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mt-2">
            From luscious Belgian dark chocolate to sweet strawberry swirl, each flavour is crafted to melt softly into your warm beverage.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {flavours.map((flav) => (
            <Link
              key={flav.id}
              href={`/shop?flavour=${encodeURIComponent(flav.name)}`}
              className="group p-5 rounded-3xl bg-white border border-amber-100/90 shadow-soft hover:shadow-hover hover:-translate-y-1.5 transition-all text-center flex flex-col items-center justify-between"
            >
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl shadow-inner mb-3 transition-transform group-hover:scale-110"
                style={{ backgroundColor: `${flav.color}20` }}
              >
                <span style={{ color: flav.color }}>🍪</span>
              </div>
              <h3 className="font-bold text-sm text-brand-chocolate group-hover:text-brand-orange transition-colors">
                {flav.name}
              </h3>
              <p className="text-[11px] text-gray-500 mt-1 line-clamp-1">
                {flav.description}
              </p>
              <span className="mt-3 text-[11px] font-semibold text-brand-orange inline-flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                Explore <ChevronRight className="w-3 h-3" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ========================================================
          HOW IT WORKS (4 STEPS)
          ======================================================== */}
      <section className="bg-cream-200/60 py-16 px-4 sm:px-6 lg:px-8 border-y border-amber-200/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-3xl font-black text-brand-chocolate">
              How To <span className="text-brand-orange">CUP2EAT</span>
            </h2>
            <p className="text-sm text-gray-600 mt-2">
              Four simple steps to turn your everyday beverage into an edible sensation.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: 'Pour Your Drink',
                desc: 'Fill with hot coffee, espresso, hot chocolate, tea, or cold milkshake up to 85°C.',
                icon: '☕',
              },
              {
                step: '02',
                title: 'Sip & Enjoy',
                desc: 'Take your time! The cup remains completely crisp and leak-proof for over 45 minutes.',
                icon: '⏱️',
              },
              {
                step: '03',
                title: 'Crunch & Eat',
                desc: 'Finished your drink? Crunch into the warm, chocolate-glazed butter cookie cup!',
                icon: '😋',
              },
              {
                step: '04',
                title: 'Zero Waste Left',
                desc: 'Nothing to throw in the bin. 100% edible, 100% delicious, zero paper or plastic waste.',
                icon: '🌱',
              },
            ].map((s) => (
              <div
                key={s.step}
                className="bg-white p-6 rounded-3xl border border-amber-100 shadow-soft relative group hover:-translate-y-1 transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl">{s.icon}</span>
                  <span className="text-2xl font-black text-amber-200/80 group-hover:text-brand-orange transition-colors">
                    {s.step}
                  </span>
                </div>
                <h3 className="font-bold text-base text-brand-chocolate mb-1.5">{s.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          FEATURED PRODUCTS
          ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-orange bg-brand-orange/10 px-3.5 py-1 rounded-full">
              Handcrafted For You
            </span>
            <h2 className="text-3xl font-black text-brand-chocolate mt-2">
              Featured Products
            </h2>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-orange hover:text-brand-orange-hover hover:underline"
          >
            View All Products ({products.length}) <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* ========================================================
          PROMOTIONAL BANNER
          ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-brand-chocolate via-brand-chocolate-dark to-[#4A2511] text-white p-8 sm:p-12 shadow-2xl">
          <div className="relative z-10 max-w-xl space-y-4">
            <span className="inline-block bg-brand-orange text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
              Limited Time Offer
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-amber-50 leading-tight">
              Something Delicious Is Waiting For You!
            </h2>
            <p className="text-amber-100/80 text-sm sm:text-base leading-relaxed">
              Order your CUP2EAT starter box today. Use coupon code{' '}
              <strong className="text-brand-orange underline">WELCOME10</strong> at checkout for 10% OFF + FREE Express Delivery across India.
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              <Link
                href="/shop"
                className="px-8 py-3.5 bg-brand-orange hover:bg-brand-orange-hover text-white font-bold text-sm rounded-xl shadow-lg transition-all"
              >
                Order Now
              </Link>
              <Link
                href="/product/cup2eat-party-starter-box"
                className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-sm rounded-xl border border-white/20 transition-all"
              >
                View Party Box (12 Cups)
              </Link>
            </div>
          </div>

          {/* Decorative Corner Cup Graphic */}
          <div className="hidden lg:block absolute -right-10 -bottom-10 w-96 h-96 opacity-25 pointer-events-none">
            <div className="text-[200px]">☕</div>
          </div>
        </div>
      </section>

      {/* ========================================================
          BEST SELLERS
          ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-100 px-3.5 py-1 rounded-full">
              Customer Favourites
            </span>
            <h2 className="text-3xl font-black text-brand-chocolate mt-2">
              Best Sellers
            </h2>
          </div>
          <Link
            href="/shop?sort=popularity"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-orange hover:text-brand-orange-hover hover:underline"
          >
            Explore Best Sellers <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* ========================================================
          WHY CHOOSE CUP2EAT?
          ======================================================== */}
      <section className="bg-white py-16 px-4 sm:px-6 lg:px-8 border-y border-amber-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-orange bg-brand-orange/10 px-3.5 py-1 rounded-full">
              The CUP2EAT Promise
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-brand-chocolate mt-2">
              Why Choose CUP2EAT?
            </h2>
            <p className="text-sm text-gray-600 mt-2">
              Engineered with food science, baked with passion. Here is why coffee lovers and party hosts trust CUP2EAT.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {[
              {
                title: 'Delicious Flavours',
                desc: 'Belgian Chocolate, Lotus Biscoff, Hazelnut Mocha, Strawberry, and Madagascar Vanilla.',
                icon: '🍫',
              },
              {
                title: 'Quality Ingredients',
                desc: 'Pure butter, unrefined cane sugar, real cocoa butter, and zero artificial preservatives.',
                icon: '🌾',
              },
              {
                title: 'Freshly Prepared',
                desc: 'Oven-baked in small batches, hermetically sealed to preserve fresh bakery crunch.',
                icon: '✨',
              },
              {
                title: 'Easy Online Ordering',
                desc: 'Seamless UPI, Cards, Net Banking or Cash on Delivery with real-time order tracking.',
                icon: '📱',
              },
              {
                title: '100% Eco-Friendly',
                desc: 'Eliminates plastic and wax-lined paper cups. Zero garbage left behind.',
                icon: '🌍',
              },
            ].map((f) => (
              <div
                key={f.title}
                className="p-6 rounded-3xl bg-cream-50 border border-amber-100 text-center hover:bg-amber-50 hover:border-amber-200 transition-all flex flex-col items-center"
              >
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="font-bold text-base text-brand-chocolate mb-1.5">{f.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          CUSTOMER REVIEWS & TESTIMONIALS
          ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-orange bg-brand-orange/10 px-3.5 py-1 rounded-full">
            Real Experiences
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-brand-chocolate mt-2">
            What Drinkers Are Saying
          </h2>
          <div className="flex items-center justify-center gap-2 mt-2">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="text-sm font-bold text-brand-chocolate">4.9 / 5.0 Rating</span>
            <span className="text-xs text-gray-500">(Over 600+ happy crunchers)</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((r) => (
            <div
              key={r.id}
              className="p-6 rounded-3xl bg-white border border-amber-100 shadow-soft hover:shadow-card transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex text-amber-400">
                    {[...Array(r.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-emerald-600" /> Verified Buyer
                  </span>
                </div>
                {r.title && (
                  <h4 className="font-bold text-brand-chocolate text-base mb-1.5">&quot;{r.title}&quot;</h4>
                )}
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">&quot;{r.comment}&quot;</p>
              </div>

              <div className="mt-4 pt-3 border-t border-amber-100/60 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-brand-chocolate">{r.user_name}</p>
                  <p className="text-[11px] text-gray-400">Purchased {r.product_name}</p>
                </div>
                <span className="text-xl">☕</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================
          INSTAGRAM SECTION
          ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-amber-50 via-cream-100 to-amber-50 rounded-3xl p-8 sm:p-12 border border-amber-200/60 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white shadow-xs text-xs font-bold text-pink-600 mb-4">
            <Instagram className="w-4 h-4 text-pink-500" />
            <span>@cup2eat on Instagram</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-brand-chocolate max-w-xl mx-auto">
            Join The #EatYourDrink Movement!
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-2 max-w-lg mx-auto">
            Tag @cup2eat in your morning coffee rituals, party setups, and dessert recipes to get featured on our official page!
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
            {[
              {
                url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&q=80',
                caption: 'Fresh morning espresso in Choco Crunch Cup',
              },
              {
                url: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=600&q=80',
                caption: 'Lotus Biscoff latte bliss',
              },
              {
                url: 'https://images.unsplash.com/photo-1541658016709-82535e94bc69?w=600&q=80',
                caption: 'Strawberry dessert mousse edible cups',
              },
              {
                url: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&q=80',
                caption: 'Party packs ready for the weekend',
              },
            ].map((photo, i) => (
              <a
                key={i}
                href="https://www.instagram.com/cup2eat/"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative aspect-square rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all"
              >
                <Image
                  src={photo.url}
                  alt={photo.caption}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-3 text-center">
                  <span className="text-white text-xs font-semibold flex items-center gap-1.5">
                    <Instagram className="w-4 h-4 text-pink-400" /> View Post
                  </span>
                </div>
              </a>
            ))}
          </div>

          <div className="mt-8">
            <a
              href="https://www.instagram.com/cup2eat/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-brand-chocolate hover:bg-brand-orange text-white text-xs sm:text-sm font-bold rounded-full shadow-md transition-colors"
            >
              Follow @cup2eat on Instagram <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
