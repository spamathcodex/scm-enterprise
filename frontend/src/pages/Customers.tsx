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
        // Tampilan Jika Ada Data (Grid Card)
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {suppliers.map((sup) => (
            <div key={sup.id} className="bg-white p-6 rounded-xl shadow-sm border border-emerald-100 hover:shadow-md transition">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-emerald-100 text-emerald-600 rounded-full">
                  <Truck size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">{sup.name}</h3>
                  <p className="text-xs font-mono text-gray-500">{sup.code}</p>
                </div>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Phone size={16} /> {sup.phone || '-'}
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={16} /> {sup.address || '-'}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Sederhana (Inline) */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Input Supplier Baru</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input required placeholder="Kode (SUP-001)" className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" 
                value={form.code} onChange={e => setForm({...form, code: e.target.value})} />
              <input required placeholder="Nama PT/CV" className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
              <input placeholder="No Telp" className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
              <textarea placeholder="Alamat Lengkap" className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" rows={3}
                value={form.address} onChange={e => setForm({...form, address: e.target.value})} />
              
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setIsOpen(false)} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-lg font-medium transition">Batal</button>
                <button type="submit" className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-lg font-medium transition">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};