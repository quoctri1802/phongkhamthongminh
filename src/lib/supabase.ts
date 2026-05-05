import { createClient } from '@supabase/supabase-js';

// These should be in .env for production
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper to check if supabase is actually configured
export const isSupabaseConfigured = () => {
  return import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY;
};

// Mock Data for demonstration
export const mockData = {
  stats: [
    { label: 'Tổng bệnh nhân', value: '1,284', change: '+12%', trend: 'up' },
    { label: 'Lịch hẹn hôm nay', value: '42', change: '+5%', trend: 'up' },
    { label: 'Doanh thu tháng', value: '425.5M', change: '+18%', trend: 'up' },
    { label: 'Tồn kho cảnh báo', value: '12', change: '-2', trend: 'down' },
  ],
  recentAppointments: [
    { id: 1, patient: 'Nguyễn Văn A', time: '09:00 AM', type: 'Khám tổng quát', status: 'completed' },
    { id: 2, patient: 'Trần Thị B', time: '10:30 AM', type: 'Nội soi', status: 'pending' },
    { id: 3, patient: 'Lê Văn C', time: '02:00 PM', type: 'Tư vấn', status: 'cancelled' },
    { id: 4, patient: 'Phạm Minh D', time: '03:15 PM', type: 'X-Quang', status: 'pending' },
  ],
  inventoryItems: [
    { id: 1, name: 'Paracetamol 500mg', category: 'Thuốc giảm đau', stock: 500, unit: 'Viên', expiry: '2027-12-01' },
    { id: 2, name: 'Amoxicillin', category: 'Kháng sinh', stock: 15, unit: 'Hộp', expiry: '2026-05-15' }, // Low stock
    { id: 3, name: 'Gạc y tế', category: 'Vật tư', stock: 120, unit: 'Gói', expiry: '2028-01-10' },
  ]
};
