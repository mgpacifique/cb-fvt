'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  X,
  User,
  Shield,
  Key,
  Copy,
  Check,
  LogOut,
  Sliders,
  Trash2,
  Building,
  Edit2,
  Save,
  Lock,
  Mail,
  ExternalLink,
} from 'lucide-react';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AccountModal: React.FC<AccountModalProps> = ({ isOpen, onClose }) => {
  const {
    user,
    role,
    isAdmin,
    preferences,
    login,
    logout,
    updateProfile,
    flushSystemCache,
    generateApiKey,
    updatePreferences,
    showToast,
  } = useAuth();

  const [copiedKey, setCopiedKey] = useState<boolean>(false);
  const [copiedToken, setCopiedToken] = useState<boolean>(false);
  const [isEditingProfile, setIsEditingProfile] = useState<boolean>(false);
  const [editName, setEditName] = useState<string>(user?.name ?? '');
  const [editOrg, setEditOrg] = useState<string>(user?.organization ?? '');

  // Sign-in form state if unauthenticated
  const [loginIdentifier, setLoginIdentifier] = useState<string>('');
  const [loginPassword, setLoginPassword] = useState<string>('');
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string>('');

  if (!isOpen) return null;

  const handleCopy = (text: string, isToken = false) => {
    navigator.clipboard.writeText(text);
    if (isToken) {
      setCopiedToken(true);
      setTimeout(() => setCopiedToken(false), 2000);
    } else {
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    }
    showToast('Copied to clipboard', 'info');
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ name: editName, organization: editOrg });
    setIsEditingProfile(false);
  };

  const handleModalLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');
    try {
      const ok = await login(loginIdentifier, loginPassword);
      if (ok) {
        setLoginIdentifier('');
        setLoginPassword('');
      } else {
        setLoginError('Invalid administrator credentials.');
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg backdrop-blur-3xl bg-[#1C1C1E] border border-white/10 shadow-[0_32px_64px_rgba(0,0,0,0.6)] rounded-3xl p-6 sm:p-8 modal-enter overflow-hidden text-slate-100 max-h-[92vh] overflow-y-auto custom-glass-scroll">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/15 text-white font-bold flex items-center justify-center shadow-inner text-sm font-mono">
              {user ? user.shortName : <Shield className="w-6 h-6 text-[#0071E3]" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-semibold text-white tracking-tight">
                  {user ? user.name : 'Public Observer Mode'}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase tracking-wider border ${
                    isAdmin
                      ? 'bg-blue-500/15 text-blue-400 border-blue-500/30'
                      : 'bg-white/10 text-slate-300 border-white/10'
                  }`}
                >
                  {isAdmin ? 'Admin • Data Lead' : 'Read-Only Observer'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate max-w-[240px]">
                  {user ? user.organization : 'African Leadership University / CB-FVT'}
                </span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* If user is null: Show Admin Sign In Form */}
        {!user ? (
          <div className="mt-6 space-y-4">
            <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10">
              <h3 className="text-sm font-semibold text-white mb-1">Administrator Clearance</h3>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                Log in to access data ingestion pipelines, quarantine review, and administrative controls.
              </p>

              {loginError && (
                <div className="mb-3 p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center">
                  {loginError}
                </div>
              )}

              <form onSubmit={handleModalLogin} className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Email or Username</label>
                  <input
                    type="text"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    required
                    placeholder="p.gatabazi@alustudent.com or pacifique"
                    className="w-full bg-black/40 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-[#0071E3]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Password</label>
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                    placeholder="••••••••••••"
                    className="w-full bg-black/40 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-[#0071E3]"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full mt-2 py-2.5 px-4 rounded-xl bg-[#0071E3] hover:bg-[#0077ED] active:scale-[0.98] text-white text-xs font-medium transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isLoggingIn ? 'Verifying Credentials...' : 'Authenticate Admin Session'}
                </button>
              </form>
            </div>

            <div className="pt-2 text-center">
              <a
                href="http://localhost:4000"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 transition-colors"
              >
                <span>Open Dedicated Admin Server (Port 4000)</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ) : (
          /* If user is logged in: Show Admin Controls & Profile */
          <div className="mt-5 space-y-4">
            {/* Dedicated Backend Banner */}
            <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-blue-400 block">Dedicated Admin Control Plane</span>
                <span className="text-[11px] text-slate-400">Port 4000 active with live ETL & pipeline triggers</span>
              </div>
              <a
                href="http://localhost:4000"
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-xl bg-[#0071E3] hover:bg-[#0077ED] active:scale-[0.98] text-white text-xs font-medium flex items-center gap-1 transition-all"
              >
                <span>Launch</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Profile Section */}
            <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-slate-400">Admin Profile</span>
                <button
                  type="button"
                  onClick={() => {
                    setEditName(user.name);
                    setEditOrg(user.organization);
                    setIsEditingProfile(!isEditingProfile);
                  }}
                  className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
                >
                  <Edit2 className="w-3 h-3" />
                  <span>{isEditingProfile ? 'Cancel' : 'Edit'}</span>
                </button>
              </div>

              {isEditingProfile ? (
                <form onSubmit={handleSaveProfile} className="space-y-3 mt-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Display Name</label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      required
                      className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:border-[#0071E3] focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Organization Affiliation</label>
                    <input
                      type="text"
                      value={editOrg}
                      onChange={(e) => setEditOrg(e.target.value)}
                      required
                      className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:border-[#0071E3] focus:outline-hidden"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2 px-3 rounded-xl bg-[#0071E3] hover:bg-[#0077ED] active:scale-[0.98] text-white text-xs font-medium flex items-center justify-center gap-1.5"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Changes</span>
                  </button>
                </form>
              ) : (
                <div className="space-y-1 text-xs">
                  <div className="text-white font-medium">{user.name}</div>
                  <div className="text-slate-400">{user.email}</div>
                  <div className="text-slate-500 font-mono text-[11px]">{user.title}</div>
                </div>
              )}
            </div>

            {/* Session Token & API Key */}
            <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10">
              <span className="block text-xs font-medium text-slate-400 mb-1.5">Session Token (Bearer)</span>
              <div className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs font-mono">
                <input
                  type="text"
                  readOnly
                  value={user.sessionToken}
                  className="bg-transparent text-slate-200 w-full focus:outline-hidden select-all"
                />
                <button
                  onClick={() => handleCopy(user.sessionToken, true)}
                  className="p-1 text-slate-400 hover:text-white transition-colors"
                >
                  {copiedToken ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Export Preferences */}
            <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10">
              <span className="block text-xs font-medium text-slate-400 mb-2">Export Preferences</span>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Default Format</label>
                  <select
                    value={preferences.defaultFormat}
                    onChange={(e) => updatePreferences({ defaultFormat: e.target.value as any })}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-2.5 py-2 text-xs text-white cursor-pointer min-h-[38px]"
                  >
                    <option value="csv">CSV Dataset (.csv)</option>
                    <option value="json">JSON Schema (.json)</option>
                    <option value="pdf">Policy Brief (PDF)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Currency Normalization</label>
                  <select
                    value={preferences.currencyFormat}
                    onChange={(e) => updatePreferences({ currencyFormat: e.target.value as any })}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-2.5 py-2 text-xs text-white cursor-pointer min-h-[38px]"
                  >
                    <option value="USD">USD ($ / Metric Ton)</option>
                    <option value="Local">Local Currency (UGX / RWF)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Cache Flush */}
            <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-between">
              <div>
                <span className="text-xs font-medium text-slate-300 block">Local Cache & Spatial Store</span>
                <span className="text-[11px] text-slate-500">Purge local cache and re-sync</span>
              </div>
              <button
                onClick={flushSystemCache}
                className="px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] active:scale-[0.98] text-slate-300 text-xs border border-white/10 flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Flush Cache</span>
              </button>
            </div>

            {/* Footer */}
            <div className="pt-2 flex items-center justify-between">
              <button
                onClick={() => {
                  logout();
                  onClose();
                }}
                className="px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 active:scale-[0.98] text-red-400 border border-red-500/20 text-xs font-medium flex items-center gap-1.5 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </button>

              <button
                onClick={onClose}
                className="px-6 py-2 rounded-xl bg-[#0071E3] hover:bg-[#0077ED] active:scale-[0.98] text-white text-xs font-medium shadow-md transition-all"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
