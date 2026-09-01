"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { ProductWithDetails } from "@/types";
import { useCart } from "./CartProvider";
import { ProductGrid } from "./ProductGrid";
import { Check, ShoppingBag, MessageCircle, ChevronLeft, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";

export function ProductDetail({ product, relatedProducts }: { product: ProductWithDetails; relatedProducts: ProductWithDetails[]; }) {
  const { addItem } = useCart();
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name || "");
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]?.size || "");
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const allImages = product.images.filter(img => !img.colorName || img.colorName === selectedColor).length > 0
    ? product.images.filter(img => !img.colorName || img.colorName === selectedColor)
    : product.images;

  const currentImage = allImages[currentImageIndex] || product.images[0];
  const selectedImageUrl = currentImage?.url || product.images[0]?.url || "";
  const hasDiscount = product.salePrice && product.salePrice < product.price;

  const validateSelection = () => {
    if (product.colors.length > 0 && !selectedColor) { toast.error("Please select a color"); return false; }
    if (product.sizes.length > 0 && !selectedSize) { toast.error("Please select a size"); return false; }
    return true;
  };

  const handleAddToCart = () => {
    if (!validateSelection()) return;
    addItem({ productId: product.id, name: product.name, sku: product.sku, color: selectedColor || "Default", size: selectedSize || "Default", quantity, price: Number(product.salePrice || product.price), imageUrl: selectedImageUrl });
  };

  const handleWhatsAppDirect = () => {
    if (!validateSelection()) return;
    const price = Number(product.salePrice || product.price);
    const total = price * quantity;
    const message = `Hi, I want to order:\n\nProduct: ${product.name}\nCode: ${product.sku}\nColor: ${selectedColor || "Default"}\nSize: ${selectedSize || "Default"}\nQuantity: ${quantity}\nPrice: ${formatPrice(total)}\n\nImage: ${selectedImageUrl}`;
    window.open(`https://wa.me/919629292165?text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <div className="py-8 md:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-leather-700">Home</Link><span className="mx-2">/</span>
        <Link href={`/categories/${product.category.slug}`} className="hover:text-leather-700">{product.category.name}</Link><span className="mx-2">/</span>
        <span className="text-leather-700 font-medium">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
        <div className="space-y-4">
          <div className="relative aspect-square bg-gray-100 rounded-2xl overflow-hidden">
            {currentImage ? <Image src={currentImage.url} alt={product.name} fill className="object-cover" priority /> : <div className="w-full h-full flex items-center justify-center text-gray-300"><ShoppingBag className="w-20 h-20" /></div>}
            {allImages.length > 1 && (
              <>
                <button onClick={() => setCurrentImageIndex(i => i === 0 ? allImages.length - 1 : i - 1)} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center hover:bg-white"><ChevronLeft className="w-5 h-5" /></button>
                <button onClick={() => setCurrentImageIndex(i => (i + 1) % allImages.length)} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center hover:bg-white"><ChevronRight className="w-5 h-5" /></button>
              </>
            )}
          </div>
          {allImages.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {allImages.map((img, idx) => (
                <button key={img.id} onClick={() => setCurrentImageIndex(idx)} className={`relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 ${idx === currentImageIndex ? "border-leather-700" : "border-transparent"}`}>
                  <Image src={img.url} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="lg:py-4">
          <p className="text-sm text-gray-500 uppercase tracking-wider mb-2">{product.category.name}</p>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">{product.name}</h1>
          <div className="flex items-center gap-3 mb-6">
            {hasDiscount ? (
              <><span className="text-3xl font-bold text-leather-700">{formatPrice(Number(product.salePrice))}</span><span className="text-xl text-gray-400 line-through">{formatPrice(Number(product.price))}</span><span className="bg-green-100 text-green-700 text-sm font-bold px-2 py-1 rounded">{Math.round((1 - Number(product.salePrice) / Number(product.price)) * 100)}% OFF</span></>
            ) : (
              <span className="text-3xl font-bold text-leather-700">{formatPrice(Number(product.price))}</span>
            )}
          </div>
          <div className="text-gray-600 leading-relaxed mb-6">dangerouslySetInnerHTML= dangerouslySetInnerHTML=__html:{product.description}</div>
          <div className="flex items-center gap-2 mb-6">
            <span className={`w-3 h-3 rounded-full ${product.stockStatus === "in_stock" ? "bg-green-500" : product.stockStatus === "low_stock" ? "bg-yellow-500" : "bg-red-500"}`} />
            <span className="text-sm font-medium">{product.stockStatus === "in_stock" ? "In Stock" : product.stockStatus === "low_stock" ? "Low Stock" : "Out of Stock"}</span>
          </div>

          {product.colors.length > 0 && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">Color: <span className="font-bold">{selectedColor}</span></label>
              <div className="flex flex-wrap gap-3">
                {product.colors.map((color) => (
                  <button key={color.id} onClick={() => { setSelectedColor(color.name); setCurrentImageIndex(0); }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all ${selectedColor === color.name ? "border-leather-700 bg-leather-50 text-leather-700" : "border-gray-200 hover:border-gray-300"}`}>
                    <span className="w-4 h-4 rounded-full border border-gray-200" style={{ backgroundColor: color.hex || "#8b4513" }} />{color.name}{selectedColor === color.name && <Check className="w-4 h-4" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.sizes.length > 0 && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">Size: <span className="font-bold">{selectedSize}</span></label>
              <div className="flex flex-wrap gap-3">
                {product.sizes.map((s) => (
                  <button key={s.id} onClick={() => setSelectedSize(s.size)}
                    className={`w-14 h-12 rounded-lg border-2 font-medium transition-all ${selectedSize === s.size ? "border-leather-700 bg-leather-50 text-leather-700" : "border-gray-200 hover:border-gray-300"}`}>{s.size}</button>
                ))}
              </div>
            </div>
          )}

          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-3">Quantity</label>
            <div className="flex items-center gap-4">
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-10 h-10 rounded-lg border-2 border-gray-200 flex items-center justify-center hover:bg-gray-50 font-bold">-</button>
              <span className="text-xl font-bold w-8 text-center">{quantity}</span>
              <button onClick={() => setQuantity(q => q + 1)} className="w-10 h-10 rounded-lg border-2 border-gray-200 flex items-center justify-center hover:bg-gray-50 font-bold">+</button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button onClick={handleAddToCart} disabled={product.stockStatus === "out_of_stock"} className="btn-primary flex-1 flex items-center justify-center gap-2 text-lg disabled:opacity-50"><ShoppingBag className="w-5 h-5" /> Add to Cart</button>
            <button onClick={handleWhatsAppDirect} disabled={product.stockStatus === "out_of_stock"} className="btn-whatsapp flex-1 text-lg disabled:opacity-50"><MessageCircle className="w-5 h-5" /> Order on WhatsApp</button>
          </div>
          <div className="mt-6 pt-6 border-t"><p className="text-sm text-gray-500">SKU: <span className="font-medium text-gray-900">{product.sku}</span></p></div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div className="border-t pt-12">
          <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">You May Also Like</h2>
          <ProductGrid products={relatedProducts} />
        </div>
      )}
    </div>
  );
}
