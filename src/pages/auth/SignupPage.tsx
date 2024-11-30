import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '../../components/auth/AuthForm';
import { useAuth } from '../../contexts/AuthContext';
import ErrorMessage from '../../components/shared/ErrorMessage';

const SignupPage: React.FC = () => {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignup = async (data: { email: string; password: string; name?: string }) => {
    if (!data.name) {
      setError('Name is required');
      return;
    }

    try {
      setError(null);
      setLoading(true);
      await signUp(data.email, data.password, data.name);
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Signup error:', err);
      if (err.message === 'User already registered') {
        setError('An account with this email already exists. Please try logging in instead.');
      } else {
        setError(err.message || 'Failed to create account. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {error && (
        <div className="max-w-md mx-auto mt-4">
          <ErrorMessage message={error} />
        </div>
      )}
      <AuthForm type="signup" onSubmit={handleSignup} loading={loading} />
    </>
  );
};

export default SignupPage;