import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Bell, Search } from 'lucide-react';

const Layout = () => {
  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        <header style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '32px' 
        }}>
          <div style={{ position: 'relative', width: '300px' }}>
            <Search 
              size={18} 
              style={{ 
                position: 'absolute', 
                left: '12px', 
                top: '50%', 
                transform: 'translateY(-50%)', 
                color: 'var(--text-muted)' 
              }} 
            />
            <input 
              type="text" 
              placeholder="Tìm kiếm bệnh nhân, thuốc..." 
              className="glass"
              style={{ 
                width: '100%', 
                padding: '10px 10px 10px 40px', 
                borderRadius: '12px',
                outline: 'none',
                fontSize: '0.9rem'
              }}
            />
          </div>
          
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <button className="btn btn-ghost" style={{ padding: '8px', position: 'relative' }}>
              <Bell size={20} />
              <span style={{ 
                position: 'absolute', 
                top: '6px', 
                right: '6px', 
                width: '8px', 
                height: '8px', 
                background: 'var(--danger)', 
                borderRadius: '50%',
                border: '2px solid var(--bg-main)'
              }} />
            </button>
            <button className="btn btn-primary">
              + Thêm lịch hẹn
            </button>
          </div>
        </header>
        
        <Outlet />
      </main>
    </div>
  );
};

        <footer style={{ textAlign: 'center', padding: '16px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Built and developed by TRITNQ
        </footer>
export default Layout;
