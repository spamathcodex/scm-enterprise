import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Plus, Users, Phone, MapPin } from 'lucide-react'; // Icon Users

export const Customers = () => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({ code: '', name: '', phone: '', address: '' });

  useEffect(() => { loadData(); }, []);

  const loadData = () => {
    api.get('/customers').then(res => setCustomers(res.data.data));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/customers', form);
      setIsOpen(false);
      loadData();
      setForm({ code: '', name: '', phone: '', address: '' });
    } catch (err) { alert("Gagal simpan customer"); }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Data Pelanggan (Customer)</h1>
        <button onClick={() => setIsOpen(true)} className="bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-orange-700">
          <Plus size={20} /> Tambah Customer
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {customers.map((cust) => (
          <div key={cust.id} className="bg-white p-6 rounded-xl shadow-sm border border-orange-100 hover:shadow-md transition">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-orange-100 text-orange-600 rounded-full"><Users size={24} /></div>
              <div>
                <h3 className="font-bold text-gray-800">{cust.name}</h3>
                <p className="text-xs font-mono text-gray-500">{cust.code}</p>
              </div>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <p className="flex gap-2"><Phone size={16} /> {cust.phone || '-'}</p>
              <p className="flex gap-2"><MapPin size={16} /> {cust.address || '-'}</p>
            </div>
          </div>
        ))}
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-bold mb-4">Pelanggan Baru</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input required placeholder="Kode (CUST-001)" className="w-full border p-2 rounded" 
                value={form.code} onChange={e => setForm({...form, code: e.target.value})} />
              <input required placeholder="Nama Pelanggan / PT" className="w-full border p-2 rounded"
                value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
              <input placeholder="No HP/WA" className="w-full border p-2 rounded"
                value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
              <textarea placeholder="Alamat Kirim" className="w-full border p-2 rounded"
                value={form.address} onChange={e => setForm({...form, address: e.target.value})} />
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setIsOpen(false)} className="flex-1 bg-gray-200 py-2 rounded">Batal</button>
                <button type="submit" className="flex-1 bg-orange-600 text-white py-2 rounded">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};