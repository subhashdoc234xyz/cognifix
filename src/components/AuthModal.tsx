import React, { useState } from 'react';
import { UserProfile } from '../types';
import { Sparkles, Eye, EyeOff, X, Lock, Mail } from 'lucide-react';

const GoogleMark = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
    <path fill="#4285F4" d="M21.35 12.23c0-.71-.06-1.22-.2-1.75H12v3.45h5.37c-.11.86-.73 2.15-2.1 3.02l-.02.12 3.05 2.36.21.02c1.94-1.79 2.84-4.42 2.84-7.22Z" />
    <path fill="#34A853" d="M12 21.7c2.63 0 4.84-.87 6.45-2.36l-3.07-2.38c-.82.57-1.92.97-3.38.97a5.85 5.85 0 0 1-5.52-4.04l-.11.01-3.18 2.45-.04.11A9.75 9.75 0 0 0 12 21.7Z" />
    <path fill="#FBBC05" d="M6.48 13.89A5.93 5.93 0 0 1 6.17 12c0-.66.12-1.3.3-1.89v-.13L3.25 7.5l-.1.05A9.74 9.74 0 0 0 2.3 12c0 1.61.39 3.13.85 4.45l3.33-2.56Z" />
    <path fill="#EA4335" d="M12 6.06c1.84 0 3.08.8 3.79 1.46l2.77-2.7C16.83 3.2 14.63 2.3 12 2.3a9.75 9.75 0 0 0-8.85 5.25l3.32 2.57A5.87 5.87 0 0 1 12 6.06Z" />
  </svg>
);

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onUpdateUser: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUpdateUser
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState(currentUser.isGuest ? '' : currentUser.email);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<'student' | 'teacher'>('student');
  const [notification, setNotification] = useState<string | null>(null);

  if (!isOpen) return null;

  // Password entropy calculations
  const hasMinLen = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  const entropyScore = [hasMinLen, hasNumber, hasSpecial].filter(Boolean).length;

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setNotification('Please provide an email address.');
      return;
    }
    const updated: UserProfile = {
      ...currentUser,
      email,
      name: email.split('@')[0] || 'Learner',
      isGuest: false,
      role
    };
    onUpdateUser(updated);
    setNotification('Successfully authenticated!');
    setTimeout(() => {
      onClose();
    }, 600);
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setNotification('Please enter all required fields.');
      return;
    }
    if (password !== confirmPassword) {
      setNotification('Passwords do not match.');
      return;
    }
    const updated: UserProfile = {
      ...currentUser,
      email,
      name: email.split('@')[0] || 'Learner',
      isGuest: false,
      role
    };
    onUpdateUser(updated);
    setNotification('Account created successfully!');
    setTimeout(() => {
      onClose();
    }, 600);
  };

  const handleGoogleSignIn = () => {
    setNotification('Google sign-in needs your OAuth client ID before it can be connected.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-[#bfc7d2]/40 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-[#707882] hover:text-[#0b1c30] hover:bg-[#eff4ff] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="p-6 text-center border-b border-[#bfc7d2]/30 bg-gradient-to-b from-[#eff4ff] to-white">
          <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-[#006096] to-[#007abc] flex items-center justify-center text-white shadow-md shadow-[#006096]/20 mb-3">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="font-headline-md text-xl font-bold text-[#0b1c30]">
            Cogni<span className="text-[#006096]">Fix</span> Workspace
          </h2>
          <p className="text-xs text-[#3f4851] mt-1">
            Adaptive STEM Cognitive Diagnostic & Remediation
          </p>

          {/* Mode Switcher */}
          <div className="mt-5 grid grid-cols-2 p-1 bg-[#e5eeff] rounded-xl text-xs font-semibold">
            <button
              onClick={() => {
                setMode('signin');
                setNotification(null);
              }}
              className={`py-2 rounded-lg transition-all ${
                mode === 'signin' ? 'bg-white text-[#006096] shadow-xs' : 'text-[#3f4851] hover:text-[#0b1c30]'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setMode('signup');
                setNotification(null);
              }}
              className={`py-2 rounded-lg transition-all ${
                mode === 'signup' ? 'bg-white text-[#006096] shadow-xs' : 'text-[#3f4851] hover:text-[#0b1c30]'
              }`}
            >
              Create Account
            </button>
          </div>
        </div>

        {/* Notification banner */}
        {notification && (
          <div className="px-6 py-2 bg-blue-50 border-b border-blue-200 text-xs text-[#006096] font-medium text-center">
            {notification}
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={mode === 'signin' ? handleSignIn : handleSignUp} className="p-6 space-y-4">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-[#bfc7d2]/70 bg-white py-3 text-xs font-bold text-[#0b1c30] transition hover:bg-[#f8f9ff] hover:border-[#006096]/50"
          >
            <GoogleMark />
            Continue with Google
          </button>

          <div className="relative flex items-center justify-center py-1">
            <div className="w-full border-t border-[#bfc7d2]/40" />
            <span className="absolute bg-white px-3 text-[10px] font-semibold uppercase tracking-wide text-[#707882]">or continue with email</span>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#0b1c30] mb-1.5">
              Institutional or Personal Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#707882]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@university.edu"
                className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-[#bfc7d2]/70 focus:outline-none focus:ring-2 focus:ring-[#006096]/20 focus:border-[#006096] text-[#0b1c30]"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-[#0b1c30]">Password</label>
              {mode === 'signin' && (
                <button
                  type="button"
                  onClick={() => setNotification('Password recovery will be available when your identity provider is connected.')}
                  className="text-[11px] font-medium text-[#006096] hover:underline"
                >
                  Forgot?
                </button>
              )}
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#707882]" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-9 pr-9 py-2.5 text-xs rounded-xl border border-[#bfc7d2]/70 focus:outline-none focus:ring-2 focus:ring-[#006096]/20 focus:border-[#006096] text-[#0b1c30]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#707882] hover:text-[#0b1c30]"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {mode === 'signup' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-[#0b1c30] mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#707882]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-[#bfc7d2]/70 focus:outline-none focus:ring-2 focus:ring-[#006096]/20 focus:border-[#006096] text-[#0b1c30]"
                  />
                </div>
              </div>

              {/* Password Entropy Meter */}
              <div className="p-3 bg-[#eff4ff] rounded-xl border border-[#bfc7d2]/40 text-xs space-y-2">
                <div className="flex items-center justify-between text-[11px] font-semibold text-[#3f4851]">
                  <span>Entropy Security Check</span>
                  <span className={entropyScore === 3 ? 'text-emerald-700' : 'text-amber-700'}>
                    {entropyScore === 3 ? 'Strong' : entropyScore === 2 ? 'Moderate' : 'Weak'}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-1.5 h-1.5">
                  <div className={`rounded-full ${entropyScore >= 1 ? 'bg-amber-400' : 'bg-gray-200'}`} />
                  <div className={`rounded-full ${entropyScore >= 2 ? 'bg-amber-500' : 'bg-gray-200'}`} />
                  <div className={`rounded-full ${entropyScore === 3 ? 'bg-emerald-500' : 'bg-gray-200'}`} />
                </div>
                <div className="grid grid-cols-3 gap-1 text-[10px] text-[#3f4851]">
                  <span className={hasMinLen ? 'text-emerald-700 font-semibold' : ''}>8+ chars</span>
                  <span className={hasNumber ? 'text-emerald-700 font-semibold' : ''}>1+ number</span>
                  <span className={hasSpecial ? 'text-emerald-700 font-semibold' : ''}>1+ symbol</span>
                </div>
              </div>

              {/* Account Role */}
              <div>
                <label className="block text-xs font-semibold text-[#0b1c30] mb-1.5">Role Type</label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setRole('student')}
                    className={`py-2 px-3 rounded-lg border text-left font-medium ${
                      role === 'student' ? 'border-[#006096] bg-[#e5eeff] text-[#006096]' : 'border-[#bfc7d2]/60'
                    }`}
                  >
                    Student Scholar
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('teacher')}
                    className={`py-2 px-3 rounded-lg border text-left font-medium ${
                      role === 'teacher' ? 'border-[#006096] bg-[#e5eeff] text-[#006096]' : 'border-[#bfc7d2]/60'
                    }`}
                  >
                    Instructor / Admin
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Primary Submit */}
          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-[#006096] text-white font-bold text-xs hover:bg-[#007abc] transition-all shadow-sm"
          >
            {mode === 'signin' ? 'Sign In to Workspace' : 'Create Cognitive Account'}
          </button>

        </form>

        {/* Footer info */}
        <div className="p-4 bg-[#eff4ff]/60 border-t border-[#bfc7d2]/30 text-center text-[10px] text-[#707882]">
          By continuing, you agree to academic integrity and data privacy policies.
        </div>
      </div>
    </div>
  );
};
