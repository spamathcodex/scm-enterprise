import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { ArrowUpCircle, ArrowDownCircle, Filter, Printer } from 'lucide-react';
import { generateInvoice } from '../utils/printInvoice';

export const Transactions = () => {
  const [movements, setMovements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Panggil endpoint yang barusan kita buat
    api.get('/inventory/movements')
      .then(res => setMovements(res.data.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Riwayat Transaksi (Ledger)</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg text-gray-600 hover:bg-gray-50">
          <Filter size={18} /> Filter
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <p className="p-8 text-center">Memuat data...</p>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 text-gray-600 text-sm font-semibold uppercase">
              <tr>
                <th className="p-4">Tanggal</th>
                <th className="p-4">Tipe</th>
                <th className="p-4">Produk</th>
                <th className="p-4">Partner (Sup/Cust)</th>
                <th className="p-4 text-right">Jumlah</th>
                <th className="p-4 text-right">Harga</th>
                <th className="p-4 text-right">Total Nilai</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {movements.map((m) => (
                <tr key={m.id} className="hover:bg-gray-50 transition">
                  <td className="p-4 text-sm text-gray-500">
                    {new Date(m.createdAt).toLocaleDateString('id-ID')}
                  </td>
                  <td className="p-4">
                    <span className={`flex items-center gap-1 font-bold ${m.type === 'IN' ? 'text-green-600' : 'text-red-600'}`}>
                      {m.type === 'IN' ? <ArrowUpCircle size={16} /> : <ArrowDownCircle size={16} />}
                      {m.type === 'IN' ? 'MASUK' : 'KELUAR'}
                    </span>
                  </td>
                  <td className="p-4 font-medium text-gray-800">{m.product.name}</td>
                  <td className="p-4 text-sm text-gray-600">
                    {/* Tampilkan Nama Supplier jika Masuk, Customer jika Keluar */}
                    {m.type === 'IN' ? (m.supplier?.name || '-') : (m.customer?.name || '-')}
                  </td>
                  <td className="p-4 text-right font-mono">{m.amount}</td>
                  <td className="p-4 text-right text-gray-600">
                    Rp {new Intl.NumberFormat('id-ID').format(m.priceAtTime)}
                  </td>
                  <td className="p-4 text-right font-bold text-gray-800">
                    Rp {new Intl.NumberFormat('id-ID').format(m.amount * m.priceAtTime)}
                  </td>
                  {/* KOLOM AKSI: TOMBOL PRINT */}
                  <td className="p-4 text-center">
                    {m.type === 'OUT' && (
                      <button 
                        onClick={() => generateInvoice(m)}
                        className="text-gray-500 hover:text-blue-600 transition p-2 rounded-full hover:bg-blue-50"
                        title="Cetak Invoice"
                      >
                        <Printer size={18} />
                      </button>
                    )}
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