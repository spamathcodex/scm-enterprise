import { Box, ClipboardList, LayoutDashboard, PackageSearch, Truck, Users } from "lucide-react"
import { Link } from "react-router-dom"

const Sidebar = () => {
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
}

export default Sidebar;