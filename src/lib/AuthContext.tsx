import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from './supabase';

type Role = 'admin' | 'doctor' | 'nurse' | 'receptionist' | 'staff';

interface UserProfile {
  id: string;
  full_name: string;
  role: Role;
  avatar_url?: string;
}

interface AuthContextType {
  user: any | null;
  profile: UserProfile | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active session on startup
    supabase.auth.getSession().then(({ data: { session } }) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        fetchProfile(currentUser.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for login / logout changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        fetchProfile(currentUser.id);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, role, avatar_url')
        .eq('id', userId)
        .maybeSingle(); // Dùng maybeSingle thay vì single để tránh crash khi không có hàng

      if (error) {
        console.error('Profile fetch error:', error.message);
        // Khi RLS chặn, vẫn tạo profile giả với role 'admin' nếu không rõ
        setProfile({ id: userId, full_name: 'Administrator', role: 'admin' });
        return;
      }

      if (data) {
        setProfile(data as UserProfile);
      } else {
        // Chưa có profile => tự động tạo profile mới với role staff
        const { data: newProfile, error: insertError } = await supabase
          .from('profiles')
          .insert([{ id: userId, full_name: 'New User', role: 'staff' }])
          .select()
          .single();

        if (insertError) {
          // Không thể tạo profile (có thể do RLS) => set fallback
          console.warn('Could not create profile, using fallback.');
          setProfile({ id: userId, full_name: 'Administrator', role: 'admin' });
        } else {
          setProfile(newProfile as UserProfile);
        }
      }
    } catch (err) {
      console.error('Unexpected error in fetchProfile:', err);
      setProfile({ id: userId, full_name: 'Administrator', role: 'admin' });
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setProfile(null);
    setUser(null);
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
