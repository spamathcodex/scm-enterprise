import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login'; // Pindahkan kode Login kamu ke folder src/pages/Login.tsx
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Products } from './pages/Products';
import Inventory from './pages/Inventory';
import { WarehouseDetail } from './pages/WarehouseDetail';
import { Suppliers } from './pages/Suppliers';
import { Customers } from './pages/Customers';
import { Transactions } from './pages/Transactions';

function App() {
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <Routes>
      <Route path="/" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} />
      
      <Route path="/dashboard" element={
        isAuthenticated ? (
          <Layout>
            <Dashboard />
          </Layout>
        ) : (
          <Navigate to="/" />
        )
      } />

      <Route path="/products" element={
        isAuthenticated ? ( <Layout> <Products /> </Layout> ) : ( <Navigate to="/" /> )
      } />

      <Route path="/inventory" element={
        isAuthenticated ? ( <Layout> <Inventory /> </Layout> ) : ( <Navigate to="/" /> )
      } />

      <Route path="/inventory/:id" element={ 
        isAuthenticated ? <Layout><WarehouseDetail /></Layout> : <Navigate to="/" /> 
      } />

      <Route path="/suppliers" element={ isAuthenticated ? <Layout><Suppliers /></Layout> : <Navigate to="/" /> } />

      <Route path="/customers" element={ isAuthenticated ? <Layout><Customers /></Layout> : <Navigate to="/" /> } />

      <Route path="/transactions" element={ isAuthenticated ? <Layout><Transactions /></Layout> : <Navigate to="/" /> } />
    </Routes>
  );
}

export default App;