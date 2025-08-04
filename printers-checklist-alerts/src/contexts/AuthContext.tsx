import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { LoginCredentials } from '@/components/LoginForm';
import { SignupData } from '@/components/SignupForm';
import { supabase } from '@/lib/supabase';

interface User extends LoginCredentials {
  id?: string;
  location?: string;
  department?: string;
  email?: string;
  role?: 'customer' | 'admin';
  timezone?: string;
  datePurchased?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  signup: (credentials: SignupData) => Promise<boolean>;
  logout: () => Promise<void>;
  updateUser: (updatedUser: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const getUserTimezone = () => {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  };

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      // Default admin user check
      if (credentials.companyName === 'CobraFlex' && 
          credentials.serialNumber === 'ADMIN001' && 
          credentials.operatorName === 'Administrator' && 
          credentials.password === 'admin123') {
        const adminUser: User = {
          id: 'admin-1',
          companyName: 'CobraFlex',
          serialNumber: 'ADMIN001',
          operatorName: 'Administrator',
          password: 'admin123',
          role: 'admin',
          timezone: getUserTimezone()
        };
        
        setUser(adminUser);
        setIsAuthenticated(true);
        localStorage.setItem('currentUser', JSON.stringify(adminUser));
        return true;
      }

      // Try Supabase lookup with fallback
      try {
        const { data: users, error } = await supabase
          .from('users')
          .select('*')
          .eq('company_name', credentials.companyName)
          .eq('serial_number', credentials.serialNumber)
          .eq('operator_name', credentials.operatorName);
        
        if (!error && users?.[0]) {
          const existingUser = users[0];
          const userTimezone = getUserTimezone();
          
          // Try to update login info, but don't fail if it doesn't work
          try {
            await supabase
              .from('users')
              .update({ 
                last_login: new Date().toISOString(),
                timezone: userTimezone
              })
              .eq('id', existingUser.id);
            
            await supabase
              .from('user_sessions')
              .insert({
                user_id: existingUser.id,
                login_time: new Date().toISOString(),
                timezone: userTimezone,
                ip_address: 'unknown',
                user_agent: navigator.userAgent
              });
          } catch (updateError) {
            console.warn('Session update failed:', updateError);
          }
          
          const userObj: User = {
            id: existingUser.id,
            companyName: existingUser.company_name,
            serialNumber: existingUser.serial_number,
            operatorName: existingUser.operator_name,
            password: credentials.password,
            role: existingUser.role,
            timezone: userTimezone,
            email: existingUser.email,
            location: existingUser.location,
            department: existingUser.department
          };
          
          setUser(userObj);
          setIsAuthenticated(true);
          localStorage.setItem('currentUser', JSON.stringify(userObj));
          return true;
        }
      } catch (dbError) {
        console.warn('Database lookup failed, using local auth:', dbError);
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const signup = async (credentials: SignupData): Promise<boolean> => {
    try {
      const userTimezone = getUserTimezone();
      
      try {
        // First check if serial number already exists
        const { data: existingUsers, error: checkError } = await supabase
          .from('users')
          .select('serial_number')
          .eq('serial_number', credentials.serialNumber);
        
        if (!checkError && existingUsers && existingUsers.length > 0) {
          // Serial number already exists
          return false;
        }
        
        const { data, error } = await supabase
          .from('users')
          .insert({
            company_name: credentials.companyName,
            serial_number: credentials.serialNumber,
            operator_name: credentials.operatorName,
            role: 'customer',
            timezone: userTimezone,
            created_at: new Date().toISOString(),
            date_purchased: credentials.datePurchased
          })
          .select()
          .single();
        
        if (!error && data) {
          try {
            await supabase
              .from('user_sessions')
              .insert({
                user_id: data.id,
                login_time: new Date().toISOString(),
                timezone: userTimezone,
                ip_address: 'unknown',
                user_agent: navigator.userAgent
              });
          } catch (sessionError) {
            console.warn('Session creation failed:', sessionError);
          }
          
          const newUser: User = {
            id: data.id,
            companyName: credentials.companyName,
            serialNumber: credentials.serialNumber,
            operatorName: credentials.operatorName,
            password: credentials.password,
            role: 'customer',
            timezone: userTimezone,
            datePurchased: credentials.datePurchased
          };
          
          setUser(newUser);
          setIsAuthenticated(true);
          localStorage.setItem('currentUser', JSON.stringify(newUser));
          return true;
        }
      } catch (dbError) {
        console.warn('Database signup failed, using local signup:', dbError);
      }
      
      
      // Fallback to local storage - also check for duplicates in localStorage
      const existingUsers = localStorage.getItem('localUsers');
      if (existingUsers) {
        const users = JSON.parse(existingUsers);
        const duplicateSerial = users.find((u: any) => u.serialNumber === credentials.serialNumber);
        if (duplicateSerial) {
          return false;
        }
      }
      
      const newUser: User = {
        id: `local-${Date.now()}`,
        companyName: credentials.companyName,
        serialNumber: credentials.serialNumber,
        operatorName: credentials.operatorName,
        password: credentials.password,
        role: 'customer',
        timezone: userTimezone,
        datePurchased: credentials.datePurchased
      };
      
      // Store in local users list for duplicate checking
      const localUsers = existingUsers ? JSON.parse(existingUsers) : [];
      localUsers.push(newUser);
      localStorage.setItem('localUsers', JSON.stringify(localUsers));
      
      setUser(newUser);
      setIsAuthenticated(true);
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    }
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
  };

  const logout = async () => {
    if (user?.id && !user.id.startsWith('local-') && !user.id.startsWith('admin-')) {
      try {
        await supabase
          .from('user_sessions')
          .update({ logout_time: new Date().toISOString() })
          .eq('user_id', user.id)
          .is('logout_time', null)
          .order('login_time', { ascending: false })
          .limit(1);
      } catch (error) {
        console.warn('Logout session update failed:', error);
      }
    }
    
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('currentUser');
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user, 
      login, 
      signup, 
      logout, 
      updateUser 
    }}>
      {children}
    </AuthContext.Provider>
  );
};