import { useEffect, useState } from 'react';
import api from '../api/axios';
import { Plus, Truck, Phone, MapPin, Building2 } from 'lucide-react'; // Tambah Building2 untuk icon empty state

export const Suppliers = () => {
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  
  // State Form
  const [form, setForm] = useState({ code: '', name: '', phone: '', address: '' });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    api.get('/suppliers').then(res => setSuppliers(res.data.data));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/suppliers', form);
      setIsOpen(false);
      loadData(); // Refresh list
      setForm({ code: '', name: '', phone: '', address: '' });
    } catch (err) {
      alert("Gagal simpan supplier");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Data Supplier</h1>
        <button onClick={() => setIsOpen(true)} className="bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-emerald-700 transition">
          <Plus size={20} /> Tambah Supplier
        </button>
      </div>

      {/* Logic Empty State vs Grid Data */}
      {!suppliers || suppliers.length === 0 ? (
        // Tampilan Jika Kosong
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-16 text-center flex flex-col items-center justify-center">
          <div className="bg-emerald-50 p-5 rounded-full mb-4">
            <Building2 size={48} className="text-emerald-500" />
          </div>
          <p className="text-xl font-medium text-gray-800">Belum Ada Data Supplier 🏢</p>
          <p className="text-sm text-gray-500 mt-2 max-w-md mx-auto">
            Data pemasok barang masih kosong. Silakan klik tombol <span className="font-semibold text-emerald-600">"Tambah Supplier"</span> di sudut kanan atas untuk mulai mendata partner bisnismu.
          </p>
        </div>
      ) : (
        // Tampilan Jika Ada