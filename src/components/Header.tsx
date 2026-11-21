'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Compass,
  TrendingUp,
  FileText,
  BookOpen,
  Code2,
  Database,
  Sliders,
  Moon,
  Sun,
  Menu,
  X,
  Radio,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface HeaderProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenManual?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  darkMode,
  onToggleDarkMode,
  onOpenManual,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, role, isAdmin } = useAuth();

  const navLinks = [
    { href: '/', label: 'Explore', icon: Compass },
    { href: '/trends', label: 'Trends', icon: TrendingUp },
    { href: '/policy', label: 'Simulator', icon: Sliders },
    { href: '/briefs', label: 'Briefs', icon: FileText },
    ...(isAdmin ? [{ href: '/admin', label: 'Sources', icon: Database }] : []),
    { href: '/guide', label: 'Guide', icon: BookOpen },
    { href: '/api-reference', label: 'API', icon: Code2 },
  ];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-2xl bg-white/80 dark:bg-[#070b14]/75 border-b border-slate-200/70 dark:border-white/10 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Brand Identity - Clean Apple Squircle Logo (Mockup 1 & 3) */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-teal-600 via-teal-500 to-cyan-400 p-0.5 shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform duration-200">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-white font-mono font-bold text-xs tracking-tighter">
                CB
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-xs tracking-tight text-slate-900 dark:text-white">
                  CB-FVT
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-mono text-teal-600 dark:text-teal-400 font-medium hidden sm:inline">
                  East Africa
                </span>
              </div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-normal tracking-tight hidden sm:inline">
                Cross-Border Food Flows
              </span>
            </div>
          </Link>

          {/* Center Pill Navigation Bar - Mockup 1 & Mockup 3 Style */}
          <nav className="hidden md:flex items-center p-1 rounded-full bg-slate-100/90 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 shadow-xs">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`btn-pressable px-3.5 py-1.5 rounded-full text-xs transition-all duration-160 flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-white dark:bg-white/15 text-slate-900 dark:text-white font-semibold shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/5 font-medium'
                  }`}
                >
                  <Icon
                    className={`w-3.5 h-3.5 ${
                      isActive ? 'text-teal-600 dark:text-teal-400' : 'text-slate-400'
                    }`}
                  />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Action Controls: Theme Switch, Live Status Bell, User Profile Pill */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle Button */}
            <button
              onClick={onToggleDarkMode}
              className="btn-pressable w-9 h-9 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-300 bg-slate-100/80 dark:bg-white/5 hover:bg-slate-200/80 dark:hover:bg-white/10 border border-slate-200/70 dark:border-white/10 transition-colors"
              aria-label="Toggle theme"
              title={darkMode ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            >
              {darkMode ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
            </button>

            {/* Notification / Live Signal Pill */}
            <div
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-mono"
              title="Live FEWS NET / HDX Stream Active"
            >
              <Radio className="w-3 h-3 animate-pulse" />
              <span className="text-[11px] font-medium">Live 2026</span>
            </div>

            {/* User Profile Pill */}
            {isAdmin && user ? (
              <a
                href="http://localhost:4000"
                target="_blank"
                rel="noreferrer"
                className="hidden sm:flex items-center gap-2.5 pl-1.5 pr-3 py-1 rounded-full bg-slate-100/80 dark:bg-white/5 hover:bg-slate-200/80 dark:hover:bg-white/10 border border-slate-200/80 dark:border-white/10 transition-colors"
                title="Open Dedicated Admin Control Plane (Port 4000)"
              >
                <div className="w-7 h-7 rounded-full bg-[#0071E3] text-white flex items-center justify-center text-xs font-bold tracking-tight shadow-xs">
                  {user.shortName}
                </div>
                <div className="flex flex-col text-left leading-tight">
                  <span className="text-xs font-semibold text-slate-900 dark:text-white">
                    {user.name}
                  </span>
                  <span className="text-[10px] text-blue-500 dark:text-blue-400 font-mono">
                    Admin • Port 4000 &rarr;
                  </span>
                </div>
              </a>
            ) : (
              <Link
                href="/login"
                className="hidden sm:flex items-center gap-2.5 pl-2.5 pr-3.5 py-1.5 rounded-full bg-slate-100/80 dark:bg-white/5 hover:bg-slate-200/80 dark:hover:bg-white/10 border border-slate-200/80 dark:border-white/10 transition-colors"
              >
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  Admin Sign In
                </span>
              </Link>
            )}

            {/* Mobile Hamburger Menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden btn-pressable w-9 h-9 rounded-full flex items-center justify-center text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/10"
              aria-label="Open Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer (Smooth Dropdown) */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200/80 dark:border-white/10 bg-white/95 dark:bg-[#070b14]/95 backdrop-blur-xl px-4 py-3 space-y-1 animate-in fade-in slide-in-from-top-2 duration-160">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 text-xs rounded-xl transition-all ${
                  isActive
                    ? 'bg-teal-500/15 text-teal-800 dark:text-teal-300 font-semibold border border-teal-500/30'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? 'text-teal-600 dark:text-teal-400' : 'text-slate-400'
                    }`}
                  />
                  <span>{link.label}</span>
                </div>
                {isActive && <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
};
