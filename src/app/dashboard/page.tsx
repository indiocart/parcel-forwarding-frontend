'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth.service';
import api from '@/services/api';
import { addressService } from '@/services/address.service';
import { Address } from '@/types/address';
import OrderForm from '@/components/OrderForm';
import AddressForm from '@/components/AddressForm';
import AddressList from '@/components/AddressList';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'create' | 'orders' | 'addresses'>('create');
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [showAddressForm, setShowAddressForm] = useState(false);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Failed to fetch orders', error);
    }
  };

  const fetchAddresses = async () => {
    try {
      const response = await addressService.getAllAddresses();
      setAddresses(response);
    } catch (error) {
      console.error('Failed to fetch addresses', error);
    }
  };

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      router.push('/login');
      return;
    }

    Promise.all([
      api.get('/users/profile'),
      api.get('/orders'),
      addressService.getAllAddresses()
    ])
      .then(([profileRes, ordersRes, addressesRes]) => {
        setUser(profileRes.data.user);
        setOrders(ordersRes.data);
        setAddresses(addressesRes);
      })
      .catch(() => {
        authService.logout();
      })
      .finally(() => {
        setLoading(false);
      });
  }, [router]);

  const handleOrderCreated = () => {
    setActiveTab('orders');
    fetchOrders();
  };

  const handleAddressChange = () => {
    fetchAddresses();
    setShowAddressForm(false);
    setEditingAddress(null);
  };

  const handleAddAddress = () => {
    setEditingAddress(null);
    setShowAddressForm(true);
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    setShowAddressForm(true);
  };

  const handleSaveAddress = async (addressData: any) => {
    if (editingAddress) {
      await addressService.updateAddress(editingAddress.id, addressData);
    } else {
      await addressService.createAddress(addressData);
    }
    handleAddressChange();
  };

  const handleLogout = () => {
    authService.logout();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* 🌟 Modern Navbar */}
      <nav className="bg-white/80 backdrop-blur sticky top-0 z-50 border-b">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-extrabold text-sky-500">IndioCart</h1>

            <div className="flex items-center gap-6">
              <span className="text-gray-600">
                Welcome, <span className="font-semibold">{user?.fullName}</span>
              </span>

              {user?.isAdmin === true && (
                <button
                  onClick={() => router.push('/admin')}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-700"
                >
                  Admin Panel
                </button>
              )}

              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-10 px-6">

        {/* 🌟 Pill Tabs */}
        <div className="mb-10">
          <div className="flex gap-4 bg-white p-2 rounded-xl shadow w-fit">
            
            <button
              onClick={() => setActiveTab('create')}
              className={`px-6 py-2 rounded-lg font-medium transition ${
                activeTab === 'create'
                  ? 'bg-sky-500 text-white shadow'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Create Order
            </button>

            <button
              onClick={() => {
                setActiveTab('orders');
                fetchOrders();
              }}
              className={`px-6 py-2 rounded-lg font-medium transition ${
                activeTab === 'orders'
                  ? 'bg-sky-500 text-white shadow'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              My Orders ({orders.length})
            </button>

            <button
              onClick={() => {
                setActiveTab('addresses');
                fetchAddresses();
              }}
              className={`px-6 py-2 rounded-lg font-medium transition ${
                activeTab === 'addresses'
                  ? 'bg-sky-500 text-white shadow'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Addresses ({addresses.length})
            </button>

          </div>
        </div>

        {/* Create Order */}
        {activeTab === 'create' && (
          <OrderForm onOrderCreated={handleOrderCreated} />
        )}

        {/* Orders */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-2xl shadow-sm border p-8">
            <h2 className="text-2xl font-bold mb-6">My Orders</h2>

            {orders.length === 0 ? (
              <p className="text-gray-500">No orders yet. Create your first order!</p>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="border rounded-xl p-4 hover:shadow transition">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold">Order #{order.id}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-sm mt-1">
                          Status: <span className="font-medium">{order.status?.replace(/_/g, ' ').toUpperCase() || 'Unknown'}</span>
                        </p>
                        <p className="text-sm">Items: {order.items?.length || 0}</p>
                      </div>
                      <button
                        onClick={() => router.push(`/orders/${order.id}`)}
                        className="text-sky-600 hover:text-sky-800 text-sm font-medium"
                      >
                        View Details →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Addresses */}
        {activeTab === 'addresses' && (
          <div className="bg-white rounded-2xl shadow-sm border p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">My Addresses</h2>
              {!showAddressForm && (
                <button
                  onClick={handleAddAddress}
                  className="bg-sky-500 text-white px-4 py-2 rounded-lg hover:bg-sky-600"
                >
                  + Add New Address
                </button>
              )}
            </div>

            {showAddressForm ? (
              <div className="border rounded-xl p-6 mb-6">
                <AddressForm
                  initialData={editingAddress || undefined}
                  onSubmit={handleSaveAddress}
                  onCancel={() => {
                    setShowAddressForm(false);
                    setEditingAddress(null);
                  }}
                  title={editingAddress ? 'Edit Address' : 'Add New Address'}
                />
              </div>
            ) : (
              <AddressList
                addresses={addresses}
                onAddressChange={handleAddressChange}
                onEdit={handleEditAddress}
              />
            )}
          </div>
        )}

      </main>
    </div>
  );
}