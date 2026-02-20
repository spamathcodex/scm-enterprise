import { useEffect, useState } from 'react';
import api from '../api/axios';
import { ArrowUpCircle, ArrowDownCircle, Filter, Printer, Receipt } from 'lucide-react'; // Tambah Receipt
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
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition shadow-sm">
          <Filter size={18} /> Filter
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          // State saat loading data
          <div className="p-12 text-center flex flex-col items-center">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500 font-medium">Memuat data transaksi...</p>
          </div>
        ) : movements.length === 0 ? (
          // Empty State jika belum ada transaksi
          <div className="p-16 text-center flex flex-col items-center justify-center">
            <div className="bg-blue-50 p-5 rounded-full mb-4">
              <Receipt size={48} className="text-blue-500" />
            </div>
            <p className="text-xl font-medium text-gray-800">Belum Ada Transaksi 📝</p>
            <p className="text-sm text-gray-500 mt-2 max-w-md mx-auto">
              Buku besar (Ledger) masih kosong. Data pergerakan barang (Barang Masuk / Keluar) akan otomatis tercatat di sini saat Anda memproses transaksi di menu <span className="font-semibold text-blue-600">Inventory</span>.
            </p>
          </div>
        ) : (
          // Tabel Data Transaksi
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 text-gray-600 text-sm font-semibold uppercase border-b border-gray-200">
                <tr>
                  <th className="p-4 whitespace-nowrap">Tanggal</th>
                  <th className="p-4 whitespace-nowrap">Tipe</th>
                  <th className="p-4 min-w-[150px]">Produk</th>
                  <th className="p-4 min-w-[150px]">Partner (Sup/Cust)</th>
                  <th className="p-4 text-right whitespace-nowrap">Jumlah</th>
                  <th className="p-4 text-right whitespace-nowrap">Harga</th>
                  <th className="p-4 text-right whitespace-nowrap">Total Nilai</th>
                  <th className="p-4 text-center">Aksi</th> {/* Fix: Tambah header untuk kolom Print */}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {movements.map((m) => (
                  <tr key={m.id} className="hover:bg-blue-50/50 transition">
                    <td className="p-4 text-sm text-gray-500 whitespace-nowrap">
                      {new Date(m.createdAt).toLocaleDateString('id-ID', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                        m.type === 'IN' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {m.type === 'IN' ? <ArrowUpCircle size={14} /> : <ArrowDownCircle size={14} />}
                        {m.type === 'IN' ? 'MASUK' : 'KELUAR'}
                      </span>
                    </td>
                    <td className="p-4 font-medium text-gray-800">{m.product?.name || '-'}</td>
                    <td className="p-4 text-sm text-gray-600">
                      {m.type === 'IN' ? (m.supplier?.name || '-') : (m.customer?.name || '-')}
                    </td>
                    <td className="p-4 text-right font-mono font-medium">{m.amount}</td>
                    <td className="p-4 text-right text-gray-600 text-sm">
                      Rp {new Intl.NumberFormat('id-ID').format(m.priceAtTime)}
                    </td>
                    <td className="p-4 text-right font-bold text-gray-800">
                      Rp {new Intl.NumberFormat('id-ID').format(m.amount * m.priceAtTime)}
                    </td>
                    <td className="p-4 text-center">
                      {m.type === 'OUT' ? (
                        <button 
                          onClick={() => generateInvoice(m)}
                          className="text-gray-400 hover:text-blue-600 transition p-2 rounded-lg hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          title="Cetak Invoice"
                        >
                          <Printer size={18} />
                        </button>
                      ) : (
                        <span className="text-gray-300">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};