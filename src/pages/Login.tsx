import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Stethoscope, LogIn, Mail, Lock, Loader2 } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) setError(error.message);
    setLoading(false);
  };

  return (
    <div className="login-bg">
      <div className="login-overlay">
        <div className="glass-card" style={{ padding: '40px', width: '100%', maxWidth: '400px' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{
              width: '60px',
              height: '60px',
              background: 'var(--primary)',
              borderRadius: '16px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              marginBottom: '16px'
            }}>
              <Stethoscope size={32} />
            </div>
            <h1>SmartMed</h1>
            <p className="text-muted">Đăng nhập để quản lý phòng khám</p>
          </div>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="email"
                placeholder="Email"
                className="glass"
                style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '10px', outline: 'none' }}
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="password"
                placeholder="Mật khẩu"
                className="glass"
                style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '10px', outline: 'none' }}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p style={{ color: 'var(--danger)', fontSize: '0.85rem' }}>{error}</p>}
            <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
              {loading ? <Loader2 size={20} className="animate-spin" /> : <><LogIn size={20} /> Đăng nhập</>}
            </button>
          </form>
          <p className="text-muted" style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.8rem' }}>
            Quên mật khẩu? Liên hệ quản trị viên.
          </p>
        </div>
      </div>
    </div>
  );
    <div className="login-bg">
  <div className="login-overlay">
    <div style={{
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div className="glass-card" style={{ padding: '40px', width: '100%', maxWidth: '400px' }}>
        {/* ... rest of content unchanged ... */
      <div className="glass-card" style={{ padding: '40px', width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ 
            width: '60px', 
            height: '60px', 
            background: 'var(--primary)', 
            borderRadius: '16px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            marginBottom: '16px'
          }}>
            <Stethoscope size={32} />
          </div>
          <h1>SmartMed</h1>
          <p className="text-muted">Đăng nhập để quản lý phòng khám</p>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ position: 'relative' }}>
            <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="email" 
              placeholder="Email" 
              className="glass"
              style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '10px', outline: 'none' }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div style={{ position: 'relative' }}>
            <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="password" 
              placeholder="Mật khẩu" 
              className="glass"
              style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '10px', outline: 'none' }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p style={{ color: 'var(--danger)', fontSize: '0.85rem' }}>{error}</p>}

          <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
            {loading ? <Loader2 size={20} className="animate-spin" /> : <><LogIn size={20} /> Đăng nhập</>}
          </button>
        </form>

        <p className="text-muted" style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.8rem' }}>
          Quên mật khẩu? Liên hệ quản trị viên.
        </p>
      </div>
    </div>
  );
};

export default Login;
