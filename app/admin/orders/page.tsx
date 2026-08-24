"use client";

import { useState, useEffect } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import toast from "react-hot-toast";

interface Order {
  id: number; customerName: string; whatsappNumber: string; address: string; city: string; state: string; pincode: string;
  status: string; totalAmount: number; note: string | null; createdAt: string;
  items: { productName: string; sku: string; color: string; size: string; quantity: number; unitPrice: number; totalPrice: number; imageUrl: string }[];
}

const statuses = ["new", "whatsapp_sent", "confirmed", "processing", "shipped", "delivered", "cancelled"];

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    const res = await fetch("/api/orders");
    const data = await res.json();
    setOrders(data);
    setLoading(false);
  };

  const updateStatus = async (id: number, status: string) => {
    await fetch(`/api/orders/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
    toast.success("Status updated");
    fetchOrders();
  };

  if (loading) return <AdminShell><div className="text-center py-20">Loading orders...</div></AdminShell>;

  return (
    <AdminShell>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Orders</h1>
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50"><tr>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Order #</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Customer</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">WhatsApp</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Amount</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Status</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Date</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Actions</th>
            </tr></thead>
            <tbody className="divide-y">
              {orders.map(order => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">#{order.id}</td>
                  <td className="px-6 py-4">{order.customerName}</td>
                  <td className="px-6 py-4 text-sm">{order.whatsappNumber}</td>
                  <td className="px-6 py-4 font-bold">₹{order.totalAmount}</td>
                  <td className="px-6 py-4">
                    <select value={order.status} onChange={e => updateStatus(order.id, e.target.value)} className="text-sm border rounded px-2 py-1">
                      {statuses.map(s => <option key={s} value={s}>{s.replace("_", " ").toUpperCase()}</option>)}
                    </select>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <button onClick={() => setSelectedOrder(order)} className="text-sm text-leather-700 hover:underline">View Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSelectedOrder(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-xl font-bold mb-4">Order #{selectedOrder.id}</h2>
            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><p className="text-gray-500">Customer</p><p className="font-medium">{selectedOrder.customerName}</p></div>
                <div><p className="text-gray-500">WhatsApp</p><p className="font-medium">{selectedOrder.whatsappNumber}</p></div>
                <div className="col-span-2"><p className="text-gray-500">Address</p><p className="font-medium">{selectedOrder.address}, {selectedOrder.city}, {selectedOrder.state} - {selectedOrder.pincode}</p></div>
                {selectedOrder.note && <div className="col-span-2"><p className="text-gray-500">Note</p><p>{selectedOrder.note}</p></div>}
              </div>
            </div>
            <h3 className="font-semibold mb-3">Items</h3>
            <div className="space-y-3">
              {selectedOrder.items.map((item, i) => (
                <div key={i} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                  <img src={item.imageUrl} alt="" className="w-16 h-16 object-cover rounded" />
                  <div className="flex-1">
                    <p className="font-medium">{item.productName}</p>
                    <p className="text-sm text-gray-500">{item.sku} • {item.color} • Size {item.size} • Qty {item.quantity}</p>
                    <p className="font-bold text-sm">₹{item.totalPrice}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t flex justify-between items-center">
              <p className="text-lg font-bold">Total: ₹{selectedOrder.totalAmount}</p>
              <button onClick={() => setSelectedOrder(null)} className="btn-secondary">Close</button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
