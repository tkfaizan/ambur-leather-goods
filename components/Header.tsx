"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "./CartProvider";
import { ShoppingBag, Menu, X, Search } from "lucide-react";

export function Header() {
  const { itemCount, setIsOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-leather-700 rounded-lg flex items-center justify-center text-white font-bold text-lg">A</div>
            <div className="hidden sm:block">
              <h1 className="font-serif font-bold text-xl text-gray-900 leading-tight">AMBUR</h1>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest -mt-1">Leather Goods</p>
            </div>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-gray-700 hover:text-leather-700 font-medium transition-colors">Home</Link>
            <Link href="/categories" className="text-gray-700 hover:text-leather-700 font-medium transition-colors">Categories</Link>
            <Link href="/products" className="text-gray-700 hover:text-leather-700 font-medium transition-colors">Shop</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/products" className="p-2 hover:bg-gray-100 rounded-full transition-colors"><Search className="w-5 h-5 text-gray-700" /></Link>
            <button onClick={() => setIsOpen(true)} className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ShoppingBag className="w-5 h-5 text-gray-700" />
              {mounted && itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-leather-700 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {itemCount}
                </span>
              )}
            </button>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 hover:bg-gray-100 rounded-full">{mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}</button>
          </div>
        </div>
      </div>
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-white animate-in slide-in-from-top">
          <nav className="px-4 py-4 space-y-1">
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="block py-3 px-4 text-gray-700 font-medium rounded-lg hover:bg-gray-50">Home</Link>
            <Link href="/categories" onClick={() => setMobileMenuOpen(false)} className="block py-3 px-4 text-gray-700 font-medium rounded-lg hover:bg-gray-50">Categories</Link>
            <Link href="/products" onClick={() => setMobileMenuOpen(false)} className="block py-3 px-4 text-gray-700 font-medium rounded-lg hover:bg-gray-50">Shop All</Link>
            <Link href="/cart" onClick={() => setMobileMenuOpen(false)} className="block py-3 px-4 text-gray-700 font-medium rounded-lg hover:bg-gray-50">Cart ({mounted ? itemCount : 0})</Link>
          </nav>
        </div>
      )}
    </header>
  );
}
