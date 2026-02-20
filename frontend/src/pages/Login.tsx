import { useNavigate } from 'react-router-dom';
import { useState } from "react";
import api from "../api/axios";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data.data;
      
      // Simpan kunci emas (token) di browser
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      setMessage(`Selamat Datang, ${user.name}!`);

      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Login Gagal');
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-8">SCM Enterprise</h2>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input 
              type="email" 
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@scm.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input 
              type="password" 
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          
          <button 
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Masuk ke Sistem
          </button>
        </form>

        {message && (
          <p className={`mt-4 text-center text-sm font-medium ${message.includes('Selamat') ? 'text-green-600' : 'text-red-600'}`}>
            {message}
          </p>
        )}
      </div>
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
}

export default Login;