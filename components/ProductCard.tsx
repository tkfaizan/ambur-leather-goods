"use client";

import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { ProductWithDetails } from "@/types";
import { ShoppingBag } from "lucide-react";

export function ProductCard({ product }: { product: ProductWithDetails }) {
  const mainImage = product.images.find(i => i.isMain) || product.images[0];
  const hasDiscount = product.salePrice && product.salePrice < product.price;

  return (
    <div className="card group overflow-hidden hover:shadow-xl transition-all duration-300">
      <Link href={`/products/${product.slug}`} className="block relative aspect-square bg-gray-100 overflow-hidden">
        {mainImage ? (
          <Image src={mainImage.url} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300"><ShoppingBag className="w-12 h-12" /></div>
        )}
        {hasDiscount && <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">SALE</span>}
        {product.isBestSeller && <span className="absolute top-3 right-3 bg-brand-gold text-black text-xs font-bold px-2 py-1 rounded">BESTSELLER</span>}
      </Link>
      <div className="p-4">
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{product.category.name}</p>
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 group-hover:text-leather-700 transition-colors">{product.name}</h3>
        </Link>
        <div className="flex items-center gap-2 mb-3">
          {hasDiscount ? (
            <><span className="text-lg font-bold text-leather-700">{formatPrice(Number(product.salePrice))}</span><span className="text-sm text-gray-400 line-through">{formatPrice(Number(product.price))}</span></>
          ) : (
            <span className="text-lg font-bold text-leather-700">{formatPrice(Number(product.price))}</span>
          )}
        </div>
        {product.colors.length > 0 && (
          <div className="flex items-center gap-1 mb-2">
            <span className="text-xs text-gray-500 mr-1">Colors:</span>
            {product.colors.slice(0, 4).map(c => <span key={c.id} className="w-4 h-4 rounded-full border border-gray-200" style={{ backgroundColor: c.hex || "#8b4513" }} title={c.name} />)}
            {product.colors.length > 4 && <span className="text-xs text-gray-400">+{product.colors.length - 4}</span>}
          </div>
        )}
        {product.sizes.length > 0 && (
          <p className="text-xs text-gray-500 mb-3">Sizes: {product.sizes.slice(0, 5).map(s => s.size).join(", ")}{product.sizes.length > 5 && ` +${product.sizes.length - 5} more`}</p>
        )}
        <p className="text-xs text-gray-400">SKU: {product.sku}</p>
      </div>
    </div>
  );
}
