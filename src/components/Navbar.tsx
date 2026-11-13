'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ShoppingBag,
  Heart,
  User as UserIcon,
  Search,
  Menu,
  X,
  Phone,
  ChevronDown,
  Package,
  LogOut,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useAuth } from '@/context/AuthContext';
import SearchModal from './SearchModal';

export default function Navbar() {
  const pathname = usePathname();
  const { totalItems, setIsCartOpen } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, adminUser, logoutCustomer } = useAuth();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // If in admin panel, keep navbar clean or show Admin indicator
  const isAdminRoute = pathname?.startsWith('/admin');

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Shop All', href: '/shop' },
    { name: 'Flavours', href: '/#flavours' },
    { name: 'About Us', href: '/about' },
    { name: 'Track Order', href: '/track-order' },
    { name: 'Contact', href: '/contact' },
    { name: 'FAQ', href: '/faq' },
  ];

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="bg-brand-chocolate text-amber-100 text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-brand-orange animate-pulse" />
            <span>
              🎉 <strong>CUP2EAT Launch Offer:</strong> Use code <strong className="text-brand-orange underline">WELCOME10</strong> for 10% OFF | Free Shipping above ₹499
            </span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-amber-200/80">
            <a
              href="tel:9818192575"
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-brand-orange" />
              <span>9818192575</span>
            </a>
            <span className="text-amber-400/40">|</span>
            <Link href="/admin" className="hover:text-amber-300 font-medium flex items-center gap-1">
              <ShieldAlert className="w-3 h-3 text-amber-400" />
              Admin Portal
            </Link>
          </div>
        </div>
      </div>

      {/* Main Sticky Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-100/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 -ml-2 text-brand-chocolate rounded-xl hover:bg-amber-50"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-brand-orange to-amber-600 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <span className="text-xl font-black tracking-tight">☕</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-black tracking-tight text-brand-chocolate">
                  CUP<span className="text-brand-orange">2</span>EAT
                </span>
                <span className="hidden sm:inline-block bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Edible Cups
                </span>
              </div>
              <p className="text-[11px] font-semibold text-amber-700/90 tracking-wide uppercase">
                Eat Your Drink!
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm font-semibold transition-colors relative py-1 ${
                    isActive
                      ? 'text-brand-orange'
                      : 'text-brand-chocolate hover:text-brand-orange'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-orange rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2.5 text-brand-chocolate hover:text-brand-orange hover:bg-amber-50 rounded-2xl transition-colors"
              title="Search products"
              aria-label="Search products"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist Icon */}
            <Link
              href="/wishlist"
              className="p-2.5 text-brand-chocolate hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-colors relative"
              title="Wishlist"
              aria-label="View wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Account Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="p-2.5 text-brand-chocolate hover:text-brand-orange hover:bg-amber-50 rounded-2xl transition-colors flex items-center gap-1"
                aria-label="User account"
              >
                <UserIcon className="w-5 h-5" />
                <ChevronDown className="w-3.5 h-3.5 hidden sm:block text-gray-400" />
              </button>

              {isUserMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-amber-100 py-2 z-50 animate-fadeIn"
                  onMouseLeave={() => setIsUserMenuOpen(false)}
                >
                  {user ? (
                    <>
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-xs text-gray-500">Signed in as</p>
                        <p className="text-sm font-bold text-brand-chocolate truncate">{user.name}</p>
                        <p className="text-xs text-gray-400 truncate">{user.email}</p>
                      </div>
                      <Link
                        href="/account"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-brand-chocolate hover:bg-amber-50 transition-colors"
                      >
                        <UserIcon className="w-4 h-4 text-amber-600" />
                        My Profile
                      </Link>
                      <Link
                        href="/account?tab=orders"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-brand-chocolate hover:bg-amber-50 transition-colors"
                      >
                        <Package className="w-4 h-4 text-amber-600" />
                        My Orders & Invoices
                      </Link>
                      <Link
                        href="/track-order"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-brand-chocolate hover:bg-amber-50 transition-colors"
                      >
                        <Sparkles className="w-4 h-4 text-brand-orange" />
                        Track Order
                      </Link>
                      <button
                        onClick={async () => {
                          setIsUserMenuOpen(false);
                          await logoutCustomer();
                        }}
                        className="w-full text-left flex items-center gap-2.5 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 transition-colors border-t border-gray-100"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-xs text-gray-500">Welcome to CUP2EAT</p>
                        <p className="text-sm font-bold text-brand-chocolate">Customer Account</p>
                      </div>
                      <Link
                        href="/login"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-brand-chocolate hover:bg-amber-50 transition-colors"
                      >
                        Customer Login
                      </Link>
                      <Link
                        href="/register"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-brand-orange hover:bg-amber-50 transition-colors"
                      >
                        Create an Account
                      </Link>
                      <div className="border-t border-gray-100 mt-1 pt-1">
                        <Link
                          href="/admin/login"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs text-gray-500 hover:text-brand-chocolate hover:bg-gray-50 transition-colors"
                        >
                          <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                          Admin Login
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2 px-3 sm:px-4 py-2.5 bg-brand-orange hover:bg-brand-orange-hover text-white rounded-2xl shadow-sm hover:shadow-md transition-all font-bold text-sm"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Cart</span>
              <span className="w-5 h-5 bg-white text-brand-orange rounded-full text-xs flex items-center justify-center font-black">
                {totalItems}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-amber-100 px-6 py-6 space-y-4 shadow-xl animate-fadeIn">
            <nav className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`text-base font-semibold py-2 px-3 rounded-xl transition-colors ${
                    pathname === link.href
                      ? 'bg-amber-100 text-brand-orange'
                      : 'text-brand-chocolate hover:bg-amber-50'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
            <div className="pt-4 border-t border-gray-100 space-y-2">
              <Link
                href="/admin"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2 py-2 px-3 text-sm font-semibold text-amber-900 bg-amber-50 rounded-xl"
              >
                <ShieldAlert className="w-4 h-4 text-brand-orange" />
                Admin Dashboard
              </Link>
              <div className="text-xs text-gray-500 pt-2 px-3">
                Need Help? Call <a href="tel:9818192575" className="text-brand-orange font-bold">9818192575</a>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Global Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}

