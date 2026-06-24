import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const { register, authLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      toast.error('Complete all fields to continue.');
      return;
    }

    try {
      await register(formData);
      navigate('/dashboard');
      toast.success('Account created successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(236,72,153,0.14),_transparent_32%),linear-gradient(180deg,_#020617_0%,_#111827_100%)] px-4 py-10 text-slate-100 sm:px-6 lg:px-10">
      <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[36px] border border-slate-800 bg-slate-950/90 p-10 shadow-2xl shadow-slate-950/30">
          <div className="space-y-6">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-pink-300">Create account</p>
              <h1 className="mt-3 text-4xl font-semibold text-white">Start tracking expenses</h1>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Full name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Jane Doe"
              />
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
                {authLoading ? 'Creating account...' : 'Create account'}
              </Button>
              <Button type="submit" className="w-full" disabled={authLoading}>
                {authLoading ? 'Creating account...' : 'Create account'}
              </Button>
            </form>
          </div>
          <p className="mt-8 text-sm text-slate-500">
            Already have an account? <Link to="/login" className="font-semibold text-pink-300 hover:text-pink-200">Sign in</Link>
          </p>
        </div>

        <div className="hidden rounded-[36px] border border-slate-800 bg-gradient-to-br from-slate-900/80 to-slate-950/90 p-10 shadow-2xl shadow-slate-950/30 lg:block">
          <div className="rounded-[28px] border border-slate-700 bg-slate-950/90 p-8">
            <h2 className="text-2xl font-semibold text-white">Finance planning made simple</h2>
            <p className="mt-4 text-slate-400">Flexible budget categories, smooth analytics, and an elegant dashboard experience for every device.</p>
            <div className="mt-8 space-y-4">
              <div className="rounded-3xl bg-slate-900/80 p-4">
                <p className="text-sm text-slate-400">Built with modern reusable React components.</p>
              </div>
              <div className="rounded-3xl bg-slate-900/80 p-4">
                <p className="text-sm text-slate-400">Dark mode ready with Tailwind utility classes.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
