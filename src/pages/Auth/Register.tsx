import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, UserPlus, Loader2, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { useLang } from '../../context/LanguageContext';
import logo from '../../imports/drippy logo.png';

export default function RegisterPage() {
  const { register, isLoading } = useAuth();
  const { t } = useLang();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const passwordStrength = (() => {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  })();

  const strengthLabel = ['', t.reg_strength_weak, t.reg_strength_fair, t.reg_strength_good, t.reg_strength_strong][passwordStrength];
  const strengthColor = ['', 'bg-rose-500', 'bg-amber-400', 'bg-yellow-300', 'bg-volt'][passwordStrength];

  function validate() {
    const e: typeof errors = {};
    if (!name.trim()) e.name = t.reg_err_name_required;
    else if (name.trim().length < 2) e.name = t.reg_err_name_short;
    if (!email.trim()) e.email = t.reg_err_email_required;
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = t.reg_err_email_invalid;
    if (!password) e.password = t.reg_err_password_required;
    else if (password.length < 6) e.password = t.reg_err_password_short;
    if (!confirmPassword) e.confirmPassword = t.reg_err_confirm_required;
    else if (confirmPassword !== password) e.confirmPassword = t.reg_err_confirm_mismatch;
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    try {
      await register(name.trim(), email.trim(), password);
      toast.success(t.reg_submit === 'Create Account' ? 'Account created! Welcome to Drippy.' : t.reg_submit);
      navigate('/');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Registration failed. Please try again.';
      toast.error(message);
    }
  }

  return (
    <div className="min-h-screen bg-ink flex flex-col">
      <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-white/5">
        <Link to="/"><img src={logo} alt="Drippy" className="h-28 sm:h-32 w-auto object-contain" /></Link>
        <Link to="/login" className="text-xs font-semibold tracking-[0.12em] uppercase text-ash hover:text-bone transition-colors" style={{ fontFamily: 'DM Mono, monospace' }}>
          {t.reg_sign_in} →
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 py-12 sm:py-16">
        <div className="w-full max-w-md">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.24em] text-volt">{t.reg_eyebrow}</p>
          <h1 className="font-display text-4xl sm:text-5xl font-black uppercase leading-[0.9] text-bone mb-2">{t.reg_heading}</h1>
          <p className="text-sm text-ash mb-8 sm:mb-10">
            {t.reg_have_account}{' '}
            <Link to="/login" className="text-volt hover:underline font-semibold">{t.reg_sign_in}</Link>
          </p>

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-ash font-mono">{t.reg_name}</label>
              <input id="name" type="text" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} placeholder=""
                className={`w-full px-4 py-3.5 bg-white/[0.03] border rounded-xl text-sm text-bone placeholder:text-ash/40 outline-none transition-all focus:ring-2 focus:ring-volt/20 focus:border-volt/50 ${errors.name ? 'border-rose-500/60' : 'border-white/10 hover:border-white/20'}`}
              />
              {errors.name && <p className="text-xs text-rose-400 mt-0.5">{errors.name}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-ash font-mono">{t.reg_email}</label>
              <input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com"
                className={`w-full px-4 py-3.5 bg-white/[0.03] border rounded-xl text-sm text-bone placeholder:text-ash/40 outline-none transition-all focus:ring-2 focus:ring-volt/20 focus:border-volt/50 ${errors.email ? 'border-rose-500/60' : 'border-white/10 hover:border-white/20'}`}
              />
              {errors.email && <p className="text-xs text-rose-400 mt-0.5">{errors.email}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-ash font-mono">{t.reg_password}</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
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

              {/* Password strength */}
              {password && (
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex gap-1 flex-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                          i <= passwordStrength ? strengthColor : 'bg-white/5'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] font-bold font-mono text-ash">{strengthLabel}</span>
                </div>
              )}
              {errors.password && <p className="text-xs text-rose-400 mt-0.5">{errors.password}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="confirmPassword" className="text-xs font-bold uppercase tracking-wider text-ash font-mono">{t.reg_confirm_password}</label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirm ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full px-4 py-3.5 pr-12 bg-white/[0.03] border rounded-xl text-sm text-bone placeholder:text-ash/40 outline-none transition-all focus:ring-2 focus:ring-volt/20 focus:border-volt/50 ${
                    errors.confirmPassword
                      ? 'border-rose-500/60'
                      : confirmPassword && confirmPassword === password
                      ? 'border-volt/40'
                      : 'border-white/10 hover:border-white/20'
                  }`}
                />
                <div className="absolute inset-y-0 right-4 flex items-center gap-1.5">
                  {confirmPassword && confirmPassword === password && (
                    <Check className="w-3.5 h-3.5 text-volt" />
                  )}
                  <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    className="text-ash hover:text-bone transition-colors"
                    tabIndex={-1}
                  >
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-rose-400 mt-0.5">{errors.confirmPassword}</p>
              )}
            </div>

            <button type="submit" disabled={isLoading} className="mt-2 w-full flex items-center justify-center gap-2.5 px-6 py-3.5 bg-volt text-ink text-sm font-bold uppercase tracking-[0.12em] rounded-xl hover:bg-bone transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer" style={{ fontFamily: 'DM Mono, monospace' }}>
              {isLoading ? (<><Loader2 className="w-4 h-4 animate-spin" />{t.reg_submitting}</>) : (<><UserPlus className="w-4 h-4" />{t.reg_submit}</>)}
            </button>
          </form>

          <div className="flex items-center gap-4 my-8">
            <span className="flex-1 h-px bg-white/5" />
            <span className="text-xs text-ash font-mono">{t.reg_or}</span>
            <span className="flex-1 h-px bg-white/5" />
          </div>

          <p className="text-center text-xs text-ash/60">
            {t.reg_agree}{' '}
            <span className="text-ash underline cursor-pointer">{t.reg_terms}</span> and{' '}
            <span className="text-ash underline cursor-pointer">{t.reg_privacy}</span>.
          </p>
        </div>
      </div>
    </div>
  );
}
