import api from './api';

export interface AddressData {
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
}

export const addressService = {
  async getAllAddresses() {
    const response = await api.get('/address');
    return response.data;
  },

  async createAddress(data: AddressData) {
    const response = await api.post('/address', data);
    return response.data;
  },

  async updateAddress(id: number, data: Partial<AddressData>) {
    const response = await api.put(`/address/${id}`, data);
    return response.data;
  },

  async deleteAddress(id: number) {
    const response = await api.delete(`/address/${id}`);
    return response.data;
  },

  async setDefaultAddress(id: number) {
    const response = await api.put(`/address/${id}/default`);
    return response.data;
  },
};