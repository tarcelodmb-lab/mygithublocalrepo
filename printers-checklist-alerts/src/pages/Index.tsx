import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import LoginForm, { LoginCredentials } from '@/components/LoginForm';
import SignupForm, { SignupData } from '@/components/SignupForm';
import AppLayout from '@/components/AppLayout';
import CustomerDashboard from '@/components/CustomerDashboard';
import AdminDashboard from '@/components/AdminDashboard';
import { AppProvider } from '@/contexts/AppContext';

const Index: React.FC = () => {
  const { isAuthenticated, user, login, signup } = useAuth();
  const [showSignup, setShowSignup] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (credentials: LoginCredentials) => {
    const success = login(credentials);
    if (!success) {
      setError('Invalid credentials. Please check your information or sign up for a new account.');
    } else {
      setError('');
    }
  };

  const handleSignup = async (credentials: SignupData) => {
    const success = await signup(credentials);
    if (!success) {
      setError('This serial number is already registered. Please check your serial number or contact support if you believe this is an error.');
    } else {
      setError('');
      setShowSignup(false);
    }
  };

  const handleShowSignup = () => {
    setShowSignup(true);
    setError('');
  };

  const handleBackToLogin = () => {
    setShowSignup(false);
    setError('');
  };

  if (!isAuthenticated) {
    if (showSignup) {
      return (
        <SignupForm 
          onSignup={handleSignup} 
          onShowLogin={handleBackToLogin}
          error={error}
        />
      );
    }
    return (
      <LoginForm 
        onLogin={handleLogin} 
        onShowSignup={handleShowSignup}
        error={error}
      />
    );
  }

  return (
    <AppProvider>
      <AppLayout>
        {user?.role === 'admin' ? <AdminDashboard /> : <CustomerDashboard />}
      </AppLayout>
    </AppProvider>
  );
};

export default Index;