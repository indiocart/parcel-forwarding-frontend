'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth.service';
import api from '@/services/api';
import AdminGuard from '@/components/AdminGuard';

interface Order {
  id: number;
  userId: number;
  status: string;
  orderType: string;
  consolidationRequested: boolean;
  paymentStatus: boolean;
  createdAt: string;
  user?: {
    fullName: string;
    email: string;
  };
  items?: any[];
}

export default function AdminPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState('');
  const [message, setMessage] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchOrders = async () => {
    try {
      const response = await api.get('/admin/orders');
      setOrders(response.data);
      setFilteredOrders(response.data);
    } catch (error) {
      console.error('Failed to fetch orders', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  useEffect(() => {
    let list = orders;

    if (statusFilter !== 'all') {
      list = list.filter(o => o.status === statusFilter);
    }

    if (search) {
      list = list.filter(o =>
        o.id.toString().includes(search) ||
        o.user?.fullName?.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredOrders(list);
  }, [search, statusFilter, orders]);

  const updateOrderStatus = async (orderId: number, status: string) => {
    await api.put(`/admin/orders/${orderId}/status`, { status, message });
    fetchOrders();
    setSelectedOrder(null);
    setMessage('');
    setNewStatus('');
  };

  const togglePayment = async (orderId: number, current: boolean) => {
    await api.put(`/admin/orders/${orderId}/payment`, { paymentStatus: !current });
    fetchOrders();
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      submitted: 'bg-yellow-200 text-yellow-800',
      estimation_sent: 'bg-purple-200 text-purple-800',
      awaiting_payment: 'bg-orange-200 text-orange-800',
      purchased: 'bg-blue-200 text-blue-800',
      received_at_warehouse: 'bg-indigo-200 text-indigo-800',
      packing: 'bg-pink-200 text-pink-800',
      shipped: 'bg-teal-200 text-teal-800',
      delivered: 'bg-green-200 text-green-800',
      completed: 'bg-green-200 text-green-800',
      cancelled: 'bg-red-200 text-red-800',
    };
    return colors[status] || 'bg-gray-200 text-gray-800';
  };

  const handleLogout = () => authService.logout();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-2xl">Loading Admin Panel...</div>;
  }

  return (
    <AdminGuard>
      <div className="min-h-screen bg-gray-50">

        {/* NAVBAR */}
        <nav className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-purple-600">IndioCart Admin</h1>
            <div className="flex gap-3">
              <button onClick={() => router.push('/dashboard')} className="bg-sky-500 text-white px-4 py-2 rounded-md">Dashboard</button>
              <button onClick={handleLogout} className="bg-red-600 text-white px-4 py-2 rounded-md">Logout</button>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto py-10 px-6">

          {/* FILTERS */}
          <div className="flex flex-wrap gap-3 mb-6">
            <input
              placeholder="Search order or customer..."
              value={search}
              onChange={(e)=>setSearch(e.target.value)}
              className="border px-4 py-2 rounded w-64"
            />

            <select value={statusFilter} onChange={(e)=>setStatusFilter(e.target.value)} className="border px-4 py-2 rounded">
              <option value="all">All Status</option>
              <option value="submitted">Submitted</option>
              <option value="awaiting_payment">Awaiting Payment</option>
              <option value="purchased">Purchased</option>
              <option value="shipped">Shipped</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* TABLE */}
          <div className="bg-white rounded-xl shadow overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-6 py-4 text-left">Order</th>
                  <th className="px-6 py-4 text-left">Customer</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Payment</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredOrders.map(order => (
                  <tr key={order.id} className="border-t">
                    <td className="px-6 py-4 font-semibold">#{order.id}</td>
                    <td className="px-6 py-4">{order.user?.fullName}</td>
                    <td className="px-6 py-4 text-sm capitalize">
                      {order.orderType} {order.consolidationRequested && "📦"}
                    </td>

                    {/* PAYMENT TOGGLE */}
                    <td className="px-6 py-4">
                      <button
                        onClick={()=>togglePayment(order.id, order.paymentStatus)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          order.paymentStatus ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                        }`}
                      >
                        {order.paymentStatus ? 'PAID' : 'UNPAID'}
                      </button>
                    </td>

                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-xs rounded-full font-semibold ${getStatusColor(order.status)}`}>
                        {order.status.replace(/_/g,' ').toUpperCase()}
                      </span>
                    </td>

                    <td className="px-6 py-4 flex gap-3">
                      <button onClick={()=>router.push(`/order/${order.id}`)} className="text-sky-600 font-semibold">
                        View
                      </button>
                      <button onClick={()=>setSelectedOrder(order)} className="text-blue-600 font-semibold">
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>

        {/* MODAL */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
            <div className="bg-white p-6 rounded-xl w-full max-w-md">
              <h3 className="text-xl font-bold mb-4">Update Order #{selectedOrder.id}</h3>

              <select value={newStatus} onChange={(e)=>setNewStatus(e.target.value)} className="w-full border p-2 rounded mb-3">
                <option value="">Select new status</option>
                <option value="estimation_sent">Estimation Sent</option>
                <option value="awaiting_payment">Awaiting Payment</option>
                <option value="purchased">Purchased</option>
                <option value="received_at_warehouse">Received at Warehouse</option>
                <option value="packing">Packing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>

              <textarea value={message} onChange={(e)=>setMessage(e.target.value)} rows={2} className="w-full border p-2 rounded mb-4" placeholder="Optional note..." />

              <div className="flex gap-3">
                <button disabled={!newStatus} onClick={()=>updateOrderStatus(selectedOrder.id,newStatus)} className="flex-1 bg-blue-600 text-white py-2 rounded disabled:opacity-50">
                  Update
                </button>
                <button onClick={()=>setSelectedOrder(null)} className="flex-1 bg-gray-300 py-2 rounded">Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminGuard>
  );
}