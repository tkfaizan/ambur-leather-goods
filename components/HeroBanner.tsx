"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function HeroBanner() {
  return (
    <section className="relative bg-gradient-to-br from-leather-900 via-leather-800 to-leather-900 text-white overflow-hidden">
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 relative z-10">
        <div className="max-w-2xl">
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-4xl md:text-6xl font-serif font-bold leading-tight mb-6">
            Handcrafted <span className="text-brand-gold">Leather</span> Excellence
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed">
            Premium genuine leather slippers, sandals, shoes, belts, wallets, and bags — directly from the leather capital of India, Ambur, Tamil Nadu.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }} className="flex flex-col sm:flex-row gap-4">
            <Link href="/products" className="bg-brand-gold hover:bg-yellow-600 text-black px-8 py-4 rounded-lg font-semibold inline-flex items-center justify-center gap-2 text-lg transition-colors">Shop Now <ArrowRight className="w-5 h-5" /></Link>
            <a href="https://wa.me/919629292165" target="_blank" className="bg-white/10 border-2 border-white/30 text-white hover:bg-white/20 px-8 py-4 rounded-lg font-semibold inline-flex items-center justify-center gap-2 text-lg transition-colors">Order on WhatsApp</a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
