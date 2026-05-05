import { 
  Plus, 
  Search, 
  Calendar as CalendarIcon, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Trash2,
  FileText
} from 'lucide-react';
import { supabase, mockData } from '../lib/supabase';
import { useState, useEffect } from 'react';
import { useAuth } from '../lib/AuthContext';
import PrescriptionModal from '../components/PrescriptionModal';

const Appointments = () => {
  const { profile } = useAuth();
  const [filter, setFilter] = useState('all');
  const [appointments, setAppointments] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showPrescription, setShowPrescription] = useState<any>(null);
  const [newApt, setNewApt] = useState({ patient_id: '', doctor_name: 'Dr. Minh Thư', start_time: '', type: 'Khám tổng quát', notes: '' });

  useEffect(() => {
    fetchAppointments();
    fetchPatients();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('appointments')
      .select('*, patients(name)')
      .order('start_time', { ascending: true });
    
    if (!error && data && data.length > 0) {
      setAppointments(data.map(d => ({
        id: d.id,
        patient: d.patients?.name || 'Ẩn danh',
        time: new Date(d.start_time).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        type: d.type,
        status: d.status,
        date: d.start_time
      })));
    } else {
      setAppointments(mockData.recentAppointments);
    }
    setLoading(false);
  };

  const fetchPatients = async () => {
    const { data } = await supabase.from('patients').select('id, name');
    if (data) setPatients(data);
  };

  const handleAddAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('appointments').insert([newApt]);
    if (error) alert(error.message);
    else {
      setShowAddForm(false);
      fetchAppointments();
    }
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    const { error } = await supabase.from('appointments').update({ status }).eq('id', id);
    if (error) alert(error.message);
    else fetchAppointments();
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Hủy lịch hẹn này?')) return;
    const { error } = await supabase.from('appointments').delete().eq('id', id);
    if (error) alert(error.message);
    else fetchAppointments();
  };

  const filteredAppointments = filter === 'all' 
    ? appointments 
    : appointments.filter(apt => apt.status === filter);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1>Quản lý Lịch hẹn</h1>
          <p className="text-muted">Theo dõi và sắp xếp lịch khám bệnh trong ngày.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
          <Plus size={18} /> {showAddForm ? 'Hủy bỏ' : 'Đặt lịch mới'}
        </button>
      </div>

      {showAddForm && (
        <div className="glass-card" style={{ padding: '24px', marginBottom: '24px' }}>
          <h3>Đặt lịch hẹn mới</h3>
          <form onSubmit={handleAddAppointment} style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginTop: '16px' }}>
            <select className="glass" style={{ padding: '10px' }} required onChange={e => setNewApt({...newApt, patient_id: e.target.value})}>
              <option value="">Chọn bệnh nhân</option>
              {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            <input className="glass" style={{ padding: '10px' }} type="datetime-local" required onChange={e => setNewApt({...newApt, start_time: e.target.value})} />
            <input className="glass" style={{ padding: '10px' }} placeholder="Loại dịch vụ" onChange={e => setNewApt({...newApt, type: e.target.value})} />
            <input className="glass" style={{ padding: '10px' }} placeholder="Bác sĩ phụ trách" value={newApt.doctor_name} onChange={e => setNewApt({...newApt, doctor_name: e.target.value})} />
            <textarea className="glass" style={{ padding: '10px', gridColumn: 'span 2', minHeight: '80px' }} placeholder="Ghi chú thêm..." onChange={e => setNewApt({...newApt, notes: e.target.value})} />
            <button className="btn btn-primary" type="submit" style={{ gridColumn: 'span 2' }}>Xác nhận đặt lịch</button>
          </form>
        </div>
      )}

      <div className="glass-card" style={{ padding: '24px', marginBottom: '32px' }}>
        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
          <button 
            className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setFilter('all')}
          >
            Tất cả
          </button>
          <button 
            className={`btn ${filter === 'pending' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setFilter('pending')}
          >
            Chờ khám
          </button>
          <button 
            className={`btn ${filter === 'completed' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setFilter('completed')}
          >
            Đã xong
          </button>
          <button 
            className={`btn ${filter === 'cancelled' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setFilter('cancelled')}
          >
            Đã hủy
          </button>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Giờ khám</th>
                <th>Bệnh nhân</th>
                <th>Loại dịch vụ</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.map((apt) => (
                <tr key={apt.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
                      <Clock size={16} className="text-muted" /> {apt.time}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{apt.patient}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: BN-00{apt.id}</div>
                  </td>
                  <td>{apt.type}</td>
                  <td>
                    <span className={`badge ${apt.status === 'completed' ? 'badge-success' : apt.status === 'pending' ? 'badge-warning' : 'badge-danger'}`}>
                      {apt.status === 'completed' ? 'Hoàn thành' : apt.status === 'pending' ? 'Đang chờ' : 'Đã hủy'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {apt.status === 'pending' && (
                        <>
                          <button 
                            onClick={() => handleStatusUpdate(apt.id, 'completed')} 
                            className="btn btn-ghost" 
                            style={{ padding: '6px', color: 'var(--success)' }}
                            title="Hoàn thành"
                          >
                            <CheckCircle size={18} />
                          </button>
                          <button 
                            onClick={() => handleStatusUpdate(apt.id, 'cancelled')} 
                            className="btn btn-ghost" 
                            style={{ padding: '6px', color: 'var(--danger)' }}
                            title="Hủy khám"
                          >
                            <XCircle size={18} />
                          </button>
                        </>
                      )}
                      <button 
                        onClick={() => setShowPrescription({ name: apt.patient, id: apt.id })}
                        className="btn btn-ghost" 
                        style={{ padding: '6px', color: 'var(--primary)' }}
                        title="In đơn thuốc"
                      >
                        <FileText size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(apt.id)} 
                        className="btn btn-ghost" 
                        style={{ padding: '6px', color: 'var(--danger)' }}
                        title="Xóa vĩnh viễn"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="glass-card" style={{ padding: '24px' }}>
        <h3>Lịch làm việc của Bác sĩ</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginTop: '20px' }}>
          <div style={{ padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <p style={{ fontWeight: 600 }}>Dr. Minh Thư</p>
            <p className="text-muted" style={{ fontSize: '0.8rem' }}>Nội tổng quát</p>
            <div className="badge badge-success" style={{ marginTop: '8px' }}>Đang trực</div>
          </div>
          <div style={{ padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <p style={{ fontWeight: 600 }}>Dr. Tuấn Anh</p>
            <p className="text-muted" style={{ fontSize: '0.8rem' }}>Nha khoa</p>
            <div className="badge badge-warning" style={{ marginTop: '8px' }}>Nghỉ ca</div>
          </div>
        </div>
      </div>

      {showPrescription && (
        <PrescriptionModal 
          patient={showPrescription} 
          doctor={profile?.full_name || 'Dr. Minh Thư'} 
          onClose={() => setShowPrescription(null)} 
        />
      )}
    </div>
  );
};

export default Appointments;
