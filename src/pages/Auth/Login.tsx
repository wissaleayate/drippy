import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LogIn, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import logo from '../../imports/drippy logo.png';

export default function LoginPage() {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  function validate() {
    const e: typeof errors = {};
    if (!email.trim()) e.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Enter a valid email address.';
    if (!password) e.password = 'Password is required.';
    else if (password.length < 6) e.password = 'Password must be at least 6 characters.';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    try {
      await login(email.trim(), password);
      toast.success('Welcome back! You\'re logged in.');
      navigate('/');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Login failed. Please try again.';
      toast.error(message);
    }
  }

  return (
    <div className="min-h-screen bg-ink flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
        <Link to="/">
          <img src={logo} alt="Drippy" className="h-32 w-auto object-contain" />
        </Link>
        <Link
          to="/register"
          className="text-xs font-semibold tracking-[0.12em] uppercase text-ash hover:text-bone transition-colors"
          style={{ fontFamily: 'DM Mono, monospace' }}
        >
          Create account →
        </Link>
      </div>

      {/* Main */}
      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">
          {/* Badge */}
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.24em] text-volt">
            Welcome back
          </p>

          <h1 className="font-display text-5xl font-black uppercase leading-[0.9] text-bone mb-2">
            Sign In
          </h1>
          <p className="text-sm text-ash mb-10">
            Don't have an account?{' '}
            <Link to="/register" className="text-volt hover:underline font-semibold">
              Register 
            </Link>
          </p>

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-ash font-mono">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className={`w-full px-4 py-3.5 bg-white/[0.03] border rounded-xl text-sm text-bone placeholder:text-ash/40 outline-none transition-all focus:ring-2 focus:ring-volt/20 focus:border-volt/50 ${
                  errors.email ? 'border-rose-500/60' : 'border-white/10 hover:border-white/20'
                }`}
              />
              {errors.email && (
                <p className="text-xs text-rose-400 mt-0.5">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-ash font-mono">
                  Password
                </label>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full px-4 py-3.5 pr-12 bg-white/[0.03] border rounded-xl text-sm text-bone placeholder:text-ash/40 outline-none transition-all focus:ring-2 focus:ring-volt/20 focus:border-volt/50 ${
                    errors.password ? 'border-rose-500/60' : 'border-white/10 hover:border-white/20'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-4 flex items-center text-ash hover:text-bone transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-rose-400 mt-0.5">{errors.password}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 w-full flex items-center justify-center gap-2.5 px-6 py-3.5 bg-volt text-ink text-sm font-bold uppercase tracking-[0.12em] rounded-xl hover:bg-bone transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
              style={{ fontFamily: 'DM Mono, monospace' }}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing in…
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-8">
            <span className="flex-1 h-px bg-white/5" />
            <span className="text-xs text-ash font-mono">OR</span>
            <span className="flex-1 h-px bg-white/5" />
          </div>

          <p className="text-center text-xs text-ash/60">
            By continuing, you agree to Drippy's{' '}
            <span className="text-ash underline cursor-pointer">Terms of Service</span> and{' '}
            <span className="text-ash underline cursor-pointer">Privacy Policy</span>.
          </p>
        </div>
      </div>
    </div>
  );
}
