import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User } from 'lucide-react';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const res = await fetch('http://127.0.0.1:5000/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        localStorage.setItem('isAdmin', 'true');
        localStorage.setItem('adminToken', data.token);
        navigate('/admin');
      } else {
        setError(data.error || 'Invalid username or password.');
      }
    } catch (err) {
      console.error('Admin login failed:', err);
      setError('Could not reach the server. Is the backend running?');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-ink text-bone flex items-center justify-center px-4">
      <div className="w-full max-w-sm p-8 rounded-3xl border border-white/10 bg-white/[0.02]">
        <div className="flex flex-col items-center mb-6">
          <div className="h-12 w-12 rounded-2xl bg-volt/10 text-volt flex items-center justify-center mb-4">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-black font-display uppercase tracking-tight text-bone">Admin Access</h1>
          <p className="text-xs text-ash mt-1">Sign in to manage the store</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ash" />
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-white/[0.03] border border-white/10 text-sm text-bone placeholder:text-ash focus:outline-none focus:border-volt/50"
              autoFocus
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ash" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-white/[0.03] border border-white/10 text-sm text-bone placeholder:text-ash focus:outline-none focus:border-volt/50"
            />
          </div>

          {error && <p className="text-xs font-semibold text-rose-400">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl bg-volt text-ink text-xs font-mono font-bold uppercase tracking-wider hover:bg-bone transition-all cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}