import { useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import type { useAuth } from '../../hooks/useAuth';

type AuthFns = Pick<ReturnType<typeof useAuth>, 'signInWithEmail' | 'signUpWithEmail'>;

export function AuthPage({ signInWithEmail, signUpWithEmail }: AuthFns) {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === 'login') {
        const { error } = await signInWithEmail(email, password);
        if (error) throw error;
      } else {
        if (!fullName.trim()) { toast.error('Enter your name'); return; }
        const { error } = await signUpWithEmail(email, password, fullName);
        if (error) throw error;
        toast.success('Account created! You can now log in.');
        setMode('login');
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-zinc-950">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
        <div className="flex items-center gap-2 justify-center mb-8">
          <div className="p-2 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <Briefcase size={20} className="text-blue-400" />
          </div>
          <span className="text-xl font-bold text-zinc-100">Trackr</span>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h1 className="text-lg font-semibold text-zinc-100 mb-1">
            {mode === 'login' ? 'Welcome back' : 'Create account'}
          </h1>
          <p className="text-sm text-zinc-500 mb-6">
            {mode === 'login' ? 'Sign in to your job tracker' : 'Start tracking your job applications'}
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Full Name</label>
                <input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your Name"
                  required className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-blue-500 transition-colors" />
              </div>
            )}
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com"
                required className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-blue-500 transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" required minLength={6}
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-blue-500 transition-colors" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors">
              {loading && <Loader2 size={14} className="animate-spin" />}
              {mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>
          <p className="text-center text-sm text-zinc-500 mt-4">
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button onClick={() => setMode(mode === 'login' ? 'signup' : 'login')} className="text-blue-400 hover:text-blue-300">
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
