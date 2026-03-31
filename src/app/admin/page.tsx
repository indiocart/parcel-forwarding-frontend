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
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState('');
  const [message, setMessage] = useState('');

  const fetchOrders = async () => {
    try {
      const response = await api.get('/admin/orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Failed to fetch orders', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateOrderStatus = async (orderId: number, status: string) => {
    try {
      await api.put(`/admin/orders/${orderId}/status`, { status, message });
      fetchOrders();
      setSelectedOrder(null);
      setMessage('');
      setNewStatus('');
    } catch (error) {
      console.error('Failed to update status', error);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      draft: 'bg-gray-200 text-gray-800',
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

  const handleLogout = () => {
    authService.logout();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-2xl">
        Loading Admin Panel...
      </div>
    );
  }

  return (
    <AdminGuard>
      <div className="min-h-screen bg-gray-50">

        {/* NAVBAR */}
        <nav className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-purple-600">
              IndioCart Admin
            </h1>

            <div className="flex gap-3">
              <button
                onClick={() => router.push('/dashboard')}
                className="bg-sky-500 text-white px-4 py-2 rounded-md text-sm hover:bg-sky-600"
              >
                Dashboard
              </button>

              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto py-10 px-6">
          <div className="bg-white rounded-xl shadow overflow-hidden">

            <div className="px-8 py-6 border-b">
              <h2 className="text-3xl font-bold">All Orders</h2>
              <p className="text-gray-500 mt-1">Total Orders: {orders.length}</p>
            </div>

            {orders.length === 0 ? (
              <div className="p-10 text-center text-gray-500">
                No orders yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                    <tr>
                      <th className="px-8 py-4 text-left">Order</th>
                      <th className="px-8 py-4 text-left">Customer</th>
                      <th className="px-8 py-4 text-left">Date</th>
                      <th className="px-8 py-4 text-left">Status</th>
                      <th className="px-8 py-4 text-left">Items</th>
                      <th className="px-8 py-4 text-left">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id} className="border-t hover:bg-gray-50">
                        <td className="px-8 py-4 font-semibold">#{order.id}</td>
                        <td className="px-8 py-4">{order.user?.fullName || `User ${order.userId}`}</td>
                        <td className="px-8 py-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td className="px-8 py-4">
                          <span className={`px-3 py-1 text-xs rounded-full font-semibold ${getStatusColor(order.status)}`}>
                            {order.status.replace(/_/g, ' ').toUpperCase()}
                          </span>
                        </td>
                        <td className="px-8 py-4">{order.items?.length || 0}</td>
                        <td className="px-8 py-4">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="text-blue-600 font-semibold hover:text-blue-800"
                          >
                            Manage →
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>

        {/* MODAL */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">

              <h3 className="text-xl font-bold mb-4">
                Manage Order #{selectedOrder.id}
              </h3>

              <p className="text-sm mb-2">Customer: {selectedOrder.user?.fullName}</p>

              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full border p-2 rounded mb-3"
              >
                <option value="">Select new status</option>
                <option value="submitted">Submitted</option>
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

              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={2}
                className="w-full border p-2 rounded mb-4"
                placeholder="Optional note..."
              />

              <div className="flex gap-3">
                <button
                  onClick={() => updateOrderStatus(selectedOrder.id, newStatus)}
                  disabled={!newStatus}
                  className="flex-1 bg-blue-600 text-white py-2 rounded disabled:opacity-50"
                >
                  Update
                </button>

                <button
                  onClick={() => setSelectedOrder(null)}
                  className="flex-1 bg-gray-300 py-2 rounded"
                >
                  Cancel
                </button>
              </div>

            </div>
          </div>
        )}
      </div>
    </AdminGuard>
  );
}