'use client';

import { Address } from '@/types/address';
import { addressService } from '@/services/address.service';

interface AddressListProps {
  addresses: Address[];
  onAddressChange: () => void;
  onEdit: (address: Address) => void;
}

export default function AddressList({ addresses, onAddressChange, onEdit }: AddressListProps) {
  const handleSetDefault = async (id: number) => {
    try {
      await addressService.setDefaultAddress(id);
      // Force refresh by calling onAddressChange
      await onAddressChange();
    } catch (error) {
      console.error('Failed to set default', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this address?')) {
      try {
        await addressService.deleteAddress(id);
        await onAddressChange();
      } catch (error) {
        console.error('Failed to delete', error);
      }
    }
  };

  if (addresses.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No addresses saved yet. Add your first address below.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {addresses.map((address) => (
        <div
          key={address.id}
          className={`border rounded-lg p-4 ${address.isDefault ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
        >
          <div className="flex justify-between items-start">
            <div>
              {address.isDefault && (
                <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mb-2">
                  Default
                </span>
              )}
              <p className="font-medium">{address.fullName}</p>
              <p className="text-gray-600">{address.phone}</p>
              <p className="text-gray-600">{address.street}</p>
              <p className="text-gray-600">
                {address.city}, {address.state} {address.postalCode}
              </p>
              <p className="text-gray-600">{address.country}</p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => onEdit(address)}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                Edit
              </button>
              {!address.isDefault && (
                <button
                  onClick={() => handleSetDefault(address.id)}
                  className="text-green-600 hover:text-green-800 text-sm"
                >
                  Set Default
                </button>
              )}
              <button
                onClick={() => handleDelete(address.id)}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}