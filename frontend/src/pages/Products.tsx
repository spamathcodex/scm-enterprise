import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Plus, Search } from 'lucide-react';
import { AddProductModal } from '../components/AddProductModal';

export const Products = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false); // <--- STATE MODAL

  // Ambil data produk saat halaman dibuka
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      // Ingat fitur pagination di backend? Kita ambil page 1, limit 100 dulu
      const response = await api.get('/products?page=1&limit=100');
      setProducts(response.data.data);
    } catch (error) {
      console.error("Gagal ambil produk", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Halaman */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Manajemen Produk</h1>
        <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition">
          <Plus size={20} /> Tambah Produk
        </button>
      </div>

      {/* Search Bar & Table Container */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50 flex gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Cari nama produk atau SKU..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {loading ? (
          <p className="p-8 text-center text-gray-500">Sedang memuat data...</p>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-100 text-gray-600 uppercase text-sm font-semibold">
              <tr>
                <th className="p-4">SKU</th>
                <th className="p-4">Nama Produk</th>
                <th className="p-4">Harga</th>
                <th className="p-4">Min. Stok</th>
                <th className="p-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.length > 0 ? (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition">
                    <td className="p-4 font-mono text-blue-600 font-medium">{product.sku}</td>
                    <td className="p-4 font-medium text-gray-800">{product.name}</td>
                    <td className="p-4 text-gray-600">
                      Rp {new Intl.NumberFormat('id-ID').format(product.price)}
                    </td>
                    <td className="p-4 text-center">
                      <span className="bg-gray-200 text-gray-700 py-1 px-3 rounded-full text-xs font-bold">
                        {product.minStock}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <button className="text-blue-500 hover:text-blue-700 font-medium text-sm">Edit</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">
                    Belum ada produk. Silakan tambah dulu.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      <AddProductModal
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchProducts} // Panggil fetchProducts agar tabel update otomatis
      />
    </div>
  );
};

export default Products;