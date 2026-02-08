import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { ArrowLeft, Package } from 'lucide-react';

export const WarehouseDetail = () => {
  const { id } = useParams(); // Ambil ID dari URL
  const navigate = useNavigate();
  const [stocks, setStocks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/inventory/warehouses/${id}/stocks`)
      .then(res => setStocks(res.data.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div className="space-y-6">
      <button 
        onClick={() => navigate('/inventory')} 
        className="flex items-center text-gray-500 hover:text-blue-600 transition"
      >
        <ArrowLeft size={20} className="mr-2" /> Kembali ke Daftar Gudang
      </button>

      <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-indigo-500">
        <h1 className="text-2xl font-bold text-gray-800">Isi Gudang (ID: {id})</h1>
        <p className="text-gray-500">Daftar stok fisik yang tersedia saat ini.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <p className="p-8 text-center text-gray-500">Memuat data stok...</p>
        ) : stocks.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <Package size={48} className="mx-auto mb-4 opacity-50" />
            <p>Gudang ini masih kosong melompong.</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead className="bg-indigo-50 text-indigo-900">
              <tr>
                <th className="p-4 font-semibold">SKU</th>
                <th className="p-4 font-semibold">Nama Produk</th>
                <th className="p-4 font-semibold text-right">Jumlah Stok</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {stocks.map((item) => (
                <tr key={item.productId} className="hover:bg-gray-50">
                  <td className="p-4 font-mono text-sm text-gray-500">{item.product.sku}</td>
                  <td className="p-4 font-medium text-gray-800">{item.product.name}</td>
                  <td className="p-4 text-right font-bold text-indigo-600 text-lg">
                    {item.quantity} Unit
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};