import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { AlertTriangle, Package, Layers } from 'lucide-react';

export const Dashboard = () => {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    api.get('/inventory/dashboard/stats')
      .then(res => setStats(res.data.data))
      .catch(err => console.error(err));
  }, []);

  if (!stats) return <p>Loading data...</p>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Card Total Produk */}
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Produk</p>
            <h3 className="text-3xl font-bold text-gray-800">{stats.totalProducts}</h3>
          </div>
          <Package className="text-blue-500" size={40} />
        </div>

        {/* Card Stok Menipis */}
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-red-500 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium">Stok Menipis (Alert)</p>
            <h3 className="text-3xl font-bold text-red-600">{stats.lowStockCount}</h3>
          </div>
          <AlertTriangle className="text-red-500" size={40} />
        </div>

        {/* Card Inventory Value (Nilai Aset) */}
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-emerald-500 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium">Nilai Aset Gudang</p>
            <h3 className="text-2xl font-bold text-emerald-700">
              Rp {new Intl.NumberFormat('id-ID').format(stats.inventoryValue || 0)}
            </h3>
          </div>
          <Layers className="text-emerald-500" size={40} />
        </div>

        {/* Card Total Sales (Omzet) */}
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-purple-500 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Penjualan</p>
            <h3 className="text-2xl font-bold text-purple-700">
              Rp {new Intl.NumberFormat('id-ID').format(stats.totalSales || 0)}
            </h3>
          </div>
          <Layers className="text-purple-500" size={40} />
        </div>
      </div>

      {/* Tabel Low Stock Items */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50">
          <h3 className="font-bold text-gray-700">Daftar Barang Harus Restock</h3>
        </div>
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 text-sm font-semibold text-gray-600">Produk</th>
              <th className="p-4 text-sm font-semibold text-gray-600">Gudang</th>
              <th className="p-4 text-sm font-semibold text-gray-600">Stok Saat Ini</th>
              <th className="p-4 text-sm font-semibold text-gray-600">Min. Stok</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
              {!stats.lowStockItems || stats.lowStockItems.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-10 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      {/* Boleh tambah icon di sini kalau mau */}
                      <p className="text-lg font-medium text-gray-500">Hore! Stok Aman 🚀</p>
                      <p className="text-sm mt-1">Belum ada barang yang menipis atau perlu di-restock saat ini.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                stats.lowStockItems.map((item: any, index: number) => (
                  <tr key={index} className="hover:bg-red-50 transition">
                    <td className="p-4 font-medium text-gray-800">{item.product.name}</td>
                    <td className="p-4 text-gray-600">{item.warehouse.name}</td>
                    <td className="p-4 text-red-600 font-bold">{item.quantity}</td>
                    <td className="p-4 text-gray-500">{item.product.minStock}</td>
                  </tr>
                ))
              )}
            </tbody>
        </table>
      </div>
    </div>
  );
};