import { useEffect, useState } from 'react';
import api from '../api/axios';
import { Plus, Package, Tag, AlertCircle } from 'lucide-react';

export const Products = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  
  // State Form sekarang memiliki harga dan min stock
  const [form, setForm] = useState({ 
    sku: '', 
    name: '', 
    description: '',
    costPrice: '', // Pakai string dulu biar gampang diketik di input
    sellingPrice: '',
    minStock: ''
  });

  useEffect(() => { loadData(); }, []);

  const loadData = () => {
    api.get('/products').then(res => setProducts(res.data.data));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Pastikan data angka dikonversi menjadi Number sebelum dikirim ke Backend
      const payload = {
        ...form,
        costPrice: Number(form.costPrice),
        sellingPrice: Number(form.sellingPrice),
        minStock: Number(form.minStock)
      };

      await api.post('/products', payload);
      setIsOpen(false);
      loadData();
      setForm({ sku: '', name: '', description: '', costPrice: '', sellingPrice: '', minStock: '' });
    } catch (err) { 
      alert("Gagal simpan produk. Cek console untuk detail."); 
      console.error(err);
    }
  };

  // Fungsi format rupiah
  const formatRp = (angka: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka || 0);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Master Data Produk</h1>
        <button onClick={() => setIsOpen(true)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700 transition shadow-sm">
          <Plus size={20} /> Tambah Produk
        </button>
      </div>

      {/* Logic Empty State vs Grid Data */}
      {!products || products.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-16 text-center flex flex-col items-center justify-center">
          <div className="bg-indigo-50 p-5 rounded-full mb-4">
            <Package size={48} className="text-indigo-500" />
          </div>
          <p className="text-xl font-medium text-gray-800">Belum Ada Data Produk 📦</p>
          <p className="text-sm text-gray-500 mt-2 max-w-md mx-auto">
            Katalog barang Anda masih kosong. Silakan klik tombol <span className="font-semibold text-indigo-600">"Tambah Produk"</span> untuk mulai memasukkan daftar barang beserta harganya.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((prod) => (
            <div key={prod.id} className="bg-white p-6 rounded-xl shadow-sm border border-indigo-100 hover:shadow-md transition flex flex-col h-full">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
                  <Package size={24} />
                </div>
                <span className="text-xs font-mono bg-gray-100 text-gray-600 px-2 py-1 rounded">
                  {prod.sku}
                </span>
              </div>
              
              <div className="flex-grow">
                <h3 className="font-bold text-gray-800 text-lg leading-tight mb-1">{prod.name}</h3>
                <p className="text-xs text-gray-500 line-clamp-2 mb-4">{prod.description || 'Tidak ada deskripsi'}</p>
              </div>

              <div className="space-y-2 pt-4 border-t border-gray-100">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 flex items-center gap-1"><Tag size={14}/> Modal</span>
                  <span className="font-medium text-gray-700">{formatRp(prod.costPrice)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 flex items-center gap-1"><Tag size={14}/> Jual</span>
                  <span className="font-bold text-indigo-700">{formatRp(prod.sellingPrice)}</span>
                </div>
                <div className="flex justify-between items-center text-sm mt-2 pt-2 border-t border-dashed border-gray-200">
                  <span className="text-gray-500 flex items-center gap-1"><AlertCircle size={14}/> Min. Stok</span>
                  <span className="font-bold text-red-500">{prod.minStock} unit</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Input */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-lg shadow-2xl">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Input Produk Baru</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">SKU (Kode Barang)</label>
                  <input required placeholder="Contoh: LPT-001" className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                    value={form.sku} onChange={e => setForm({...form, sku: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Nama Produk</label>
                  <input required placeholder="Contoh: Laptop Surface" className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Deskripsi</label>
                <textarea placeholder="Spesifikasi singkat..." className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" rows={2}
                  value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
              </div>

              {/* Input Harga & Stok */}
              <div className="grid grid-cols-3 gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Harga Modal (Rp)</label>
                  <input required type="number" min="0" placeholder="0" className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={form.costPrice} onChange={e => setForm({...form, costPrice: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Harga Jual (Rp)</label>
                  <input required type="number" min="0" placeholder="0" className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={form.sellingPrice} onChange={e => setForm({...form, sellingPrice: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-red-500 mb-1">Min. Stok</label>
                  <input required type="number" min="0" placeholder="0" className="w-full border border-red-200 p-2 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                    value={form.minStock} onChange={e => setForm({...form, minStock: e.target.value})} />
                </div>
              </div>
              
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setIsOpen(false)} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-lg font-medium transition">Batal</button>
                <button type="submit" className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg font-medium transition">Simpan Produk</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};