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
      {/* Navbar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">IndioCart Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user?.fullName}</span>
              <span className="text-xs text-gray-400 ml-2">
  (Admin: {user?.isAdmin ? 'Yes' : 'No'})
</span>
              {/* Admin Button - Only shows if user is admin */}
              {user?.isAdmin === true && (
                <button
                  onClick={() => router.push('/admin')}
                  className="bg-purple-600 text-white px-4 py-2 rounded-md text-sm hover:bg-purple-700"
                >
                  Admin Panel
                </button>
              )}
              
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('create')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'create'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Create Order
            </button>
            <button
              onClick={() => {
                setActiveTab('orders');
                fetchOrders();
              }}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'orders'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              My Orders ({orders.length})
            </button>
            <button
              onClick={() => {
                setActiveTab('addresses');
                fetchAddresses();
              }}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'addresses'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Addresses ({addresses.length})
            </button>
          </nav>
        </div>

        {/* Create Order Tab */}
        {activeTab === 'create' && (
          <OrderForm onOrderCreated={handleOrderCreated} />
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-6">My Orders</h2>
            {orders.length === 0 ? (
              <p className="text-gray-500">No orders yet. Create your first order!</p>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold">Order #{order.id}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-sm mt-1">
                          Status: <span className="font-medium">{order.status?.replace(/_/g, ' ').toUpperCase() || 'Unknown'}</span>
                        </p>
                        <p className="text-sm">
                          Items: {order.items?.length || 0}
                        </p>
                      </div>
                      <button
                        onClick={() => router.push(`/orders/${order.id}`)}
                        className="text-blue-600 hover:text-blue-800 text-sm"
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

        {/* Addresses Tab */}
        {activeTab === 'addresses' && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">My Addresses</h2>
              {!showAddressForm && (
                <button
                  onClick={handleAddAddress}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700"
                >
                  + Add New Address
                </button>
              )}
            </div>

            {showAddressForm ? (
              <div className="border border-gray-200 rounded-lg p-6 mb-6">
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