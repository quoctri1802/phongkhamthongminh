import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  MoreVertical, 
  AlertCircle,
  Trash2
} from 'lucide-react';
import { mockData, supabase } from '../lib/supabase';

const Inventory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', category: '', stock: 0, unit: '', expiry: '', purchasePrice: 0, sellingPrice: 0 });

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('inventory').select('*').order('item_name');
    if (!error && data && data.length > 0) {
      setItems(data.map(d => ({
        id: d.id,
        name: d.item_name,
        category: d.category,
        stock: d.quantity,
        unit: d.unit,
        expiry: d.expiry_date,
        purchasePrice: d.purchase_price,
        sellingPrice: d.selling_price
      })));
    } else {
      setItems(mockData.inventoryItems); // Fallback to mock
    }
    setLoading(false);
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('inventory').insert([{
      item_name: newItem.name,
      category: newItem.category,
      quantity: newItem.stock,
      unit: newItem.unit,
      expiry_date: newItem.expiry,
      purchase_price: newItem.purchasePrice,
      selling_price: newItem.sellingPrice
    }]);

    if (error) alert(error.message);
    else {
      setShowAddForm(false);
      fetchInventory();
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Xóa vật tư này?')) return;
    const { error } = await supabase.from('inventory').delete().eq('id', id);
    if (error) alert(error.message);
    else fetchInventory();
  };

  return (
    <div>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-end', 
        marginBottom: '32px' 
      }}>
        <div>
          <h1 style={{ marginBottom: '8px' }}>Kho dược & Vật tư</h1>
          <p className="text-muted">Quản lý tồn kho, nhập xuất và cảnh báo hạn sử dụng.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-ghost" style={{ border: '1px solid var(--border-color)' }}>
            <Download size={18} /> Xuất báo cáo
          </button>
          <button className="btn btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
            <Plus size={18} /> {showAddForm ? 'Hủy bỏ' : 'Thêm vật tư'}
          </button>
        </div>
      </div>

      {showAddForm && (
        <div className="glass-card" style={{ padding: '24px', marginBottom: '24px' }}>
          <h3>Thêm vật tư mới</h3>
          <form onSubmit={handleAddItem} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginTop: '16px' }}>
            <input className="glass" style={{ padding: '10px' }} placeholder="Tên thuốc/vật tư" required onChange={e => setNewItem({...newItem, name: e.target.value})} />
            <input className="glass" style={{ padding: '10px' }} placeholder="Danh mục" onChange={e => setNewItem({...newItem, category: e.target.value})} />
            <input className="glass" style={{ padding: '10px' }} type="number" placeholder="Giá nhập (VNĐ)" required onChange={e => setNewItem({ ...newItem, purchasePrice: parseInt(e.target.value) })} />
            <input className="glass" style={{ padding: '10px' }} type="number" placeholder="Giá bán (VNĐ)" required onChange={e => setNewItem({ ...newItem, sellingPrice: parseInt(e.target.value) })} />
            <input className="glass" style={{ padding: '10px' }} type="number" placeholder="Số lượng" onChange={e => setNewItem({...newItem, stock: parseInt(e.target.value)})} />
            <input className="glass" style={{ padding: '10px' }} placeholder="Đơn vị (Viên, Hộp...)" onChange={e => setNewItem({...newItem, unit: e.target.value})} />
            <input className="glass" style={{ padding: '10px' }} type="date" placeholder="Hạn sử dụng" onChange={e => setNewItem({...newItem, expiry: e.target.value})} />
            <button className="btn btn-primary" type="submit">Lưu lại</button>
          </form>
        </div>
      )}

      <div className="glass-card" style={{ padding: '24px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
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
              placeholder="Tìm kiếm theo tên thuốc, lô sản xuất..." 
              className="glass"
              style={{ 
                width: '100%', 
                padding: '10px 10px 10px 40px', 
                borderRadius: '10px',
                outline: 'none'
              }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="btn btn-ghost" style={{ border: '1px solid var(--border-color)' }}>
            <Filter size={18} /> Lọc
          </button>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Tên vật tư</th>
                <th>Danh mục</th>
                <th>Mã SKU</th>
                <th>Số lượng</th>
                <th>Đơn vị</th>
                <th>Hạn dùng</th>
                <th>Trạng thái</th>
                <th>Giá nhập</th>
                <th>Giá bán</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{item.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Lô: BN-2024-X</div>
                  </td>
                  <td>{item.category}</td>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>MED-{1000 + item.id}</td>
                  <td>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px',
                      color: item.stock < 20 ? 'var(--danger)' : 'inherit',
                      fontWeight: item.stock < 20 ? 600 : 400
                    }}>
                      {item.stock < 20 && <AlertCircle size={14} />}
                      {item.stock}
                    </div>
                  </td>
                  <td>{item.unit}</td>
                  <td>{item.expiry}</td>
                  <td>
                    <span className={`badge ${item.stock < 20 ? 'badge-danger' : 'badge-success'}`}>
                      {item.stock < 20 ? 'Cần nhập' : 'Còn hàng'}
                    </span>
                  </td>
                  <td>
                    <button className="btn btn-ghost" style={{ padding: '4px', color: 'var(--danger)' }} onClick={() => handleDelete(item.id)}>
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
        <div className="glass-card" style={{ padding: '20px', borderLeft: '4px solid var(--primary)' }}>
          <p className="text-muted" style={{ fontSize: '0.8rem' }}>Tổng giá trị kho</p>
          <h2 style={{ margin: '8px 0 0' }}>1.240.500.000đ</h2>
        </div>
        <div className="glass-card" style={{ padding: '20px', borderLeft: '4px solid var(--warning)' }}>
          <p className="text-muted" style={{ fontSize: '0.8rem' }}>Vật tư sắp hết hạn</p>
          <h2 style={{ margin: '8px 0 0' }}>08 loại</h2>
        </div>
        <div className="glass-card" style={{ padding: '20px', borderLeft: '4px solid var(--success)' }}>
          <p className="text-muted" style={{ fontSize: '0.8rem' }}>Nhập kho tháng này</p>
          <h2 style={{ margin: '8px 0 0' }}>+124.2M</h2>
        </div>
      </div>
    </div>
  );
};

export default Inventory;
