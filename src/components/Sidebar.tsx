import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Package, 
  DollarSign, 
  Settings, 
  Settings2,
  UserCog,
  Stethoscope,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

import { useAuth } from '../lib/AuthContext';

const Sidebar = () => {
  const { profile, signOut } = useAuth();
  
  const allNavItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/', roles: ['admin', 'doctor', 'nurse', 'receptionist', 'staff'] },
    { icon: <Calendar size={20} />, label: 'Lịch hẹn', path: '/appointments', roles: ['admin', 'doctor', 'nurse', 'receptionist'] },
    { icon: <Users size={20} />, label: 'Bệnh nhân', path: '/patients', roles: ['admin', 'doctor', 'nurse'] },
    { icon: <Package size={20} />, label: 'Kho dược', path: '/inventory', roles: ['admin', 'doctor', 'nurse'] },
    { icon: <DollarSign size={20} />, label: 'Doanh thu', path: '/revenue', roles: ['admin'] },
    { icon: <Settings2 size={20} />, label: 'Giá dịch vụ', path: '/services', roles: ['admin'] },
    { icon: <UserCog size={20} />, label: 'Nhân sự', path: '/users', roles: ['admin'] },
    { icon: <Settings size={20} />, label: 'Cài đặt', path: '/settings', roles: ['admin'] },
  ];

  const navItems = allNavItems.filter(item => 
    !profile || item.roles.includes(profile.role)
  );

  return (
    <aside className="sidebar glass">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px', padding: '0 8px' }}>
        <div style={{ 
          width: '40px', 
          height: '40px', 
          background: 'var(--primary)', 
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white'
        }}>
          <Stethoscope size={24} />
        </div>
        <div className="sidebar-text">
          <h3 style={{ margin: 0, fontSize: '1.1rem' }}>SmartMed</h3>
          <p className="text-muted" style={{ fontSize: '0.7rem' }}>CLINIC MANAGER</p>
        </div>
      </div>

      <nav>
        {navItems.map((item) => (
          <NavLink 
            key={item.path} 
            to={item.path} 
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            {item.icon}
            <span className="sidebar-text">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div style={{ marginTop: 'auto', padding: '16px', borderTop: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }} className="sidebar-text">
          <div style={{ 
            width: '32px', 
            height: '32px', 
            borderRadius: '50%', 
            background: 'linear-gradient(45deg, var(--primary), var(--secondary))' 
          }} />
          <div>
            <p style={{ fontWeight: 600, fontSize: '0.85rem' }}>{profile?.full_name || 'Dr. Minh Thư'}</p>
            <p className="text-muted" style={{ fontSize: '0.75rem', textTransform: 'uppercase' }}>{profile?.role || 'Admin'}</p>
          </div>
        </div>
        <button onClick={signOut} className="btn btn-ghost" style={{ width: '100%', fontSize: '0.8rem', padding: '8px' }}>
          Đăng xuất
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
