import React from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  CreditCard, 
  FileText, 
  Download,
  Calendar as CalendarIcon
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';

import { supabase, mockData } from '../lib/supabase';
import { useState, useEffect } from 'react';

const Revenue = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [stats, setStats] = useState({ daily: 0, monthly: 0, growth: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRevenueData();
  }, []);

  const fetchRevenueData = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('revenue')
      .select('*, appointments(patients(name))')
      .order('transaction_date', { ascending: false });

    if (!error && data && data.length > 0) {
      setTransactions(data.map(d => ({
        id: d.id,
        patient: d.appointments?.patients?.name || 'Vãng lai',
        amount: d.amount,
        method: d.payment_method,
        date: new Date(d.transaction_date).toLocaleString('vi-VN'),
        status: d.status
      })));
      
      const total = data.reduce((sum, item) => sum + Number(item.amount), 0);
      setStats({ daily: total / 30, monthly: total, growth: 12 });
    }
    setLoading(false);
  };

  const chartData = [
    { name: 'Th 1', value: 320 },
    { name: 'Th 2', value: 450 },
    { name: 'Th 3', value: 410 },
    { name: 'Th 4', value: 580 },
    { name: 'Th 5', value: 425 },
  ];

  const COLORS = ['#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef'];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1>Báo cáo Doanh thu Chi tiết</h1>
          <p className="text-muted">Phân tích tài chính và lịch sử giao dịch thực tế.</p>
        </div>
        <button className="btn btn-ghost" style={{ border: '1px solid var(--border-color)' }}>
          <Download size={18} /> Xuất Excel
        </button>
      </div>

      <div className="stats-grid">
        <div className="glass-card stat-card">
          <p className="text-muted">Doanh thu trung bình ngày</p>
          <h2 style={{ color: 'var(--success)' }}>{stats.daily.toLocaleString()}đ</h2>
          <p style={{ fontSize: '0.8rem', marginTop: '8px' }}>Dựa trên dữ liệu thực tế</p>
        </div>
        <div className="glass-card stat-card">
          <p className="text-muted">Tổng doanh thu hệ thống</p>
          <h2>{stats.monthly.toLocaleString()}đ</h2>
          <p style={{ fontSize: '0.8rem', marginTop: '8px' }}>Cập nhật thời gian thực</p>
        </div>
        <div className="glass-card stat-card">
          <p className="text-muted">Số lượng giao dịch</p>
          <h2 style={{ color: 'var(--primary)' }}>{transactions.length}</h2>
          <p style={{ fontSize: '0.8rem', marginTop: '8px' }}>Giao dịch đã hoàn tất</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
        <div className="glass-card" style={{ padding: '24px' }}>
          <h3>Doanh thu 5 tháng gần nhất</h3>
          <div style={{ width: '100%', height: '300px', marginTop: '24px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip 
                   contentStyle={{ background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-color)' }}
                />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '24px' }}>
          <h3>Lịch sử Giao dịch Chi tiết</h3>
          <div className="table-container" style={{ marginTop: '24px' }}>
            <table>
              <thead>
                <tr>
                  <th>Bệnh nhân</th>
                  <th>Số tiền</th>
                  <th>Phương thức</th>
                  <th>Thời gian</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t) => (
                  <tr key={t.id}>
                    <td style={{ fontWeight: 600 }}>{t.patient}</td>
                    <td style={{ color: 'var(--success)', fontWeight: 600 }}>{Number(t.amount).toLocaleString()}đ</td>
                    <td>{t.method}</td>
                    <td className="text-muted">{t.date}</td>
                    <td>
                      <span className="badge badge-success">{t.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {transactions.length === 0 && <p className="text-muted" style={{ textAlign: 'center', padding: '20px' }}>Chưa có giao dịch nào được ghi nhận.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Revenue;
