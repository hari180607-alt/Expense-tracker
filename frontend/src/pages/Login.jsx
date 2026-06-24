import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  const { login, authLoading } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error('Please enter your email and password.');
      return;
    }

    try {
      await login(formData);
      navigate('/dashboard');
      toast.success('Welcome back!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Authentication failed');
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.14),_transparent_32%),linear-gradient(180deg,_#020617_0%,_#111827_100%)] px-4 py-10 text-slate-100 sm:px-6 lg:px-10">
      <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[36px] border border-slate-800 bg-slate-950/90 p-10 shadow-2xl shadow-slate-950/30">
          <div className="space-y-6">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-cyan-300">Sign in</p>
              <h1 className="mt-3 text-4xl font-semibold text-white">Welcome back</h1>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="you@example.com"
              />
              <Input
                label="Password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
              />
              <Button type="submit" className="w-full" disabled={authLoading}>
                {authLoading ? 'Signing in...' : 'Sign in'}
              </Button>
            </form>
          </div>
          <p className="mt-8 text-sm text-slate-500">
            Don&apos;t have an account? <Link to="/register" className="font-semibold text-cyan-400 hover:text-cyan-200">Create one</Link>
          </p>
        </div>

        <div className="hidden rounded-[36px] border border-slate-800 bg-gradient-to-br from-slate-900/80 to-slate-950/90 p-10 shadow-2xl shadow-slate-950/30 lg:block">
          <div className="rounded-[28px] border border-slate-700 bg-slate-950/90 p-8">
            <h2 className="text-2xl font-semibold text-white">Track every expense</h2>
            <p className="mt-4 text-slate-400">Use a smart dashboard to manage budgets, analyze spending, and stay on top of your finances with confidence.</p>
            <div className="mt-8 space-y-4">
              <div className="rounded-3xl bg-slate-900/80 p-4">
                <p className="text-sm text-slate-400">Secure login with JWT-ready architecture</p>
              </div>
              <div className="rounded-3xl bg-slate-900/80 p-4">
                <p className="text-sm text-slate-400">Responsive UI built for mobile and desktop</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
