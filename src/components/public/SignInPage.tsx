import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  LogIn,
  ArrowLeft,
  AlertCircle,
  Eye,
  EyeOff,
  ShieldCheck,
  Lock,
} from 'lucide-react';

interface SignInPageProps {
  onBackToIndex: () => void;
  onLoginSuccess: () => void;
}

export const SignInPage: React.FC<SignInPageProps> = ({
  onBackToIndex,
  onLoginSuccess,
}) => {
  const { login, settings } = useApp();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!username.trim() || !password.trim()) {
      setErrorMsg('Please enter both your username and password.');
      return;
    }

    const success = login(username.trim(), password);
    if (success) {
      onLoginSuccess();
    } else {
      setErrorMsg('Invalid credentials. Please verify your username and password or contact the administrator.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-between p-4 sm:p-6 md:p-8 selection:bg-slate-800 selection:text-white">
      {/* Top Header Link */}
      <div className="max-w-md mx-auto w-full flex items-center justify-between py-2">
        <button
          onClick={onBackToIndex}
          className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Home</span>
        </button>

        <span className="text-xs font-mono text-slate-400">
          Session {settings.activeSession}
        </span>
      </div>

      {/* Centered Clean Login Card */}
      <div className="max-w-md mx-auto w-full my-auto">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col items-center text-center mb-6">
            <img
              src="/iqra_logo.jpg"
              alt="Logo"
              className="h-16 w-16 rounded-xl object-contain border border-slate-200 dark:border-slate-700 p-1 bg-white shadow-2xs mb-3"
              onError={(e) => {
                e.currentTarget.src = '/public/iqra_logo.jpg';
              }}
            />
            <h2 className="text-xl font-serif font-black tracking-tight text-slate-900 dark:text-slate-100">
              Staff & Student Portal
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {settings.schoolName || 'Iqra School and College Garhi Kapura Mardan'}
            </p>
          </div>

          {errorMsg && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-medium text-rose-800 dark:border-rose-900 dark:bg-rose-950/50 dark:text-rose-300 flex items-start gap-2 mb-4">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Username or Email:
              </label>
              <input
                type="text"
                required
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter authorized username"
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-900 focus:border-slate-800 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Password:
                </label>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your security password"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 pr-10 text-xs text-slate-900 focus:border-slate-800 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-white px-5 py-3 text-xs md:text-sm font-bold text-white shadow-xs transition-all cursor-pointer mt-2"
            >
              <LogIn className="h-4 w-4" />
              <span>Sign In</span>
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center gap-1.5 text-xs text-slate-400 text-center">
            <Lock className="h-3.5 w-3.5" />
            <span>Authorized access only · Protected portal session</span>
          </div>
        </div>

        {/* Discreet administrative note */}
        <div className="text-center text-xs text-slate-400 mt-4">
          For login assistance, please contact the Principal Office (Sir Imran).
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-md mx-auto w-full text-center text-xs text-slate-400 pt-6">
        © {new Date().getFullYear()} {settings.schoolName || 'Iqra School and College Garhi Kapura Mardan'}
      </div>
    </div>
  );
};
