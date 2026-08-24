"use client";

import { useState } from "react";
import { useCart } from "@/components/CartProvider";
import { formatPrice } from "@/lib/utils";
import { ShoppingBag, ArrowLeft, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    customerName: "",
    whatsappNumber: "",
    address: "",
    city: "",
    state: "Tamil Nadu",
    pincode: "",
    note: "",
  });

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <ShoppingBag className="w-20 h-20 text-gray-300 mx-auto mb-6" />
          <h1 className="text-2xl font-serif font-bold text-gray-900 mb-2">
            Your Cart is Empty
          </h1>
          <Link href="/products" className="btn-primary inline-flex items-center gap-2 mt-4">
            <ArrowLeft className="w-4 h-4" /> Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validateForm = () => {
    if (!formData.customerName.trim()) return "Please enter your name";
    if (!formData.whatsappNumber.trim() || formData.whatsappNumber.length < 10) return "Please enter a valid WhatsApp number";
    if (!formData.address.trim()) return "Please enter your address";
    if (!formData.city.trim()) return "Please enter your city";
    if (!formData.state.trim()) return "Please enter your state";
    if (!formData.pincode.trim() || formData.pincode.length < 6) return "Please enter a valid pincode";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const error = validateForm();
    if (error) {
      toast.error(error);
      return;
    }

    setIsSubmitting(true);

    try {
      // Save order to database
      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          items: items.map(item => ({
            productId: item.productId,
            productName: item.name,
            sku: item.sku,
            color: item.color,
            size: item.size,
            quantity: item.quantity,
            unitPrice: item.price,
            totalPrice: item.price * item.quantity,
            imageUrl: item.imageUrl,
          })),
          totalAmount: total,
        }),
      });

      if (!orderResponse.ok) {
        throw new Error('Failed to save order');
      }

      const { settings } = await orderResponse.json();

      // Generate WhatsApp message
      let message = `NEW ORDER - AMBUR Leather Goods\n\n`;
      message += `Customer Name: ${formData.customerName}\n`;
      message += `WhatsApp Number: ${formData.whatsappNumber}\n\n`;
      message += `Delivery Address:\n${formData.address}\n${formData.city}\n${formData.state}\n${formData.pincode}\n\n`;
      message += `ORDER DETAILS:\n\n`;

      items.forEach((item, index) => {
        message += `Product ${index + 1}: ${item.name}\n`;
        message += `Product Code: ${item.sku}\n`;
        message += `Colour: ${item.color}\n`;
        message += `Size: ${item.size}\n`;
        message += `Quantity: ${item.quantity}\n`;
        message += `Price: ${formatPrice(item.price * item.quantity)}\n`;
        message += `Product Image: ${item.imageUrl}\n`;
        message += `---\n\n`;
      });

      message += `TOTAL: ${formatPrice(total)}\n\n`;
      if (formData.note) {
        message += `Customer Note: ${formData.note}\n\n`;
      }
      message += `Thank you for ordering from AMBUR Leather Goods.`;

      // Open WhatsApp
      const whatsappUrl = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');

      // Clear cart
      clearCart();

      toast.success('Order sent! Check your WhatsApp.');
      router.push('/');
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-8 md:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <Link 
        href="/cart" 
        className="inline-flex items-center gap-2 text-leather-700 hover:underline mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Cart
      </Link>

      <h1 className="text-3xl font-serif font-bold text-gray-900 mb-8">
        Checkout
      </h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Customer Details Form */}
        <div className="flex-1">
          <form onSubmit={handleSubmit} className="card p-6 md:p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Delivery Details
            </h2>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  WhatsApp Number *
                </label>
                <input
                  type="tel"
                  name="whatsappNumber"
                  value={formData.whatsappNumber}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="e.g., 9876543210"
                  required
                  pattern="[0-9]{10,15}"
                />
                <p className="text-xs text-gray-500 mt-1">
                  We will send order updates on this number
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Delivery Address *
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="input-field min-h-[100px] resize-none"
                  placeholder="Enter your complete address"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="City"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State *
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="State"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pincode *
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="6-digit pincode"
                    required
                    pattern="[0-9]{6}"
                    maxLength={6}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Order Notes (Optional)
                </label>
                <textarea
                  name="note"
                  value={formData.note}
                  onChange={handleChange}
                  className="input-field min-h-[80px] resize-none"
                  placeholder="Any special instructions..."
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-whatsapp w-full mt-8 text-lg py-4 disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Order on WhatsApp
                </>
              )}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:w-96">
          <div className="card p-6 sticky top-24">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Order Summary
            </h2>

            <div className="space-y-4 mb-6 max-h-80 overflow-y-auto">
              {items.map((item) => (
                <div key={`${item.productId}-${item.color}-${item.size}`} className="flex gap-3">
                  <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                    {item.imageUrl && (
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-gray-900 truncate">{item.name}</p>
                    <p className="text-xs text-gray-500">
                      {item.color} / Size {item.size}
                    </p>
                    <p className="text-sm font-medium mt-1">
                      {item.quantity} × {formatPrice(item.price)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="flex justify-between text-xl font-bold pt-2">
                <span>Total</span>
                <span className="text-leather-700">{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
