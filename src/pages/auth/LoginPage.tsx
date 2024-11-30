import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '../../components/auth/AuthForm';
import { useAuth } from '../../contexts/AuthContext';
import { getRedirectUrl, clearRedirectUrl } from '../../utils/auth/storage';
import ErrorMessage from '../../components/shared/ErrorMessage';

const LoginPage: React.FC = () => {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setError(null);
  }, []);

  const handleLogin = async (data: { email: string; password: string }) => {
    try {
      setError(null);
      setLoading(true);
      await signIn(data.email, data.password);
      
      const redirectUrl = getRedirectUrl();
      clearRedirectUrl();
      navigate(redirectUrl, { replace: true });
    } catch (err: any) {
      console.error('Login error:', err);
      setError('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto pt-8 px-4">
        {error && <ErrorMessage message={error} />}
        <AuthForm type="login" onSubmit={handleLogin} loading={loading} />
      </div>
    </div>
  );
};

export default LoginPage;