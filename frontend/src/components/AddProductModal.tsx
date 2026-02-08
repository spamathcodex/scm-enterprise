import React, { useState } from 'react';
import { X } from 'lucide-react';
import api from '../api/axios';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AddProductModal = ({ isOpen, onClose, onSuccess }: Props) => {
  const [formData, setFormData] = useState({
    sku: '',
    name: '',
    price: 0,
    minStock: 5
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/products', formData);
      onSuccess(); // Refresh tabel
      onClose();   // Tutup modal
      setFormData({ sku: '', name: '', price: 0, minStock: 5 }); // Reset
    } catch (error: any) {
      alert(error.response?.data?.message || "Gagal menambah produk");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Tambah Produk Baru</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">SKU (Kode Barang)</label>
            <input 
              type="text" required
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              value={formData.sku}
              onChange={(e) => setFormData({...formData, sku: e.target.value})}
              placeholder="CON: LAP-001"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Nama Produk</label>
            <input 
              type="text" required
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Harga (Rp)</label>
              <input 
                type="number" required
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Min. Stok</label>
              <input 
                type="number" required
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                value={formData.minStock}
                onChange={(e) => setFormData({...formData, minStock: Number(e.target.value)})}
              />
            </div>
          </div>
          
          <button 
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition"
          >
            Simpan Produk
          </button>
        </form>
      </div>
    </div>
  );
};