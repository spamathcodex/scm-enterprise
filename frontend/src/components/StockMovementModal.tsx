import React, { useState, useEffect } from 'react';
import { X, ArrowRight, ArrowLeft } from 'lucide-react';
import api from '../api/axios';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const StockMovementModal = ({ isOpen, onClose, onSuccess }: Props) => {
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]); // State Supplier
  const [customers, setCustomers] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    warehouseId: '',
    productId: '',
    supplierId: '', // Field Supplier
    customerId: '',
    amount: 0,
    type: 'IN',
    reason: ''
  });

  useEffect(() => {
    if (isOpen) {
      api.get('/inventory/warehouses').then(res => setWarehouses(res.data.data));
      api.get('/products?limit=100').then(res => setProducts(res.data.data));
      api.get('/suppliers').then(res => setSuppliers(res.data.data)); // Ambil 
      api.get('/customers').then(res => setCustomers(res.data.data));
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/inventory/movements', {
        ...formData,
        warehouseId: Number(formData.warehouseId),
        productId: Number(formData.productId),
        amount: Number(formData.amount),
        // Kirim supplierId jika IN, kalau tidak null
        supplierId: formData.type === 'IN' && formData.supplierId ? Number(formData.supplierId) : null,
        // Kirim customerId hanya jika OUT
        customerId: formData.type === 'OUT' && formData.customerId ? Number(formData.customerId) : null
      });
      alert("Transaksi Berhasil!");
      onSuccess();
      onClose();
    } catch (error: any) {
      alert(error.response?.data?.message || "Gagal mencatat transaksi");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Catat Mutasi Stok</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-lg">
            <button
              type="button" onClick={() => setFormData({...formData, type: 'IN'})}
              className={`flex items-center justify-center gap-2 py-2 rounded-md font-bold transition ${formData.type === 'IN' ? 'bg-green-500 text-white' : 'text-gray-500'}`}
            >
              <ArrowRight size={18} /> Masuk (Beli)
            </button>
            <button
              type="button" onClick={() => setFormData({...formData, type: 'OUT'})}
              className={`flex items-center justify-center gap-2 py-2 rounded-md font-bold transition ${formData.type === 'OUT' ? 'bg-red-500 text-white' : 'text-gray-500'}`}
            >
              <ArrowLeft size={18} /> Keluar (Jual)
            </button>
          </div>

          {/* INPUT KHUSUS JIKA BARANG MASUK: PILIH SUPPLIER */}
          {formData.type === 'IN' && (
            <div className="bg-green-50 p-3 rounded-lg border border-green-100">
              <label className="block text-sm font-medium text-green-800 mb-1">Supplier (Penyedia Barang)</label>
              <select 
                required
                className="block w-full border border-green-300 rounded-md p-2 bg-white"
                value={formData.supplierId}
                onChange={(e) => setFormData({...formData, supplierId: e.target.value})}
              >
                <option value="">-- Pilih Supplier --</option>
                {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
          )}

          {formData.type === 'OUT' && (
            <div className="bg-red-50 p-3 rounded-lg border border-red-100">
              <label className="block text-sm font-medium text-red-800 mb-1">Customer (Tujuan Barang)</label>
              <select 
                required
                className="block w-full border border-red-300 rounded-md p-2 bg-white"
                value={formData.customerId}
                onChange={(e) => setFormData({...formData, customerId: e.target.value})}
              >
                <option value="">-- Pilih Customer --</option>
                {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">Pilih Gudang</label>
            <select 
              required className="mt-1 block w-full border border-gray-300 rounded-md p-2 bg-white"
              value={formData.warehouseId}
              onChange={(e) => setFormData({...formData, warehouseId: e.target.value})}
            >
              <option value="">-- Pilih Gudang --</option>
              {warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Pilih Produk</label>
            <select 
              required className="mt-1 block w-full border border-gray-300 rounded-md p-2 bg-white"
              value={formData.productId}
              onChange={(e) => setFormData({...formData, productId: e.target.value})}
            >
              <option value="">-- Pilih Produk --</option>
              {products.map(p => <option key={p.id} value={p.id}>{p.sku} - {p.name}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Jumlah</label>
              <input 
                type="number" min="1" required
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: Number(e.target.value)})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Ref / Catatan</label>
              <input 
                type="text" required
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                placeholder="CON: PO-001"
                value={formData.reason}
                onChange={(e) => setFormData({...formData, reason: e.target.value})}
              />
            </div>
          </div>

          <button 
            type="submit"
            className={`w-full py-3 rounded-lg font-bold text-white transition ${
              formData.type === 'IN' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            {formData.type === 'IN' ? 'Terima Barang' : 'Keluarkan Barang'}
          </button>
        </form>
      </div>
    </div>
  );
};