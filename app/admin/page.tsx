import { requireAuth } from "@/components/admin/requireAuth";
import { AdminShell } from "@/components/admin/AdminShell";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { Package, Grid, ShoppingCart, AlertTriangle, Star } from "lucide-react";

export default async function AdminDashboard() {
  await requireAuth();

  const totalProducts = await prisma.product.count();
  const totalCategories = await prisma.category.count();
  const totalOrders = await prisma.order.count();
  const lowStock = await prisma.product.count({ where: { stockStatus: "low_stock" } });
  const featured = await prisma.product.count({ where: { isFeatured: true } });

  const recentOrders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" }, take: 5, include: { items: true },
  });

  const cards = [
    { title: "Total Products", value: totalProducts, icon: Package, href: "/admin/products", color: "bg-blue-50 text-blue-700" },
    { title: "Categories", value: totalCategories, icon: Grid, href: "/admin/categories", color: "bg-green-50 text-green-700" },
    { title: "Total Orders", value: totalOrders, icon: ShoppingCart, href: "/admin/orders", color: "bg-purple-50 text-purple-700" },
    { title: "Low Stock", value: lowStock, icon: AlertTriangle, href: "/admin/products", color: "bg-red-50 text-red-700" },
    { title: "Featured", value: featured, icon: Star, href: "/admin/products", color: "bg-yellow-50 text-yellow-700" },
  ];

  return (
    <AdminShell>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Dashboard</h1>
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {cards.map(card => (
          <Link key={card.title} href={card.href} className="card p-6 hover:shadow-md transition-shadow">
            <div className={`w-12 h-12 rounded-lg ${card.color} flex items-center justify-center mb-4`}><card.icon className="w-6 h-6" /></div>
            <p className="text-2xl font-bold text-gray-900">{card.value}</p>
            <p className="text-sm text-gray-500">{card.title}</p>
          </Link>
        ))}
      </div>
      <div className="card">
        <div className="p-6 border-b"><h2 className="text-lg font-semibold">Recent Orders</h2></div>
        <div className="divide-y">
          {recentOrders.length === 0 ? <p className="p-6 text-gray-500 text-center">No orders yet</p> : (
            recentOrders.map(order => (
              <div key={order.id} className="p-4 flex justify-between items-center hover:bg-gray-50">
                <div>
                  <p className="font-medium">#{order.id} - {order.customerName}</p>
                  <p className="text-sm text-gray-500">{order.items.length} items • ₹{order.totalAmount.toString()}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${order.status === "new" ? "bg-blue-100 text-blue-700" : order.status === "confirmed" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>{order.status}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </AdminShell>
  );
}
