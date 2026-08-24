"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Plus, X, Upload, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

interface Category { id: number; name: string; }

interface ProductFormData {
  name: string; sku: string; description: string; price: string; salePrice: string;
  categoryId: string; stockStatus: string; isActive: boolean; isFeatured: boolean; isBestSeller: boolean;
  colors: { name: string; hex: string; image?: string }[];
  sizes: string[];
  images: { url: string; isMain: boolean; colorName?: string }[];
}

export default function ProductForm({ productId }: { productId?: string }) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState<ProductFormData>({
    name: "", sku: "", description: "", price: "", salePrice: "", categoryId: "",
    stockStatus: "in_stock", isActive: true, isFeatured: false, isBestSeller: false,
    colors: [], sizes: [], images: [],
  });

  useEffect(() => {
    fetch("/api/categories").then(r => r.json()).then(setCategories);
    if (productId) {
      setLoading(true);
      fetch(`/api/products/${productId}`).then(r => r.json()).then(p => {
        setForm({
          name: p.name || "", sku: p.sku || "", description: p.description || "",
          price: p.price?.toString() || "", salePrice: p.salePrice?.toString() || "",
          categoryId: p.categoryId?.toString() || "", stockStatus: p.stockStatus || "in_stock",
          isActive: p.isActive ?? true, isFeatured: p.isFeatured ?? false, isBestSeller: p.isBestSeller ?? false,
          colors: p.colors?.map((c: any) => ({ name: c.name, hex: c.hex || "", image: "" })) || [],
          sizes: p.sizes?.map((s: any) => s.size) || [],
          images: p.images?.map((i: any) => ({ url: i.url, isMain: i.isMain, colorName: i.colorName || "" })) || [],
        });
        setLoading(false);
      });
    }
  }, [productId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm(prev => ({ ...prev, [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value }));
  };

  const addColor = () => setForm(prev => ({ ...prev, colors: [...prev.colors, { name: "", hex: "#8b4513" }] }));
  const removeColor = (idx: number) => setForm(prev => ({ ...prev, colors: prev.colors.filter((_, i) => i !== idx) }));
  const updateColor = (idx: number, field: string, value: string) => {
    setForm(prev => ({ ...prev, colors: prev.colors.map((c, i) => i === idx ? { ...c, [field]: value } : c) }));
  };

  const addSize = () => setForm(prev => ({ ...prev, sizes: [...prev.sizes, ""] }));
  const removeSize = (idx: number) => setForm(prev => ({ ...prev, sizes: prev.sizes.filter((_, i) => i !== idx) }));
  const updateSize = (idx: number, value: string) => {
    setForm(prev => ({ ...prev, sizes: prev.sizes.map((s, i) => i === idx ? value : s) }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, colorName?: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const data = new FormData();
    data.append("file", file);
    data.append("folder", "ambur-leather/products");
    const res = await fetch("/api/upload", { method: "POST", body: data });
    const result = await res.json();
    if (result.url) {
      setForm(prev => ({ ...prev, images: [...prev.images, { url: result.url, isMain: prev.images.length === 0, colorName: colorName || "" }] }));
      toast.success("Image uploaded");
    } else {
      toast.error("Upload failed");
    }
    setUploading(false);
  };

  const removeImage = (idx: number) => setForm(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }));
  const setMainImage = (idx: number) => setForm(prev => ({ ...prev, images: prev.images.map((img, i) => ({ ...img, isMain: i === idx })) }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      name: form.name, sku: form.sku, description: form.description,
      price: parseFloat(form.price), salePrice: form.salePrice ? parseFloat(form.salePrice) : null,
      categoryId: parseInt(form.categoryId), stockStatus: form.stockStatus,
      isActive: form.isActive, isFeatured: form.isFeatured, isBestSeller: form.isBestSeller,
      colors: form.colors.filter(c => c.name).map(c => ({ name: c.name, hex: c.hex })),
      sizes: form.sizes.filter(s => s),
      images: form.images,
    };

    const url = productId ? `/api/products/${productId}` : "/api/products";
    const method = productId ? "PUT" : "POST";

    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    if (res.ok) {
      toast.success(productId ? "Product updated" : "Product created");
      router.push("/admin/products");
    } else {
      toast.error("Failed to save product");
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-20">Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">{productId ? "Edit Product" : "New Product"}</h1>
      <form onSubmit={handleSubmit} className="card p-6 md:p-8 max-w-4xl space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label><input name="name" value={form.name} onChange={handleChange} className="input-field" required /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">SKU / Product Code *</label><input name="sku" value={form.sku} onChange={handleChange} className="input-field" required /></div>
        </div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Description</label><textarea name="description" value={form.description} onChange={handleChange} className="input-field min-h-[100px]" /></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Price (₹) *</label><input name="price" type="number" value={form.price} onChange={handleChange} className="input-field" required /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Sale Price (₹)</label><input name="salePrice" type="number" value={form.salePrice} onChange={handleChange} className="input-field" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
            <select name="categoryId" value={form.categoryId} onChange={handleChange} className="input-field" required>
              <option value="">Select Category</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Stock Status</label>
            <select name="stockStatus" value={form.stockStatus} onChange={handleChange} className="input-field">
              <option value="in_stock">In Stock</option>
              <option value="low_stock">Low Stock</option>
              <option value="out_of_stock">Out of Stock</option>
            </select>
          </div>
          <div className="flex items-center gap-4 pt-6">
            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} className="w-4 h-4" /> Active</label>
            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" name="isFeatured" checked={form.isFeatured} onChange={handleChange} className="w-4 h-4" /> Featured</label>
            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" name="isBestSeller" checked={form.isBestSeller} onChange={handleChange} className="w-4 h-4" /> Best Seller</label>
          </div>
        </div>

        {/* Colors */}
        <div>
          <div className="flex justify-between items-center mb-3"><h3 className="font-medium">Colors</h3><button type="button" onClick={addColor} className="text-sm text-leather-700 flex items-center gap-1"><Plus className="w-4 h-4" /> Add Color</button></div>
          <div className="space-y-3">
            {form.colors.map((color, idx) => (
              <div key={idx} className="flex gap-3 items-center">
                <input type="color" value={color.hex} onChange={e => updateColor(idx, "hex", e.target.value)} className="w-10 h-10 rounded border" />
                <input value={color.name} onChange={e => updateColor(idx, "name", e.target.value)} placeholder="Color name" className="input-field flex-1" />
                <button type="button" onClick={() => removeColor(idx)} className="p-2 text-red-500 hover:bg-red-50 rounded"><X className="w-4 h-4" /></button>
              </div>
            ))}
          </div>
        </div>

        {/* Sizes */}
        <div>
          <div className="flex justify-between items-center mb-3"><h3 className="font-medium">Sizes</h3><button type="button" onClick={addSize} className="text-sm text-leather-700 flex items-center gap-1"><Plus className="w-4 h-4" /> Add Size</button></div>
          <div className="flex flex-wrap gap-2">
            {form.sizes.map((size, idx) => (
              <div key={idx} className="flex items-center gap-1">
                <input value={size} onChange={e => updateSize(idx, e.target.value)} placeholder="Size" className="input-field w-20 text-center py-2" />
                <button type="button" onClick={() => removeSize(idx)} className="p-1 text-red-500"><X className="w-3 h-3" /></button>
              </div>
            ))}
          </div>
        </div>

        {/* Images */}
        <div>
          <h3 className="font-medium mb-3">Product Images</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {form.images.map((img, idx) => (
              <div key={idx} className={`relative aspect-square rounded-lg overflow-hidden border-2 ${img.isMain ? "border-leather-700" : "border-gray-200"}`}>
                <img src={img.url} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  {!img.isMain && <button type="button" onClick={() => setMainImage(idx)} className="bg-white text-xs px-2 py-1 rounded">Set Main</button>}
                  <button type="button" onClick={() => removeImage(idx)} className="bg-red-500 text-white text-xs px-2 py-1 rounded">Remove</button>
                </div>
                {img.isMain && <span className="absolute top-2 left-2 bg-leather-700 text-white text-xs px-2 py-1 rounded">Main</span>}
              </div>
            ))}
          </div>
          <label className="inline-flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-leather-700 transition-colors">
            <Upload className="w-4 h-4" /> {uploading ? "Uploading..." : "Upload Image"}
            <input type="file" accept="image/*" onChange={e => handleImageUpload(e)} className="hidden" />
          </label>
        </div>

        <div className="flex gap-4 pt-4">
          <button type="submit" disabled={saving} className="btn-primary disabled:opacity-70 flex items-center gap-2">
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}{productId ? "Update Product" : "Create Product"}
          </button>
          <button type="button" onClick={() => router.push("/admin/products")} className="btn-secondary">Cancel</button>
        </div>
      </form>
    </div>
  );
}
