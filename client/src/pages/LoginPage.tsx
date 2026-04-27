import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary/20 via-background to-accent/10 items-center justify-center p-12 border-r border-border relative overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
        <div className="relative z-10 max-w-md">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-glow">
              <Zap size={20} className="text-white" />
            </div>
            <span className="font-bold text-2xl gradient-text">Planora</span>
          </div>
          <h2 className="text-4xl font-bold text-text-primary mb-4 leading-tight">
            Your AI productivity
            <span className="block gradient-text">co-pilot awaits.</span>
          </h2>
          <p className="text-text-secondary leading-relaxed">
            Set goals, get AI-generated tasks, and follow intelligent daily plans — all in one beautiful workspace.
          </p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md"
        >
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <Zap size={16} className="text-white" />
            </div>
            <span className="font-bold text-xl gradient-text">Planora</span>
          </div>

          <h1 className="text-3xl font-bold text-text-primary mb-2">Welcome back</h1>
          <p className="text-text-secondary mb-8">Sign in to continue your journey</p>

          <form onSubmit={handleSubmit} className="space-y-5" id="login-form">
            <Input
              label="Email address"
              type="email"
              id="login-email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="you@example.com"
              leftIcon={<Mail size={16} />}
              required
            />
            <div className="flex flex-col gap-1.5">
              <label htmlFor="login-password" className="text-sm font-medium text-text-secondary">
                Password
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
                  <Lock size={16} />
                </span>
                <input
                  id="login-password"
                  type={showPw ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  className="input-field pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-danger text-sm bg-danger/10 border border-danger/20 rounded-input px-3 py-2"
              >
                {error}
              </motion.p>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              className="w-full"
              id="login-submit-btn"
            >
              Sign in
            </Button>
          </form>

          <p className="text-center text-text-secondary mt-6 text-sm">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary-light hover:underline font-medium" id="login-to-signup-link">
              Create one free
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};
