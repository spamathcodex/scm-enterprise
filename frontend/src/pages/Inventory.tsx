import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import ini
import api from '../api/axios';
import { Warehouse, ArrowRightLeft, Plus } from 'lucide-react'; // Tambah icon Plus
import { StockMovementModal } from '../components/StockMovementModal';
import { AddWarehouseModal } from '../components/AddWarehouseModal'; // <--- IMPORT BARU

export const Inventory = () => {
  const navigate = useNavigate();
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [isMovementOpen, setIsMovementOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false); // <--- STATE BARU

  const fetchData = async () => {
    try {
      const res = await api.get('/inventory/warehouses');
      setWarehouses(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Manajemen Gudang & Stok</h1>
        
        <div className="flex gap-2">
          {/* TOMBOL TAMBAH GUDANG BARU */}
          <button 
            onClick={() => setIsAddOpen(true)}
            className="bg-white text-indigo-600 border border-indigo-200 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-50 transition"
          >
            <Plus size={20} /> Buat Gudang
          </button>

          <button 
            onClick={() => setIsMovementOpen(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700 shadow-lg transition"
          >
            <ArrowRightLeft size={20} /> Catat Mutasi
          </button>
        </div>
      </div>

      {/* Grid Gudang */}
      {warehouses.length === 0 ? (
        <div className="text-center p-10 bg-gray-50 rounded-xl border border-dashed border-gray-300">
          <p className="text-gray-500">Belum ada gudang. Silakan buat gudang pertama Anda!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {warehouses.map((w) => (
            <div key={w.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                  <Warehouse size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">{w.name}</h3>
                  <p className="text-sm text-gray-500 font-mono">{w.code}</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-4">{w.location}</p>
              <button 
                onClick={() => navigate(`/inventory/${w.id}`)}
                className="w-full py-2 text-blue-600 font-medium text-sm border border-blue-100 rounded-lg hover:bg-blue-50"
              >
                Lihat Detail Stok
              </button>
            </div>
          ))}
        </div>
      )}

      {/* MODAL MUTASI */}
      <StockMovementModal 
        isOpen={isMovementOpen} 
        onClose={() => setIsMovementOpen(false)} 
        onSuccess={fetchData} 
      />

      {/* MODAL TAMBAH GUDANG (BARU) */}
      <AddWarehouseModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSuccess={fetchData}
      />
    </div>
  );
};

export default Inventory;