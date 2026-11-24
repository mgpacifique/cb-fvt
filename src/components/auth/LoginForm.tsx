'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Shield, Lock, Mail, ArrowRight, KeyRound } from 'lucide-react';

export const LoginForm: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get('redirect') || '/';
  const { login, resetPassword, showToast } = useAuth();

  const [identifier, setIdentifier] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Password reset modal state
  const [isResetOpen, setIsResetOpen] = useState<boolean>(false);
  const [resetEmail, setResetEmail] = useState<string>('');
  const [resetStep, setResetStep] = useState<1 | 2>(1);
  const [resetCode, setResetCode] = useState<string>('');
  const [generatedCode, setGeneratedCode] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [isResetting, setIsResetting] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    try {
      const success = await login(identifier, password);
      if (success) {
        router.push(redirectTarget);
      } else {
        setErrorMessage('Invalid administrator credentials. Access to Data Operations Console denied.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestResetCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail.trim()) return;
    setIsResetting(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail.trim() }),
      });
      const data = await res.json();
      if (res.ok && data.status === 'success') {
        setGeneratedCode(data.resetCode);
        setResetStep(2);
        showToast(`Verification code generated: ${data.resetCode}`, 'info');
      } else {
        showToast(data.message || 'Email not found', 'error');
      }
    } catch {
      showToast('Network error while requesting code.', 'error');
    } finally {
      setIsResetting(false);
    }
  };

  const handleConfirmReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetCode.trim() || !newPassword.trim()) return;
    setIsResetting(true);
    try {
      const ok = await resetPassword(resetEmail, resetCode, newPassword);
      if (ok) {
        setIsResetOpen(false);
        setResetStep(1);
        setPassword(newPassword);
        setIdentifier(resetEmail);
      }
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Apple HIG Clean Surface Card */}
      <div className="backdrop-blur-3xl bg-[#1C1C1E]/90 border border-white/10 rounded-3xl p-7 sm:p-9 shadow-[0_24px_48px_rgba(0,0,0,0.5)] text-slate-100 modal-enter">
        {/* Header */}
        <div className="flex flex-col items-center text-center pb-6 border-b border-white/10">
          <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center text-white mb-3 shadow-inner">
            <Shield className="w-6 h-6 text-[#0071E3]" />
          </div>
          <span className="font-mono text-[11px] uppercase tracking-wider text-slate-400 font-medium">
            Dedicated Admin Gateway
          </span>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-white mt-1">
            Sign In to CB-FVT
          </h1>
          <p className="text-xs text-slate-400 mt-1.5 max-w-xs font-normal leading-relaxed">
            Authorized administrative access for data pipelines, ingestion moderation, and surveillance controls.
          </p>
        </div>

        {errorMessage && (
          <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center font-medium leading-tight">
            {errorMessage}
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Email or Username
            </label>
            <div className="relative">
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
                placeholder="p.gatabazi@alustudent.com or pacifique"
                className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-[#0071E3] focus:ring-2 focus:ring-[#0071E3]/20 transition-all min-h-[42px]"
              />
              <Mail className="w-4 h-4 text-slate-500 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-slate-300">
                Password
              </label>
              <button
                type="button"
                onClick={() => setIsResetOpen(true)}
                className="text-xs text-[#0071E3] hover:underline"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••••••"
                className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-[#0071E3] focus:ring-2 focus:ring-[#0071E3]/20 transition-all min-h-[42px]"
              />
              <Lock className="w-4 h-4 text-slate-500 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Primary Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-2.5 px-4 rounded-xl bg-[#0071E3] hover:bg-[#0077ED] active:scale-[0.98] text-white text-sm font-medium transition-all shadow-md flex items-center justify-center gap-2 min-h-[42px] cursor-pointer"
          >
            {isLoading ? (
              <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Authenticate Admin Session</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Public Observer Access Bypass */}
        <div className="mt-6 pt-5 border-t border-white/10 text-center">
          <Link
            href="/"
            className="text-xs text-slate-400 hover:text-white transition-colors"
          >
            Continue as Public Observer &rarr;
          </Link>
        </div>
      </div>

      {/* Password Reset Modal */}
      {isResetOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="relative w-full max-w-sm bg-[#1C1C1E] border border-white/10 rounded-2xl p-6 text-slate-100 shadow-2xl modal-enter">
            <h2 className="text-base font-semibold text-white mb-1">Reset Password</h2>
            <p className="text-xs text-slate-400 mb-4">
              {resetStep === 1
                ? 'Enter your administrator email to receive a 6-digit verification code.'
                : 'Enter the verification code and your new password.'}
            </p>

            {resetStep === 1 ? (
              <form onSubmit={handleRequestResetCode} className="space-y-3">
                <input
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="p.gatabazi@alustudent.com"
                  required
                  className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-[#0071E3]"
                />
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsResetOpen(false)}
                    className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isResetting}
                    className="px-3.5 py-1.5 rounded-lg bg-[#0071E3] hover:bg-[#0077ED] text-white text-xs font-medium"
                  >
                    {isResetting ? 'Requesting...' : 'Get Code'}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleConfirmReset} className="space-y-3">
                {generatedCode && (
                  <div className="p-2.5 rounded-lg bg-[#0071E3]/15 border border-[#0071E3]/30 text-xs text-cyan-300">
                    Verification code: <span className="font-mono font-bold">{generatedCode}</span>
                  </div>
                )}
                <input
                  type="text"
                  value={resetCode}
                  onChange={(e) => setResetCode(e.target.value)}
                  placeholder="6-digit code"
                  required
                  className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-[#0071E3] font-mono tracking-widest"
                />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="New password (min 6 chars)"
                  required
                  className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-[#0071E3]"
                />
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsResetOpen(false);
                      setResetStep(1);
                    }}
                    className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isResetting}
                    className="px-3.5 py-1.5 rounded-lg bg-[#0071E3] hover:bg-[#0077ED] text-white text-xs font-medium"
                  >
                    {isResetting ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
