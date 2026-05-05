import React from 'react';
import { 
  Users, 
  Calendar, 
  DollarSign, 
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import StatCard from '../components/StatCard';

const data = [
  { name: 'T2', revenue: 45, patients: 32 },
  { name: 'T3', revenue: 52, patients: 38 },
  { name: 'T4', revenue: 48, patients: 35 },
  { name: 'T5', revenue: 61, patients: 42 },
  { name: 'T6', revenue: 55, patients: 40 },
  { name: 'T7', revenue: 67, patients: 48 },
  { name: 'CN', revenue: 42, patients: 28 },
];

import { mockData, supabase } from '../lib/supabase';
import { useState, useEffect } from 'react';

const Dashboard = () => {
  const [stats, setStats] = useState(mockData.stats);
  const [appointments, setAppointments] = useState(mockData.recentAppointments);
  const [inventory, setInventory] = useState(mockData.inventoryItems);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch real counts
        const { count: patientCount } = await supabase.from('patients').select('*', { count: 'exact', head: true });
        const { count: appointmentCount } = await supabase.from('appointments').select('*', { count: 'exact', head: true });
        const { count: inventoryAlerts } = await supabase.from('inventory').select('*', { count: 'exact', head: true }).lt('quantity', 10);

        // Fetch recent appointments
        const { data: recentApts } = await supabase
          .from('appointments')
          .select('id, patient_id, start_time, type, status')
          .order('start_time', { ascending: false })
          .limit(4);

        if (patientCount !== null) {
          setStats([
            { label: 'Tổng bệnh nhân', value: patientCount.toLocaleString(), change: '+0%', trend: 'up' },
            { label: 'Lịch hẹn', value: (appointmentCount || 0).toLocaleString(), change: '+0%', trend: 'up' },
            { label: 'Doanh thu tháng', value: '---', change: '+0%', trend: 'up' },
            { label: 'Cảnh báo kho', value: (inventoryAlerts || 0).toString(), change: '0', trend: 'down' }
          ]);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ marginBottom: '8px' }}>Chào buổi sáng, Dr. Minh Thư</h1>
        <p className="text-muted">Dưới đây là tổng quan phòng khám của bạn trong ngày hôm nay.</p>
      </div>

      <div className="stats-grid">
        {stats.map((stat, index) => (
          <StatCard 
            key={index}
            label={stat.label} 
            value={stat.value} 
            change={stat.change} 
            trend={stat.trend as 'up' | 'down'} 
            icon={index === 0 ? <Users size={24} /> : index === 1 ? <Calendar size={24} /> : index === 2 ? <DollarSign size={24} /> : <AlertTriangle size={24} />} 
            color={index === 0 ? '#3b82f6' : index === 1 ? '#6366f1' : index === 2 ? '#10b981' : '#ef4444'} 
          />
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '32px' }}>
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3>Phân tích doanh thu</h3>
            <select className="glass" style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <option>7 ngày qua</option>
              <option>30 ngày qua</option>
            </select>
          </div>
          <div style={{ width: '100%', height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'var(--text-muted)', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--text-muted)', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ 
                    background: 'var(--bg-card)', 
                    borderColor: 'var(--border-color)', 
                    borderRadius: '12px',
                    color: 'var(--text-main)'
                  }} 
                />
                <Area type="monotone" dataKey="revenue" stroke="var(--primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3>Lịch hẹn sắp tới</h3>
            <button className="btn btn-ghost" style={{ padding: '4px', fontSize: '0.8rem' }}>Xem tất cả</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {appointments.length > 0 ? appointments.map((apt: any) => (
              <div key={apt.id} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ 
                  width: '40px', 
                  height: '40px', 
                  borderRadius: '10px', 
                  background: 'var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 600,
                  color: 'var(--primary)'
                }}>
                  {apt.patient?.charAt(0) || 'P'}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{apt.patient || 'Bệnh nhân mới'}</p>
                  <p className="text-muted" style={{ fontSize: '0.75rem' }}>{apt.type} • {apt.time || apt.start_time}</p>
                </div>
                <span className={`badge ${apt.status === 'completed' ? 'badge-success' : apt.status === 'pending' ? 'badge-warning' : 'badge-danger'}`}>
                  {apt.status === 'completed' ? 'Xong' : apt.status === 'pending' ? 'Chờ' : 'Hủy'}
                </span>
              </div>
            )) : <p className="text-muted">Không có lịch hẹn gần đây.</p>}
          </div>
        </div>
      </div>

      <div className="glass-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h3>Cảnh báo tồn kho</h3>
          <ArrowRight size={20} className="text-muted" />
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Tên vật tư</th>
                <th>Danh mục</th>
                <th>Số lượng</th>
                <th>Đơn vị</th>
                <th>Hạn sử dụng</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((item) => (
                <tr key={item.id}>
                  <td style={{ fontWeight: 500 }}>{item.name}</td>
                  <td className="text-muted">{item.category}</td>
                  <td style={{ color: item.stock < 20 ? 'var(--danger)' : 'inherit', fontWeight: item.stock < 20 ? 600 : 400 }}>
                    {item.stock}
                  </td>
                  <td>{item.unit}</td>
                  <td>{item.expiry}</td>
                  <td>
                    <span className={`badge ${item.stock < 20 ? 'badge-danger' : 'badge-success'}`}>
                      {item.stock < 20 ? 'Sắp hết' : 'Ổn định'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
