'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Sparkles, ArrowRight, ArrowLeft, Mail, KeyRound, Lock, CheckCircle2 } from 'lucide-react';

export const ResetPasswordForm: React.FC = () => {
  const router = useRouter();
  const { resetPassword, showToast } = useAuth();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState<string>('sarah.kimani@eac.int');
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  const otpInputs = useRef<(HTMLInputElement | null)[]>([]);

  // Password strength score (0-4)
  const calculateStrength = (pwd: string) => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
  };

  const strength = calculateStrength(newPassword);

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@') || !email.includes('.')) {
      showToast('Please enter a valid official email address', 'error');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep(2);
      showToast('6-digit security verification code sent to your inbox', 'info');
    }, 400);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto-advance to next box if filled
    if (value && index < 5) {
      otpInputs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputs.current[index - 1]?.focus();
    }
  };

  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = otp.join('');
    if (fullCode.length < 6) {
      showToast('Please enter all 6 digits of your verification code', 'error');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep(3);
    }, 400);
  };

  const handleStep3Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      showToast('Password must contain at least 8 characters', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }

    setIsLoading(true);
    const fullCode = otp.join('');
    try {
      const ok = await resetPassword(email, fullCode, newPassword);
      setIsLoading(false);
      if (ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/login');
        }, 1200);
      }
    } catch {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      <div className="backdrop-blur-3xl bg-slate-900/80 dark:bg-slate-950/85 border border-white/10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.15)] rounded-3xl p-8 max-w-md w-full text-slate-100 modal-enter">
        {/* Header */}
        <div className="flex flex-col items-center text-center pb-6 border-b border-white/10">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-500 to-cyan-400 flex items-center justify-center text-slate-950 font-black text-sm shadow-xl shadow-teal-500/20 mb-3">
            <Sparkles className="w-6 h-6 fill-slate-950 stroke-none" />
          </div>
          <span className="font-mono text-xs uppercase tracking-widest text-teal-400 font-semibold">
            Security Verification
          </span>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-1">
            Reset Password
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xs font-normal">
            {step === 1 && 'Enter your institutional email to receive an authorization code.'}
            {step === 2 && 'Enter the 6-digit one-time code delivered to your registered mailbox.'}
            {step === 3 && 'Define a new secure passphrase for your CB-FVT spatial account.'}
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2 py-4">
          <span className={`h-1.5 rounded-full transition-all duration-300 ${step === 1 ? 'w-8 bg-teal-400' : 'w-3 bg-white/20'}`} />
          <span className={`h-1.5 rounded-full transition-all duration-300 ${step === 2 ? 'w-8 bg-teal-400' : 'w-3 bg-white/20'}`} />
          <span className={`h-1.5 rounded-full transition-all duration-300 ${step === 3 ? 'w-8 bg-teal-400' : 'w-3 bg-white/20'}`} />
        </div>

        {/* Success Confirmation State */}
        {success ? (
          <div className="py-8 flex flex-col items-center text-center space-y-3 animate-in fade-in duration-300">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-lg font-bold text-white">Password Updated!</h2>
            <p className="text-xs text-slate-400 font-mono">
              Redirecting you to the secure login console...
            </p>
          </div>
        ) : (
          <>
            {/* Step 1: Email Form */}
            {step === 1 && (
              <form onSubmit={handleStep1Submit} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                    Account Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="analyst@eac.int"
                      className="w-full bg-white/[0.06] dark:bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-teal-500/60 focus:ring-4 focus:ring-teal-500/15 outline-hidden font-sans text-slate-100 placeholder:text-slate-500 transition-all"
                    />
                    <Mail className="w-4 h-4 text-slate-500 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-mono text-xs font-semibold shadow-lg shadow-teal-600/30 flex items-center justify-center gap-2 transition-all duration-200 ease-emil-out active:scale-[0.98] disabled:opacity-50 cursor-pointer min-h-[44px]"
                >
                  {isLoading ? (
                    <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  ) : (
                    <>
                      <span>Transmit Verification Code</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Step 2: 6-digit OTP Code with Auto-Advance */}
            {step === 2 && (
              <form onSubmit={handleStep2Submit} className="space-y-5">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-2 text-center">
                    6-Digit Verification PIN
                  </label>
                  <div className="flex items-center justify-center gap-2">
                    {otp.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={(el) => {
                          otpInputs.current[idx] = el;
                        }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(idx, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                        className="w-11 h-12 text-center font-mono text-lg font-bold bg-white/[0.06] border border-white/15 rounded-xl focus:border-teal-400 focus:ring-2 focus:ring-teal-500/30 text-white outline-hidden transition-all select-all"
                      />
                    ))}
                  </div>
                  <div className="flex justify-between items-center mt-2.5 text-[11px] font-mono text-slate-400 px-1">
                    <span>Sent to: {email}</span>
                    <button
                      type="button"
                      onClick={() => setOtp(['2', '4', '9', '8', '0', '1'])}
                      className="text-teal-400 hover:text-teal-300 underline"
                    >
                      Fill Demo Code
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="p-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-slate-300 transition-all btn-pressable min-h-[44px] min-w-[44px] flex items-center justify-center"
                    title="Back"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>

                  <button
                    type="submit"
                    disabled={isLoading || otp.join('').length < 6}
                    className="flex-1 py-3 px-4 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-mono text-xs font-semibold shadow-lg shadow-teal-600/30 flex items-center justify-center gap-2 transition-all duration-200 ease-emil-out active:scale-[0.98] disabled:opacity-50 cursor-pointer min-h-[44px]"
                  >
                    {isLoading ? (
                      <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    ) : (
                      <>
                        <span>Validate Code</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* Step 3: New Password Form with Strength Meter */}
            {step === 3 && (
              <form onSubmit={handleStep3Submit} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                    New Passphrase
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      placeholder="Minimum 8 characters"
                      className="w-full bg-white/[0.06] dark:bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-teal-500/60 focus:ring-4 focus:ring-teal-500/15 outline-hidden font-sans text-slate-100 placeholder:text-slate-500 font-mono tracking-widest transition-all"
                    />
                    <Lock className="w-4 h-4 text-slate-500 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>

                  {/* Password Strength Indicator */}
                  {newPassword && (
                    <div className="mt-2 space-y-1">
                      <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden flex">
                        <div
                          className={`h-full transition-all duration-300 ${
                            strength <= 1
                              ? 'w-1/4 bg-rose-500'
                              : strength === 2
                              ? 'w-2/4 bg-amber-500'
                              : strength === 3
                              ? 'w-3/4 bg-teal-400'
                              : 'w-full bg-emerald-400'
                          }`}
                        />
                      </div>
                      <div className="flex justify-between text-[10px] font-mono text-slate-400">
                        <span>Strength:</span>
                        <span className={strength >= 3 ? 'text-teal-400 font-bold' : 'text-slate-400'}>
                          {strength <= 1 ? 'Weak' : strength === 2 ? 'Fair' : strength === 3 ? 'Good' : 'Very Strong'}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                    Confirm New Passphrase
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      placeholder="Repeat passphrase"
                      className="w-full bg-white/[0.06] dark:bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-teal-500/60 focus:ring-4 focus:ring-teal-500/15 outline-hidden font-sans text-slate-100 placeholder:text-slate-500 font-mono tracking-widest transition-all"
                    />
                    <Lock className="w-4 h-4 text-slate-500 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-mono text-xs font-semibold shadow-lg shadow-teal-600/30 flex items-center justify-center gap-2 transition-all duration-200 ease-emil-out active:scale-[0.98] disabled:opacity-50 cursor-pointer min-h-[44px]"
                >
                  {isLoading ? (
                    <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  ) : (
                    <>
                      <span>Commit Password Change</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </>
        )}

        {/* Back Link */}
        <div className="mt-5 text-center">
          <Link
            href="/login"
            className="text-[11px] font-mono text-slate-400 hover:text-white transition-colors"
          >
            ← Return to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

