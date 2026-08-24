"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { AdminShell } from "@/components/admin/AdminShell";

interface Category { id: number; name: string; slug: string; description: string | null; sortOrder: number; isActive: boolean; }

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState({ name: "", slug: "", description: "", sortOrder: 0, isActive: true });

  useEffect(() => { fetchCategories(); }, []);

  const fetchCategories = async () => {
    const res = await fetch("/api/categories");
    const data = await res.json();
    setCategories(data);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editing ? `/api/categories/${editing.id}` : "/api/categories";
    const method = editing ? "PUT" : "POST";
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    if (res.ok) { toast.success(editing ? "Category updated" : "Category created"); setEditing(null); setForm({ name: "", slug: "", description: "", sortOrder: 0, isActive: true }); fetchCategories(); }
    else toast.error("Failed to save");
  };

  const deleteCategory = async (id: number) => {
    if (!confirm("Delete this category?")) return;
    await fetch(`/api/categories/${id}`, { method: "DELETE" });
    toast.success("Deleted");
    fetchCategories();
  };

  const startEdit = (cat: Category) => { setEditing(cat); setForm({ name: cat.name, slug: cat.slug, description: cat.description || "", sortOrder: cat.sortOrder, isActive: cat.isActive }); };

  if (loading) return <AdminShell><div className="text-center py-20">Loading...</div></AdminShell>;

  return (
    <AdminShell>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Categories</h1>
      <form onSubmit={handleSubmit} className="card p-6 mb-8">
        <h3 className="font-medium mb-4">{editing ? "Edit Category" : "Add Category"}</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Name" className="input-field" required />
          <input value={form.slug} onChange={e => setForm({...form, slug: e.target.value})} placeholder="Slug" className="input-field" required />
          <input value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Description" className="input-field" />
          <div className="flex gap-2">
            <input type="number" value={form.sortOrder} onChange={e => setForm({...form, sortOrder: parseInt(e.target.value)})} placeholder="Order" className="input-field w-20" />
            <button type="submit" className="btn-primary text-sm">{editing ? "Update" : "Add"}</button>
            {editing && <button type="button" onClick={() => setEditing(null)} className="btn-secondary text-sm">Cancel</button>}
          </div>
        </div>
      </form>
      <div className="card overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50"><tr><th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Name</th><th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Slug</th><th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Order</th><th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Actions</th></tr></thead>
          <tbody className="divide-y">
            {categories.map(cat => (
              <tr key={cat.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium">{cat.name}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{cat.slug}</td>
                <td className="px-6 py-4 text-sm">{cat.sortOrder}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button onClick={() => startEdit(cat)} className="p-1 hover:bg-gray-100 rounded"><Pencil className="w-4 h-4 text-blue-600" /></button>
                    <button onClick={() => deleteCategory(cat.id)} className="p-1 hover:bg-gray-100 rounded"><Trash2 className="w-4 h-4 text-red-600" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
