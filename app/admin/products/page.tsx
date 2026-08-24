"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, Star, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { AdminShell } from "@/components/admin/AdminShell";

interface Product {
  id: number; name: string; sku: string; price: number; salePrice: number | null;
  stockStatus: string; isActive: boolean; isFeatured: boolean; isBestSeller: boolean;
  category: { name: string }; _count: { images: number };
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    const res = await fetch("/api/products?admin=true");
    const data = await res.json();
    setProducts(data);
    setLoading(false);
  };

  const deleteProduct = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    toast.success("Product deleted");
    fetchProducts();
  };

  const toggleField = async (id: number, field: string, value: boolean) => {
    await fetch(`/api/products/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ [field]: !value }) });
    fetchProducts();
  };

  if (loading) return <AdminShell><div className="text-center py-20 text-gray-500">Loading products...</div></AdminShell>;

  return (
    <AdminShell>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <Link href="/admin/products/new" className="btn-primary flex items-center gap-2 text-sm"><Plus className="w-4 h-4" /> Add Product</Link>
      </div>
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50"><tr>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Product</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">SKU</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Price</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Stock</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Actions</th>
            </tr></thead>
            <tbody className="divide-y">
              {products.map(p => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{p.name}</div>
                    <div className="text-sm text-gray-500">{p.category.name}</div>
                  </td>
                  <td className="px-6 py-4 text-sm">{p.sku}</td>
                  <td className="px-6 py-4">
                    {p.salePrice ? <span><span className="font-bold">₹{p.salePrice}</span><span className="text-gray-400 line-through ml-2 text-sm">₹{p.price}</span></span> : <span className="font-bold">₹{p.price}</span>}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${p.stockStatus === "in_stock" ? "bg-green-100 text-green-700" : p.stockStatus === "low_stock" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>{p.stockStatus}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => toggleField(p.id, "isActive", p.isActive)} title="Toggle Active">{p.isActive ? <Eye className="w-4 h-4 text-green-600" /> : <EyeOff className="w-4 h-4 text-gray-400" />}</button>
                      <button onClick={() => toggleField(p.id, "isFeatured", p.isFeatured)} title="Toggle Featured"><Star className={`w-4 h-4 ${p.isFeatured ? "text-yellow-500 fill-yellow-500" : "text-gray-400"}`} /></button>
                      <button onClick={() => router.push(`/admin/products/${p.id}`)} className="p-1 hover:bg-gray-100 rounded"><Pencil className="w-4 h-4 text-blue-600" /></button>
                      <button onClick={() => deleteProduct(p.id)} className="p-1 hover:bg-gray-100 rounded"><Trash2 className="w-4 h-4 text-red-600" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  );
}
