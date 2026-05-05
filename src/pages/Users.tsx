import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { 
  UserPlus, 
  Search, 
  UserCog, 
  Trash2, 
  Shield, 
  Mail, 
  Check, 
  X,
  Loader2
} from 'lucide-react';
import { useAuth } from '../lib/AuthContext';

interface Profile {
  id: string;
  full_name: string;
  role: string;
  avatar_url?: string;
}

const Users = () => {
  const { profile: currentProfile } = useAuth();
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editRole, setEditRole] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('full_name');
    
    if (error) console.error('Error fetching users:', error);
    else setUsers(data || []);
    setLoading(false);
  };

  const handleUpdateRole = async (userId: string) => {
    const { error } = await supabase
      .from('profiles')
      .update({ role: editRole })
      .eq('id', userId);

    if (error) alert('Lỗi: ' + error.message);
    else {
      setEditingId(null);
      fetchUsers();
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa người dùng này khỏi danh sách nhân sự?')) return;

    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId);

    if (error) alert('Lỗi: ' + error.message);
    else fetchUsers();
  };

  if (currentProfile?.role !== 'admin') {
    return (
      <div className="glass-card" style={{ padding: '40px', textAlign: 'center' }}>
        <Shield size={48} color="var(--danger)" style={{ marginBottom: '16px' }} />
        <h2>Truy cập bị từ chối</h2>
        <p className="text-muted">Bạn không có quyền quản trị để xem trang này.</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1>Quản lý Người dùng & Phân quyền</h1>
          <p className="text-muted">Quản lý danh sách nhân sự và cấp quyền truy cập hệ thống.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
           <p className="text-muted" style={{ fontSize: '0.8rem', maxWidth: '200px', textAlign: 'right' }}>
             Lưu ý: Để tạo tài khoản mới, hãy sử dụng mục Authentication trên Supabase Dashboard.
           </p>
        </div>
      </div>

      <div className="glass-card" style={{ padding: '24px' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
            <Loader2 className="animate-spin" />
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Họ và Tên</th>
                  <th>Chức vụ (Role)</th>
                  <th>ID Người dùng</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ 
                          width: '32px', 
                          height: '32px', 
                          borderRadius: '50%', 
                          background: 'var(--border-color)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.8rem',
                          fontWeight: 600
                        }}>
                          {u.full_name?.charAt(0) || 'U'}
                        </div>
                        <span style={{ fontWeight: 600 }}>{u.full_name || 'Chưa đặt tên'}</span>
                      </div>
                    </td>
                    <td>
                      {editingId === u.id ? (
                        <select 
                          className="glass" 
                          style={{ padding: '4px 8px', borderRadius: '6px' }}
                          value={editRole}
                          onChange={(e) => setEditRole(e.target.value)}
                        >
                          <option value="admin">Admin</option>
                          <option value="doctor">Doctor</option>
                          <option value="nurse">Nurse</option>
                          <option value="receptionist">Receptionist</option>
                          <option value="staff">Staff</option>
                        </select>
                      ) : (
                        <span className={`badge ${u.role === 'admin' ? 'badge-danger' : 'badge-success'}`} style={{ textTransform: 'uppercase' }}>
                          {u.role}
                        </span>
                      )}
                    </td>
                    <td style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: 'var(--text-muted)' }}>
                      {u.id.substring(0, 18)}...
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {editingId === u.id ? (
                          <>
                            <button onClick={() => handleUpdateRole(u.id)} className="btn btn-ghost" style={{ padding: '6px', color: 'var(--success)' }}>
                              <Check size={18} />
                            </button>
                            <button onClick={() => setEditingId(null)} className="btn btn-ghost" style={{ padding: '6px', color: 'var(--danger)' }}>
                              <X size={18} />
                            </button>
                          </>
                        ) : (
                          <>
                            <button 
                              onClick={() => { setEditingId(u.id); setEditRole(u.role); }} 
                              className="btn btn-ghost" 
                              style={{ padding: '6px' }}
                              title="Sửa quyền"
                            >
                              <UserCog size={18} />
                            </button>
                            <button 
                              onClick={() => handleDeleteUser(u.id)} 
                              className="btn btn-ghost" 
                              style={{ padding: '6px', color: 'var(--danger)' }}
                              title="Xóa"
                              disabled={u.id === currentProfile?.id}
                            >
                              <Trash2 size={18} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;
