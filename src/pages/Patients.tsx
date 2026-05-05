import React from 'react';
import { Search, UserPlus, Mail, Phone, Calendar, MoreHorizontal, Trash2 } from 'lucide-react';

import { supabase } from '../lib/supabase';
import { useState, useEffect } from 'react';

const Patients = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPatient, setNewPatient] = useState({ name: '', dob: '', phone: '', email: '', address: '' });

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('patients').select('*').order('name');
    if (!error) setPatients(data || []);
    setLoading(false);
  };

  const handleAddPatient = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('patients').insert([newPatient]);
    if (error) alert(error.message);
    else {
      setShowAddForm(false);
      fetchPatients();
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Xóa hồ sơ bệnh nhân này?')) return;
    const { error } = await supabase.from('patients').delete().eq('id', id);
    if (error) alert(error.message);
    else fetchPatients();
  };

  const filteredPatients = patients.filter(p => 
    p.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.phone?.includes(searchTerm)
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1>Hồ sơ Bệnh nhân</h1>
          <p className="text-muted">Quản lý thông tin chi tiết và lịch sử khám bệnh.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
          <UserPlus size={18} /> {showAddForm ? 'Hủy bỏ' : 'Thêm bệnh nhân mới'}
        </button>
      </div>

      {showAddForm && (
        <div className="glass-card" style={{ padding: '24px', marginBottom: '24px' }}>
          <h3>Đăng ký bệnh nhân mới</h3>
          <form onSubmit={handleAddPatient} style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginTop: '16px' }}>
            <input className="glass" style={{ padding: '10px' }} placeholder="Họ và tên" required onChange={e => setNewPatient({...newPatient, name: e.target.value})} />
            <input className="glass" style={{ padding: '10px' }} type="date" placeholder="Ngày sinh" onChange={e => setNewPatient({...newPatient, dob: e.target.value})} />
            <input className="glass" style={{ padding: '10px' }} placeholder="Số điện thoại" onChange={e => setNewPatient({...newPatient, phone: e.target.value})} />
            <input className="glass" style={{ padding: '10px' }} type="email" placeholder="Email" onChange={e => setNewPatient({...newPatient, email: e.target.value})} />
            <input className="glass" style={{ padding: '10px', gridColumn: 'span 2' }} placeholder="Địa chỉ" onChange={e => setNewPatient({...newPatient, address: e.target.value})} />
            <button className="btn btn-primary" type="submit" style={{ gridColumn: 'span 2' }}>Lưu hồ sơ</button>
          </form>
        </div>
      )}

      <div className="glass-card" style={{ padding: '24px' }}>
        <div style={{ position: 'relative', marginBottom: '24px' }}>
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
            placeholder="Tìm kiếm theo tên, số điện thoại hoặc mã bệnh nhân..." 
            className="glass"
            style={{ 
              width: '100%', 
              padding: '12px 12px 12px 40px', 
              borderRadius: '12px',
              outline: 'none'
            }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Họ và Tên</th>
                <th>Ngày sinh</th>
                <th>Liên hệ</th>
                <th>Ngày tham gia</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{p.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: {p.id.substring(0, 8)}</div>
                  </td>
                  <td>{p.dob}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
                      <Phone size={14} className="text-muted" /> {p.phone}
                    </div>
                  </td>
                  <td>{new Date(p.created_at).toLocaleDateString('vi-VN')}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                       <button className="btn btn-ghost" style={{ padding: '8px' }}>
                         <MoreHorizontal size={20} />
                       </button>
                       <button className="btn btn-ghost" style={{ padding: '8px', color: 'var(--danger)' }} onClick={() => handleDelete(p.id)}>
                         <Trash2 size={20} />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredPatients.length === 0 && !loading && (
            <p style={{ textAlign: 'center', padding: '20px' }} className="text-muted">Chưa có dữ liệu bệnh nhân.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Patients;
