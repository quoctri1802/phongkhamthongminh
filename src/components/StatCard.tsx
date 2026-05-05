import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: React.ReactNode;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, change, trend, icon, color }) => {
  return (
    <div className="glass-card stat-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div className="stat-icon" style={{ background: `${color}20`, color: color }}>
          {icon}
        </div>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '4px', 
          fontSize: '0.75rem', 
          fontWeight: 600,
          color: trend === 'up' ? 'var(--success)' : 'var(--danger)',
          background: trend === 'up' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
          padding: '4px 8px',
          borderRadius: '20px'
        }}>
          {trend === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {change}
        </div>
      </div>
      <p className="text-muted" style={{ marginTop: '8px', fontSize: '0.9rem' }}>{label}</p>
      <h2 style={{ margin: '4px 0 0', fontSize: '1.75rem' }}>{value}</h2>
    </div>
  );
};

export default StatCard;
