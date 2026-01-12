"use client";

import React, { useState } from "react";
import NextLink from "next/link";
const Link = NextLink as any;
import { useStore } from "@/context/StoreContext";
import {
  ShoppingBag as ShoppingBagIcon,
  Menu as MenuIcon,
  X as XIcon,
  Search as SearchIcon,
  ChevronRight as ChevronRightIcon,
  User as UserIcon,
} from "lucide-react";
const ShoppingBag = ShoppingBagIcon as any;
const Menu = MenuIcon as any;
const X = XIcon as any;
const Search = SearchIcon as any;
const ChevronRight = ChevronRightIcon as any;
const User = UserIcon as any;
import { useParams } from "next/navigation";

import { FlashSaleBanner } from "@/components/FlashSaleBanner";

export function StoreShell({ children }: { children: React.ReactNode }) {
  const { store, isLoading, error } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const params = useParams();
  const lang = (params.lang as string) || "tr";

  // Initial Loading State
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 bg-gray-200 rounded-full mb-4"></div>
          <div className="h-4 w-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  // Error / No Store State
  if (error || !store) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
        <h1 className="text-2xl font-bold mb-2">Store Not Found</h1>
        <p className="text-gray-500 mb-6">
          The store you are looking for does not exist or is currently
          unavailable.
        </p>
        <div className="text-sm text-gray-400">
          If you are the owner, please check your settings.
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Flash Sale Banner */}
      {store?.id && <FlashSaleBanner storeId={store.id} />}

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Left: Mobile Menu & Logo */}
          <div className="flex items-center gap-4">
            <button
              className="md:hidden p-2 -ml-2 hover:bg-gray-100 rounded-full"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Toggle mobile menu"
            >
              <Menu size={20} />
            </button>

            <Link
              href={`/?store=${store?.slug}`}
              className="flex items-center gap-2"
            >
              {/* Logo Placeholder */}
              <div className="w-8 h-8 bg-black text-white rounded flex items-center justify-center font-bold text-lg">
                {store?.name?.charAt(0)}
              </div>
              <span className="font-bold text-lg tracking-tight hidden sm:block">
                {store?.name}
              </span>
            </Link>
          </div>

          {/* Center: Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href={`/?store=${store?.slug}`}
              className="text-sm font-medium hover:text-gray-600 transition-colors"
            >
              Home
            </Link>
            <Link
              href={`/products?store=${store?.slug}`}
              className="text-sm font-medium hover:text-gray-600 transition-colors"
            >
              Shop
            </Link>
            <Link
              href={`/pages/about?store=${store?.slug}`}
              className="text-sm font-medium hover:text-gray-600 transition-colors"
            >
              About
            </Link>
            <Link
              href={`/pages/contact?store=${store?.slug}`}
              className="text-sm font-medium hover:text-gray-600 transition-colors"
            >
              Contact
            </Link>
          </nav>

          {/* Right: Search, Account & Cart */}
          <div className="flex items-center gap-2">
            <button
              className="p-2 hover:bg-gray-100 rounded-full"
              aria-label="Search"
            >
              <Search size={20} />
            </button>
            <Link href={`/${lang}/account`}>
              <button
                className="p-2 hover:bg-gray-100 rounded-full"
                aria-label="Account"
              >
                <User size={20} />
              </button>
            </Link>
            <Link href={`/cart?store=${store?.slug}`}>
              <button
                className="p-2 hover:bg-gray-100 rounded-full relative"
                aria-label="Cart"
              >
                <ShoppingBag size={20} />
              </button>
            </Link>
          </div>
        </div>
      </header>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[60] md:hidden">
          <button
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            aria-label="Close mobile menu"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="absolute top-4 left-4 right-4 rounded-2xl bg-white shadow-xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 bg-black text-white rounded-full flex items-center justify-center font-bold text-lg">
                  {store?.name?.charAt(0)}
                </div>
                <span className="font-bold text-lg tracking-tight">
                  {store?.name}
                </span>
              </div>
              <button
                className="p-2 rounded-full hover:bg-gray-100"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
            </div>

            <nav className="space-y-4 text-sm font-medium">
              <Link
                href={`/?store=${store?.slug}`}
                className="flex items-center justify-between rounded-lg px-3 py-2 hover:bg-gray-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home <ChevronRight size={16} />
              </Link>
              <Link
                href={`/products?store=${store?.slug}`}
                className="flex items-center justify-between rounded-lg px-3 py-2 hover:bg-gray-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                Shop <ChevronRight size={16} />
              </Link>
              <Link
                href={`/pages/about?store=${store?.slug}`}
                className="flex items-center justify-between rounded-lg px-3 py-2 hover:bg-gray-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                About <ChevronRight size={16} />
              </Link>
              <Link
                href={`/pages/contact?store=${store?.slug}`}
                className="flex items-center justify-between rounded-lg px-3 py-2 hover:bg-gray-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact <ChevronRight size={16} />
              </Link>
            </nav>

            <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
              <Link
                href={`/${lang}/account`}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-200 px-4 py-2 font-medium hover:bg-gray-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                <User size={16} /> Account
              </Link>
              <Link
                href={`/cart?store=${store?.slug}`}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-black px-4 py-2 font-medium text-white hover:bg-gray-900"
                onClick={() => setMobileMenuOpen(false)}
              >
                <ShoppingBag size={16} /> Cart
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-100 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-black text-white rounded flex items-center justify-center font-bold text-lg">
                  {store?.name?.charAt(0)}
                </div>
                <span className="font-bold text-lg tracking-tight">
                  {store?.name}
                </span>
              </div>
              <p className="text-gray-500 text-sm max-w-sm leading-relaxed">
                {store?.tagline || "Premium quality goods."}
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-4">Shop</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li>
                  <Link
                    href={`/collections/new?store=${store?.slug}`}
                    className="hover:text-black"
                  >
                    New Arrivals
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/collections/bestsellers?store=${store?.slug}`}
                    className="hover:text-black"
                  >
                    Bestsellers
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/collections/all?store=${store?.slug}`}
                    className="hover:text-black"
                  >
                    All Products
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Customer Care</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li>
                  <Link
                    href={`/policies/shipping?store=${store?.slug}`}
                    className="hover:text-black"
                  >
                    Shipping Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/policies/returns?store=${store?.slug}`}
                    className="hover:text-black"
                  >
                    Returns & Exchange
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/policies/privacy?store=${store?.slug}`}
                    className="hover:text-black"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/policies/terms?store=${store?.slug}`}
                    className="hover:text-black"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/contact?store=${store?.slug}`}
                    className="hover:text-black"
                  >
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-400">
            <p>
              © {new Date().getFullYear()} {store?.name}. All rights reserved.
            </p>
            <div className="flex items-center gap-1">
              <span>Powered by</span>
              <span className="font-bold text-black">Vayva</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
