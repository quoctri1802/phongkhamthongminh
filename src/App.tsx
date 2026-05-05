import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Appointments from './pages/Appointments';
import Revenue from './pages/Revenue';
import Patients from './pages/Patients';
import Inventory from './pages/Inventory';
import Users from './pages/Users';
import Services from './pages/Services';

const Settings = () => (
  <div className="glass-card" style={{ padding: '32px' }}>
    <h1>Cài đặt hệ thống</h1>
    <p className="text-muted">Tính năng đang được cập nhật...</p>
  </div>
);

import { useAuth } from './lib/AuthContext';
import Login from './pages/Login';

function App() {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-main)', color: 'var(--text-main)' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="animate-spin" style={{ marginBottom: '16px' }}>⌛</div>
          <p>Đang khởi tạo hệ thống SmartMed...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="appointments" element={<Appointments />} />
          <Route path="patients" element={<Patients />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="revenue" element={<Revenue />} />
          <Route path="settings" element={<Settings />} />
          <Route path="users" element={<Users />} />
          <Route path="services" element={<Services />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
