import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, User } from 'lucide-react';
import Input from '../shared/Input';
import Button from '../shared/Button';

interface AuthFormProps {
  type: 'login' | 'signup';
  onSubmit: (data: { email: string; password: string; name?: string }) => void;
  loading?: boolean;
}

const AuthForm: React.FC<AuthFormProps> = ({ type, onSubmit, loading }) => {
  const [formData, setFormData] = React.useState({
    email: '',
    password: '',
    name: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {type === 'login' ? 'Sign in to your account' : 'Create your account'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {type === 'login' ? (
              <>
                Or{' '}
                <Link to="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
                  create a new account
                </Link>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Sign in
                </Link>
              </>
            )}
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            {type === 'signup' && (
              <Input
                id="name"
                name="name"
                type="text"
                required
                placeholder="Full Name"
                icon={User}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            )}
            <Input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="Email address"
              icon={Mail}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete={type === 'login' ? 'current-password' : 'new-password'}
              required
              placeholder="Password"
              icon={Lock}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <div>
            <Button
              type="submit"
              variant="primary"
              className="w-full"
              loading={loading}
            >
              {type === 'login' ? 'Sign in' : 'Sign up'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthForm;