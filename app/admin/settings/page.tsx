"use client";

import { useState, useEffect } from "react";
import { Loader2, Upload } from "lucide-react";
import toast from "react-hot-toast";
import { AdminShell } from "@/components/admin/AdminShell";

interface Settings {
  businessName: string; whatsappNumber: string; businessPhone: string;
  email: string; address: string; instagramUrl: string; facebookUrl: string;
  logo: string | null; favicon: string | null;
}

export default function AdminSettings() {
  const [settings, setSettings] = useState<Settings>({
    businessName: "", whatsappNumber: "", businessPhone: "", email: "", address: "", instagramUrl: "", facebookUrl: "", logo: null, favicon: null,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/settings").then(r => r.json()).then(data => {
      if (data) setSettings(data);
      setLoading(false);
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSettings(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(settings) });
    if (res.ok) toast.success("Settings saved");
    else toast.error("Failed to save");
    setSaving(false);
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const data = new FormData();
    data.append("file", file);
    data.append("folder", "ambur-leather/settings");
    const res = await fetch("/api/upload", { method: "POST", body: data });
    const result = await res.json();
    if (result.url) { setSettings(prev => ({ ...prev, logo: result.url })); toast.success("Logo uploaded"); }
  };

  if (loading) return <AdminShell><div className="text-center py-20">Loading...</div></AdminShell>;

  return (
    <AdminShell>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Settings</h1>
      <form onSubmit={handleSubmit} className="card p-6 md:p-8 max-w-3xl space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label><input name="businessName" value={settings.businessName} onChange={handleChange} className="input-field" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Number *</label><input name="whatsappNumber" value={settings.whatsappNumber} onChange={handleChange} className="input-field" placeholder="919876543210" required /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Business Phone</label><input name="businessPhone" value={settings.businessPhone} onChange={handleChange} className="input-field" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Email</label><input name="email" type="email" value={settings.email} onChange={handleChange} className="input-field" /></div>
        </div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Address</label><textarea name="address" value={settings.address} onChange={handleChange} className="input-field min-h-[80px]" /></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Instagram URL</label><input name="instagramUrl" value={settings.instagramUrl} onChange={handleChange} className="input-field" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Facebook URL</label><input name="facebookUrl" value={settings.facebookUrl} onChange={handleChange} className="input-field" /></div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Logo</label>
          <div className="flex items-center gap-4">
            {settings.logo && <img src={settings.logo} alt="Logo" className="w-16 h-16 object-contain border rounded-lg" />}
            <label className="inline-flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-leather-700 transition-colors">
              <Upload className="w-4 h-4" /> Upload Logo
              <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
            </label>
          </div>
        </div>
        <button type="submit" disabled={saving} className="btn-primary disabled:opacity-70 flex items-center gap-2">
          {saving && <Loader2 className="w-4 h-4 animate-spin" />}Save Settings
        </button>
      </form>
    </AdminShell>
  );
}
