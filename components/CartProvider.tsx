"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { CartItem } from "@/types";
import toast from "react-hot-toast";
import { ShoppingBag, X, Minus, Plus, Trash2 } from "lucide-react";

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  updateQuantity: (productId: number, color: string, size: string, quantity: number) => void;
  removeItem: (productId: number, color: string, size: string) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Only load from localStorage after mount (client-side only)
  useEffect(() => {
    try {
      const saved = localStorage.getItem("ambur-cart");
      if (saved) setItems(JSON.parse(saved));
    } catch (e) {
      console.error("Failed to load cart:", e);
    }
    setMounted(true);
  }, []);

  // Save to localStorage on changes
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("ambur-cart", JSON.stringify(items));
    }
  }, [items, mounted]);

  const addItem = (newItem: CartItem) => {
    setItems(prev => {
      const existing = prev.find(i => i.productId === newItem.productId && i.color === newItem.color && i.size === newItem.size);
      if (existing) {
        toast.success("Updated quantity in cart");
        return prev.map(i => i.productId === newItem.productId && i.color === newItem.color && i.size === newItem.size
          ? { ...i, quantity: i.quantity + newItem.quantity } : i);
      }
      toast.success("Added to cart");
      setIsOpen(true);
      return [...prev, newItem];
    });
  };

  const updateQuantity = (productId: number, color: string, size: string, quantity: number) => {
    if (quantity < 1) return;
    setItems(prev => prev.map(i => i.productId === productId && i.color === color && i.size === size ? { ...i, quantity } : i));
  };

  const removeItem = (productId: number, color: string, size: string) => {
    setItems(prev => prev.filter(i => !(i.productId === productId && i.color === color && i.size === size)));
    toast.success("Removed from cart");
  };

  const clearCart = () => setItems([]);
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, updateQuantity, removeItem, clearCart, total, itemCount, isOpen, setIsOpen }}>
      {children}
      {mounted && <CartDrawer />}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};

function CartDrawer() {
  const { items, isOpen, setIsOpen, updateQuantity, removeItem, total } = useCart();
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/50" onClick={() => setIsOpen(false)} />
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-bold flex items-center gap-2"><ShoppingBag className="w-5 h-5" /> Your Cart ({items.length})</h2>
          <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-gray-100 rounded-full"><X className="w-5 h-5" /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="w-16 h-16 text-gray-200 mx-auto mb-4" />
              <p className="text-gray-500">Your cart is empty</p>
              <button onClick={() => setIsOpen(false)} className="mt-4 text-leather-700 hover:underline text-sm">Continue Shopping</button>
            </div>
          ) : (
            items.map(item => (
              <div key={`${item.productId}-${item.color}-${item.size}`} className="flex gap-3 border-b pb-4">
                <div className="w-20 h-20 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                  {item.imageUrl ? <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-300"><ShoppingBag className="w-8 h-8" /></div>}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm truncate">{item.name}</h4>
                  <p className="text-xs text-gray-500">{item.color} / Size {item.size}</p>
                  <p className="text-xs text-gray-400">{item.sku}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <button onClick={() => updateQuantity(item.productId, item.color, item.size, item.quantity - 1)} className="w-7 h-7 border rounded flex items-center justify-center hover:bg-gray-50"><Minus className="w-3 h-3" /></button>
                    <span className="text-sm w-6 text-center font-medium">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.productId, item.color, item.size, item.quantity + 1)} className="w-7 h-7 border rounded flex items-center justify-center hover:bg-gray-50"><Plus className="w-3 h-3" /></button>
                  </div>
                </div>
                <div className="text-right flex flex-col justify-between">
                  <p className="font-bold text-sm">₹{item.price * item.quantity}</p>
                  <button onClick={() => removeItem(item.productId, item.color, item.size)} className="text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))
          )}
        </div>
        {items.length > 0 && (
          <div className="p-4 border-t space-y-3 bg-gray-50">
            <div className="flex justify-between font-bold text-lg"><span>Total</span><span className="text-leather-700">₹{total}</span></div>
            <a href="/cart" onClick={() => setIsOpen(false)} className="btn-primary w-full block text-center text-sm py-3">View Cart</a>
            <a href="/checkout" onClick={() => setIsOpen(false)} className="btn-whatsapp w-full block text-center text-sm py-3">Order on WhatsApp</a>
          </div>
        )}
      </div>
    </div>
  );
}
