'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/services/api';
import { authService } from '@/services/auth.service';

interface Order {
  id: number;
  status: string;
  orderType: string;
  consolidationRequested: boolean;
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
      .finally(() => {
        setLoading(false);
      });
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
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

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/dashboard" className="text-blue-600 hover:text-blue-800">
                ← Back to Dashboard
              </Link>
              <h1 className="ml-4 text-xl font-bold text-gray-900">Order #{order.id}</h1>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {/* Order Status */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Order Status</h2>
            <div className="inline-flex px-3 py-1 rounded-full text-sm font-medium mb-4">
              <span className={`px-3 py-1 rounded-full ${getStatusColor(order.status)}`}>
                {order.status.replace(/_/g, ' ').toUpperCase()}
              </span>
            </div>
            {order.notes && (
              <p className="text-gray-600 mt-2">
                <strong>Notes:</strong> {order.notes}
              </p>
            )}
          </div>

          {/* Items */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Items</h2>
            <div className="space-y-4">
              {order.items.map((item, idx) => (
                <div key={idx} className="border-b border-gray-200 pb-4 last:border-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{item.productName}</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2 text-sm text-gray-600">
                        <p>Quantity: {item.quantity}</p>
                        {item.size && <p>Size: {item.size}</p>}
                        {item.color && <p>Color: {item.color}</p>}
                        {item.estimatedPrice && <p>Est. Price: ₹{item.estimatedPrice}</p>}
                      </div>
                      {item.productUrl && (
                        <a href={item.productUrl} target="_blank" rel="noopener noreferrer" 
                           className="text-blue-600 text-sm hover:underline block mt-2">
                          View Product →
                        </a>
                      )}
                    </div>
                  </div>
                  {/* Display screenshot if available */}
                  {item.screenshotUrl && (
                    <div className="mt-3">
                      <p className="text-sm text-gray-600 mb-1">Product Screenshot:</p>
                      <img 
                        src={`http://localhost:3001${item.screenshotUrl}`} 
                        alt={item.productName}
                        className="h-32 w-32 object-cover rounded border shadow-sm"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Timeline */}
          {timeline.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Order Timeline</h2>
              <div className="space-y-4">
                {timeline.map((log, idx) => (
                  <div key={idx} className="flex items-start space-x-3">
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
        </div>
      </main>
    </div>
  );
}