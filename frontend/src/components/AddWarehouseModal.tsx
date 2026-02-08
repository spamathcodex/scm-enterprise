import React, { useState } from 'react';
import { X, Save } from 'lucide-react';
import api from '../api/axios';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AddWarehouseModal = ({ isOpen, onClose, onSuccess }: Props) => {
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    location: ''
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/inventory/warehouses', formData);
      alert("Gudang berhasil dibuat!");
      onSuccess();
      onClose();
      setFormData({ code: '', name: '', location: '' });
    } catch (error: any) {
      alert(error.response?.data?.message || "Gagal membuat gudang");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Tambah Gudang Baru</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Kode Gudang</label>
            <input 
              type="text" required placeholder="CON: WH-JKT-01"
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              value={formData.code}
              onChange={(e) => setFormData({...formData, code: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Nama Gudang</label>
            <input 
              type="text" required placeholder="Gudang Pusat Jakarta"
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Lokasi</label>
            <textarea 
              required placeholder="Alamat lengkap..."
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
            />
          </div>
          
          <button 
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition flex justify-center items-center gap-2"
          >
            <Save size={18} /> Simpan Gudang
          </button>
        </form>
      </div>
    </div>
  );
};