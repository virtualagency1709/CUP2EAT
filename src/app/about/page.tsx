import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Sparkles, Leaf, Coffee, Award, Heart, CheckCircle2, ArrowRight } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="space-y-16 sm:space-y-24 py-10 sm:py-16">
      {/* Hero Header */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-orange bg-brand-orange/10 px-3.5 py-1.5 rounded-full">
          The CUP2EAT Story
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-brand-chocolate tracking-tight">
          Why Throw Away Your Cup When You Can{' '}
          <span className="text-brand-orange underline decoration-amber-300">Eat It?</span>
        </h1>
        <p className="text-sm sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
          CUP2EAT was born out of a simple question: What if drinking your favourite coffee or tea didn&apos;t create a single piece of garbage?
        </p>
      </section>

      {/* Story & Image Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 relative rounded-3xl overflow-hidden aspect-4/3 shadow-2xl bg-amber-100">
            <Image
              src="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=900&q=80"
              alt="CUP2EAT Bakery Craft"
              fill
              className="object-cover"
            />
          </div>

          <div className="lg:col-span-6 space-y-6 text-sm text-gray-600 leading-relaxed">
            <h2 className="text-2xl sm:text-3xl font-black text-brand-chocolate">
              Eat Your Drink! – A Delicious Revolution
            </h2>
            <p>
              Every year, over <strong>16 billion single-use paper cups</strong> are discarded globally. Even though they look like paper, almost all of them are coated with a thin layer of plastic polyethylene that takes over 30 years to decompose in landfills.
            </p>
            <p>
              At <strong>CUP2EAT</strong>, founded by <strong>Varun Khera</strong>, we asked: Why not replace plastic with Belgian chocolate? Why not replace paper with golden, crunchy, oven-baked butter biscuits?
            </p>
            <p>
              After months of rigorous food science and thermo-barrier testing, we perfected our proprietary dual-layer glazing formula. Today, our cups withstand piping hot liquids up to <strong>85°C for 45+ minutes</strong> with zero leakage and zero sogginess.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-cream-50 border border-amber-100">
                <Leaf className="w-5 h-5 text-emerald-600 mb-2" />
                <h4 className="font-bold text-brand-chocolate text-xs">100% Zero Waste</h4>
                <p className="text-[11px] text-gray-500">Pure edible indulgence</p>
              </div>
              <div className="p-4 rounded-2xl bg-cream-50 border border-amber-100">
                <Coffee className="w-5 h-5 text-brand-orange mb-2" />
                <h4 className="font-bold text-brand-chocolate text-xs">Hot & Cold Drinks</h4>
                <p className="text-[11px] text-gray-500">Espresso, tea, shakes, desserts</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values & Principles */}
      <section className="bg-cream-200/50 py-16 px-4 sm:px-6 lg:px-8 border-y border-amber-200/60">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-black text-brand-chocolate">
              Our Core Pillars
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-2">
              Every CUP2EAT product is created with these 3 uncompromising commitments:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-white rounded-3xl border border-amber-100 shadow-soft text-center space-y-3">
              <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-700 mx-auto text-2xl">
                🍫
              </div>
              <h3 className="font-black text-base text-brand-chocolate">Finest Food-Grade Ingredients</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                We use pure butter, unrefined cane sugar, and authentic Belgian chocolate cocoa butter. No harmful chemical coatings, zero wax, and 100% vegetarian.
              </p>
            </div>

            <div className="p-8 bg-white rounded-3xl border border-amber-100 shadow-soft text-center space-y-3">
              <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-700 mx-auto text-2xl">
                🌱
              </div>
              <h3 className="font-black text-base text-brand-chocolate">Zero Landfill Guilt</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                When you finish your drink, you simply crunch the cup! Nothing to throw in the trash, and nothing to pollute oceans or landfills.
              </p>
            </div>

            <div className="p-8 bg-white rounded-3xl border border-amber-100 shadow-soft text-center space-y-3">
              <div className="w-14 h-14 bg-rose-100 rounded-2xl flex items-center justify-center text-rose-700 mx-auto text-2xl">
                ✨
              </div>
              <h3 className="font-black text-base text-brand-chocolate">Fun & Youthful Experience</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Drinking coffee should make you smile. Watching friends and family take their first bite of their coffee cup creates unforgettable memories!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Founder & Contact CTA */}
      <section className="max-w-4xl mx-auto px-4 text-center space-y-6">
        <h2 className="text-2xl sm:text-3xl font-black text-brand-chocolate">
          Join the CUP2EAT Movement
        </h2>
        <p className="text-sm text-gray-600 max-w-lg mx-auto">
          Whether you&apos;re an avid home barista, café owner, or event planner, we would love to bring CUP2EAT to your table.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/shop"
            className="px-8 py-3.5 bg-brand-orange text-white font-bold text-sm rounded-xl shadow-md hover:bg-brand-orange-hover"
          >
            Taste Our Cups
          </Link>
          <Link
            href="/contact"
            className="px-8 py-3.5 bg-brand-chocolate text-white font-bold text-sm rounded-xl shadow-md hover:bg-brand-chocolate-dark"
          >
            Contact Founder & Team
          </Link>
        </div>
      </section>
    </div>
  );
}

