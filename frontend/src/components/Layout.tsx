import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LayoutDashboard, Box, Truck, LogOut, PackageSearch, Users, History, ClipboardList } from 'lucide-react';

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <>
      <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-900 text-white hidden md:block">
        <div className="p-6">
          <h1 className="text-2xl font-bold italic">SCM PRO</h1>
        </div>
        <nav className="mt-6 space-y-2 px-4">
          <Link to="/dashboard" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-800 transition">
            <LayoutDashboard size={20} /> <span>Dashboard</span>
          </Link>
          <Link to="/products" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-800 transition">
            <Box size={20} /> <span>Products</span>
          </Link>
          <Link to="/inventory" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-800 transition">
            <PackageSearch size={20} /> <span>Inventory</span>
          </Link>
          <Link to="/suppliers" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-800 transition">
            <Truck size={20} /> <span>Suppliers</span>
          </Link>
          <Link to="/customers" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-800 transition">
            <Users size={20} /> <span>Customers</span>
          </Link>
          <Link to="/transactions" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-800 transition">
            <ClipboardList size={20} /> <span>Transactions</span>
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-700">Enterprise Panel</h2>
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-500">{user.name} ({user.role})</span>
            <button onClick={handleLogout} className="text-red-500 hover:text-red-700 flex items-center space-x-1">
              <LogOut size={18} /> <span>Keluar</span>
            </button>
          </div>
        </header>
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>

    <footer className="bg-white border-t border-gray-200 py-4 px-6 bottom">
      <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
        
        {/* Bagian Kiri: Copyright */}
        <div className="mb-2 md:mb-0">
          &copy; {new Date().getFullYear()} <strong>SCM Enterprise</strong>. All rights reserved.
        </div>

        {/* Bagian Kanan: Created By */}
        <div className="flex items-center gap-1">
          Dibuat oleh 
          <span className="font-bold text-indigo-600">Muhammad Azfa Asykarulloh</span>
        </div>
        
      </div>
    </footer>
    </>
  );
};