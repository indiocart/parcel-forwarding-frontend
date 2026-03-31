'use client';

import { useState } from 'react';
import api from '@/services/api';
import FileUpload from './FileUpload';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface OrderItem {
  productName: string;
  productUrl?: string;
  size?: string;
  color?: string;
  quantity: number;
  notes?: string;
  estimatedPrice?: number;
  screenshotUrl?: string;
}

interface OrderFormProps {
  onOrderCreated?: () => void;
}

export default function OrderForm({ onOrderCreated }: OrderFormProps) {
  const [orderType, setOrderType] = useState<'online' | 'offline'>('online');
  const [consolidation, setConsolidation] = useState(true);
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<OrderItem[]>([
    { productName: '', quantity: 1 }
  ]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const addItem = () => {
    setItems([...items, { productName: '', quantity: 1 }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof OrderItem, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const handleUploadComplete = (index: number, url: string) => {
    updateItem(index, 'screenshotUrl', url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Create order first
      const orderResponse = await api.post('/orders', {
        orderType,
        consolidationRequested: consolidation,
        notes,
      });

      const orderId = orderResponse.data.id;

      // Add all items with screenshotUrl
      for (const item of items) {
        if (item.productName.trim()) {
          const itemData = { 
            productName: item.productName,
            productUrl: item.productUrl,
            size: item.size,
            color: item.color,
            quantity: item.quantity,
            notes: item.notes,
            estimatedPrice: item.estimatedPrice,
            screenshotUrl: item.screenshotUrl
          };
          await api.post(`/orders/${orderId}/items`, itemData);
        }
      }

      // Submit order
      await api.put(`/orders/${orderId}/submit`);

      setSuccess('Order created successfully!');
      
      // Reset form
      setItems([{ productName: '', quantity: 1 }]);
      setNotes('');
      
      // Notify parent to refresh orders
      if (onOrderCreated) {
        onOrderCreated();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-6">Create New Purchase Request</h2>

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Order Type */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Order Type
          </label>
          <div className="flex space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                value="online"
                checked={orderType === 'online'}
                onChange={() => setOrderType('online')}
                className="mr-2"
              />
              Online Purchase (URL)
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                value="offline"
                checked={orderType === 'offline'}
                onChange={() => setOrderType('offline')}
                className="mr-2"
              />
              Offline Purchase (Screenshot)
            </label>
          </div>
        </div>

        {/* Consolidation */}
        <div className="mb-6">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={consolidation}
              onChange={(e) => setConsolidation(e.target.checked)}
              className="mr-2"
            />
            Combine multiple orders into one shipment (Consolidation)
          </label>
        </div>

        {/* Notes */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Order Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Any special instructions..."
          />
        </div>

        {/* Items */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Items</h3>
            <button
              type="button"
              onClick={addItem}
              className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700"
            >
              + Add Item
            </button>
          </div>

          {items.map((item, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
              <div className="flex justify-between mb-3">
                <h4 className="font-medium">Item {index + 1}</h4>
                {items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="text-red-600 text-sm hover:text-red-800"
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    value={item.productName}
                    onChange={(e) => updateItem(index, 'productName', e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {orderType === 'online' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Product URL
                    </label>
                    <input
                      type="url"
                      value={item.productUrl || ''}
                      onChange={(e) => updateItem(index, 'productUrl', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="https://..."
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value))}
                    min="1"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Size
                  </label>
                  <input
                    type="text"
                    value={item.size || ''}
                    onChange={(e) => updateItem(index, 'size', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Color
                  </label>
                  <input
                    type="text"
                    value={item.color || ''}
                    onChange={(e) => updateItem(index, 'color', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estimated Price (INR)
                  </label>
                  <input
                    type="number"
                    value={item.estimatedPrice || ''}
                    onChange={(e) => updateItem(index, 'estimatedPrice', parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Item Notes
                  </label>
                  <input
                    type="text"
                    value={item.notes || ''}
                    onChange={(e) => updateItem(index, 'notes', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Any specific instructions for this item..."
                  />
                </div>

                {/* File Upload for Offline Orders */}
                {orderType === 'offline' && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Product Screenshot/Photo
                    </label>
                    <FileUpload
                      onUploadComplete={(url) => handleUploadComplete(index, url)}
                      buttonText={item.screenshotUrl ? 'Change Image' : 'Upload Product Photo'}
                    />
                    {item.screenshotUrl && (
                      <div className="mt-2">
                        <img 
                          src={`${API_BASE_URL}${item.screenshotUrl}`} 
                          alt="Product" 
                          className="h-20 w-20 object-cover rounded border"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/images/placeholder.png';
                          }}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
        >
          {loading ? 'Creating Order...' : 'Submit Order Request'}
        </button>
      </form>
    </div>
  );
}