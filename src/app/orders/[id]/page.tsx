'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/services/api';
import { authService } from '@/services/auth.service';

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

interface Order {
  id: number;
  status: string;
  orderType: string;
  consolidationRequested: boolean;
  paymentStatus: boolean;
  notes: string;
  createdAt: string;
  items: any[];
  statusLogs?: any[];
}

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [timeline, setTimeline] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const ORDER_STEPS = [
    'submitted',
    'estimation_sent',
    'awaiting_payment',
    'purchased',
    'received_at_warehouse',
    'packing',
    'shipped',
    'delivered',
    'completed'
  ];

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      router.push('/login');
      return;
    }

    const orderId = params.id;
    
    Promise.all([
      api.get(`/orders/${orderId}`),
      api.get(`/orders/${orderId}/timeline`)
    ])
      .then(([orderRes, timelineRes]) => {
        setOrder(orderRes.data);
        setTimeline(timelineRes.data);
      })
      .catch((err) => {
        setError(err.response?.data?.message || 'Failed to load order');
      })
      .finally(() => setLoading(false));
  }, [params.id, router]);

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

  const getStepIndex = (status: string) => {
    return ORDER_STEPS.indexOf(status);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl">
        Loading order...
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error || 'Order not found'}
        </div>
      </div>
    );
  }

  const currentStep = getStepIndex(order.status);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 flex items-center h-16">
          <Link href="/dashboard" className="text-blue-600 hover:text-blue-800">
            ← Back to Dashboard
          </Link>
          <h1 className="ml-4 text-xl font-bold">Order #{order.id}</h1>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto py-8 px-4 space-y-8">

        {/* ORDER PROGRESS TRACKER */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="font-semibold text-lg mb-6">Order Progress</h2>
          <div className="flex flex-wrap gap-3">
            {ORDER_STEPS.map((step, index) => (
              <div
                key={step}
                className={`px-3 py-2 rounded-full text-xs font-semibold
                  ${index <= currentStep ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'}`}
              >
                {step.replace(/_/g, ' ').toUpperCase()}
              </div>
            ))}
          </div>
        </div>

        {/* ORDER SUMMARY */}
        <div className="bg-white p-6 rounded-lg shadow grid md:grid-cols-3 gap-6">
          <div>
            <h3 className="font-semibold mb-2">Status</h3>
            <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(order.status)}`}>
              {order.status.replace(/_/g, ' ').toUpperCase()}
            </span>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Payment</h3>
            <span className={`px-3 py-1 rounded-full text-sm ${order.paymentStatus ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
              {order.paymentStatus ? 'PAID' : 'PENDING'}
            </span>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Order Type</h3>
            <p className="text-gray-600 capitalize">{order.orderType}</p>
            {order.consolidationRequested && (
              <p className="text-sm text-blue-600 mt-1">Consolidation Requested</p>
            )}
          </div>
        </div>

        {/* ITEMS */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Items</h2>

          {order.items.length === 0 && (
            <p className="text-gray-500">No items found.</p>
          )}

          <div className="space-y-6">
            {order.items.map((item, idx) => (
              <div key={idx} className="border-b pb-5 last:border-0">
                <p className="font-semibold">{item.productName}</p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2 text-sm text-gray-600">
                  <p>Qty: {item.quantity}</p>
                  {item.size && <p>Size: {item.size}</p>}
                  {item.color && <p>Color: {item.color}</p>}
                  {item.estimatedPrice && <p>₹{item.estimatedPrice}</p>}
                </div>

                {item.productUrl && (
                  <a href={item.productUrl} target="_blank"
                    className="text-blue-600 text-sm hover:underline block mt-2">
                    View Product →
                  </a>
                )}

                {item.screenshotUrl && (
                  <img
                    src={`${API_BASE}${item.screenshotUrl}`}
                    alt="product"
                    className="mt-3 h-32 rounded border shadow"
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* TIMELINE */}
        {timeline.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Order Timeline</h2>

            <div className="space-y-4">
              {timeline.map((log, idx) => (
                <div key={idx} className="flex space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium">{log.status.replace(/_/g, ' ').toUpperCase()}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(log.timestamp).toLocaleString()}
                    </p>
                    {log.message && (
                      <p className="text-sm text-gray-600 mt-1">{log.message}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}