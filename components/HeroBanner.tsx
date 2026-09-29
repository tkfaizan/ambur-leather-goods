"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function HeroBanner() {
  return (
    <section className="relative overflow-hidden bg-[#17110d] text-white">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-black via-[#1b120d]/95 to-transparent z-10" />

        <img
          src="https://res.cloudinary.com/qixavjja/image/upload/v1790655938/Gemini_Generated_Image_7y9hgx7y9hgx7y9h.png"
          alt="Premium genuine leather products"
          className="w-full h-full object-cover object-center"
        />

        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="min-h-[600px] md:min-h-[680px] flex items-center">
          <div className="max-w-2xl py-20">

            {/* Small Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full 
                         bg-white/10 border border-white/20 backdrop-blur-sm
                         text-sm font-medium"
            >
              <span className="w-2 h-2 rounded-full bg-brand-gold animate-pulse" />
              Made in Ambur, Tamil Nadu
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl 
                         font-serif font-bold leading-[1.05] mb-6"
            >
              Premium
              <span className="block text-brand-gold">
                Genuine Leather
              </span>
              Crafted for You
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-base sm:text-lg md:text-xl text-gray-300 
                         leading-relaxed mb-8 max-w-xl"
            >
              Discover handcrafted leather slippers, sandals, shoes,
              wallets, belts and bags — made with quality leather and
              crafted in Ambur, the heart of India's leather industry.
            </motion.p>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link
                href="/products"
                className="group bg-brand-gold hover:bg-yellow-500
                           text-black px-8 py-4 rounded-xl
                           font-bold inline-flex items-center
                           justify-center gap-3 text-lg
                           shadow-lg shadow-yellow-900/30
                           transition-all duration-300
                           hover:-translate-y-1"
              >
                Explore Collection

                <ArrowRight
                  className="w-5 h-5 transition-transform
                             group-hover:translate-x-1"
                />
              </Link>

              <a
                href="https://wa.me/919629292165"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-white/20
                           border border-white/30
                           backdrop-blur-sm
                           text-white px-8 py-4 rounded-xl
                           font-semibold inline-flex items-center
                           justify-center gap-3 text-lg
                           transition-all duration-300
                           hover:-translate-y-1"
              >
                Order on WhatsApp
              </a>
            </motion.div>

            {/* Trust Points */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.7 }}
              className="flex flex-wrap gap-x-6 gap-y-3 mt-10
                         text-sm text-gray-300"
            >
              <span className="flex items-center gap-2">
                ✓ Genuine Leather
              </span>

              <span className="flex items-center gap-2">
                ✓ Handmade Quality
              </span>

              <span className="flex items-center gap-2">
                ✓ Pan India Delivery
              </span>
            </motion.div>

          </div>
        </div>
      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24
                      bg-gradient-to-t from-[#17110d] to-transparent z-20" />
    </section>
  );
}