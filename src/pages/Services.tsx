import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { 
  Plus, 
  Settings2, 
  DollarSign, 
  Trash2, 
  Save, 
  X,
  Stethoscope
} from 'lucide-react';
import { useAuth } from '../lib/AuthContext';

interface Service {
  id: string;
  name: string;
  price: number;
  description: string;
}

const Services = () => {
  const { profile } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newService, setNewService] = useState({ name: '', price: 0, description: '' });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('services').select('*').order('name');
    if (!error) setServices(data || []);
    setLoading(false);
  };

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('services').insert([newService]);
    if (error) alert(error.message);
    else {
      setShowAddForm(false);
      fetchServices();
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Xóa dịch vụ này?')) return;
    const { error } = await supabase.from('services').delete().eq('id', id);
    if (error) alert(error.message);
    else fetchServices();
  };

  if (profile?.role !== 'admin') {
    return <div className="glass-card" style={{ padding: '40px' }}>Bạn không có quyền truy cập trang này.</div>;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1>Cấu hình Giá dịch vụ</h1>
          <p className="text-muted">Thiết lập bảng giá cho các loại hình khám chữa bệnh.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
          <Plus size={18} /> {showAddForm ? 'Hủy bỏ' : 'Thêm dịch vụ'}
        </button>
      </div>

      {showAddForm && (
        <div className="glass-card" style={{ padding: '24px', marginBottom: '24px' }}>
          <h3>Thêm loại dịch vụ mới</h3>
          <form onSubmit={handleAddService} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginTop: '16px' }}>
            <input className="glass" style={{ padding: '10px' }} placeholder="Tên dịch vụ (Ví dụ: Nội soi)" required onChange={e => setNewService({...newService, name: e.target.value})} />
            <input className="glass" style={{ padding: '10px' }} type="number" placeholder="Giá tiền (VNĐ)" required onChange={e => setNewService({...newService, price: parseInt(e.target.value)})} />
            <input className="glass" style={{ padding: '10px' }} placeholder="Mô tả ngắn" onChange={e => setNewService({...newService, description: e.target.value})} />
            <button className="btn btn-primary" type="submit" style={{ gridColumn: 'span 3' }}>Lưu cấu hình</button>
          </form>
        </div>
      )}

      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
        {services.map((s) => (
          <div key={s.id} className="glass-card" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <Stethoscope size={18} color="var(--primary)" />
                <h3 style={{ margin: 0 }}>{s.name}</h3>
              </div>
              <p className="text-muted" style={{ fontSize: '0.85rem' }}>{s.description || 'Chưa có mô tả'}</p>
              <h2 style={{ marginTop: '12px', color: 'var(--success)' }}>{Number(s.price).toLocaleString()}đ</h2>
            </div>
            <button className="btn btn-ghost" style={{ color: 'var(--danger)', padding: '8px' }} onClick={() => handleDelete(s.id)}>
              <Trash2 size={20} />
            </button>
          </div>
        ))}
        {services.length === 0 && !loading && <p>Chưa có dịch vụ nào được cấu hình.</p>}
      </div>
    </div>
  );
};

export default Services;
