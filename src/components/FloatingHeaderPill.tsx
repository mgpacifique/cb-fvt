'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CorridorId, CommodityId } from '@/lib/types';
import { CORRIDORS, COMMODITIES } from '@/lib/data';
import { useAuth } from '@/context/AuthContext';
import {
  FileDown,
  Sun,
  Moon,
  HelpCircle,
  BarChart2,
  FileText,
  Sliders,
  ChevronDown,
  Sparkles,
  Shield,
  User,
  Menu,
  X,
  ShieldCheck,
} from 'lucide-react';

interface FloatingHeaderPillProps {
  selectedCorridor: CorridorId;
  onSelectCorridor: (c: CorridorId) => void;
  selectedCommodity: CommodityId;
  onSelectCommodity: (c: CommodityId) => void;
  rollingWindow: '30' | '90';
  onSelectRollingWindow: (w: '30' | '90') => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenManual: () => void;
  onOpenAccount: () => void;
  onPrintBrief: () => void;
  onExportCsv: () => void;
  onExportJson: () => void;
  onOpenAdminEtl?: () => void;
}

export const FloatingHeaderPill: React.FC<FloatingHeaderPillProps> = ({
  selectedCorridor,
  onSelectCorridor,
  selectedCommodity,
  onSelectCommodity,
  rollingWindow,
  onSelectRollingWindow,
  darkMode,
  onToggleDarkMode,
  onOpenManual,
  onOpenAccount,
  onPrintBrief,
  onExportCsv,
  onExportJson,
  onOpenAdminEtl,
}) => {
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, role, isAdmin, isAuthenticated } = useAuth();

  const currentCorridor = CORRIDORS[selectedCorridor];

  return (
    <header className="fixed top-3 inset-x-0 z-40 px-3 sm:px-6 pointer-events-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        {/* ====================================================================
            MOBILE DISPLAY (< 768px): Single Compact Glass Pill
            ==================================================================== */}
        <div className="md:hidden pointer-events-auto flex items-center justify-between w-full p-1.5 rounded-full liquid-glass-pill shadow-xl border border-slate-200/80 dark:border-white/15">
          {/* Corridor Quick Selector */}
          <div className="relative flex items-center min-h-[44px]">
            <select
              value={selectedCorridor}
              onChange={(e) => onSelectCorridor(e.target.value as CorridorId)}
              aria-label="Select Monitored Corridor"
              className="appearance-none bg-slate-100/90 dark:bg-black/40 text-slate-900 dark:text-white font-mono text-xs font-semibold pl-3 pr-7 py-2 rounded-full border border-slate-300 dark:border-white/15 focus:outline-hidden min-h-[44px]"
            >
              {Object.values(CORRIDORS).map((c) => (
                <option key={c.id} value={c.id} className="bg-white dark:bg-neutral-900 text-slate-900 dark:text-white">
                  {c.name.split('/')[0].trim()}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500 dark:text-neutral-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <div className="flex items-center gap-1.5">
            {/* Commodity Selector */}
            <select
              value={selectedCommodity}
              onChange={(e) => onSelectCommodity(e.target.value as CommodityId)}
              aria-label="Select Tracked Commodity"
              className="appearance-none bg-teal-500/15 text-teal-800 dark:text-teal-300 font-mono text-xs font-semibold px-2.5 py-2 rounded-full border border-teal-500/30 focus:outline-hidden min-h-[44px]"
            >
              {(Object.keys(COMMODITIES) as CommodityId[]).map((cId) => (
                <option key={cId} value={cId} className="bg-white dark:bg-neutral-900 text-slate-900 dark:text-white">
                  {COMMODITIES[cId].name}
                </option>
              ))}
            </select>

            {/* Theme Toggle (Min 44x44 target) */}
            <button
              onClick={onToggleDarkMode}
              className="btn-pressable w-11 h-11 rounded-full flex items-center justify-center text-slate-600 dark:text-neutral-300 hover:text-white hover:bg-white/10"
              aria-label="Toggle Theme"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            {/* Profile Avatar Trigger (Min 44x44 target) */}
            <button
              onClick={onOpenAccount}
              className="btn-pressable w-11 h-11 rounded-full flex items-center justify-center bg-teal-500/20 text-teal-300 border border-teal-500/30 font-mono text-xs font-bold"
              title="Account Settings"
              aria-label="User Account"
            >
              {user ? user.shortName : <User className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* ====================================================================
            TABLET & DESKTOP DISPLAY (>= 768px): Full Pill Navigation
            ==================================================================== */}
        {/* Left Section: Brand & Corridor/Commodity Selectors */}
        <div className="hidden md:flex pointer-events-auto items-center gap-1.5 p-1 rounded-full liquid-glass-pill shadow-xl border border-slate-200/80 dark:border-white/15 min-h-[42px]">
          {/* Brand Mark */}
          <Link
            href="/"
            className="flex items-center gap-2 pl-2 pr-2 py-1 rounded-full hover:bg-slate-200/50 dark:hover:bg-white/10 transition-colors btn-pressable min-h-[36px]"
            title="Cross-Border Food Volatility Tracker · Release 1.0"
          >
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-teal-500 to-cyan-400 flex items-center justify-center text-slate-950 font-black text-xs shadow-xs">
              <Sparkles className="w-3.5 h-3.5 fill-slate-950 stroke-none" />
            </div>
            <div className="flex flex-col text-left">
              <span className="font-mono text-xs font-semibold tracking-tight text-slate-900 dark:text-white leading-none">
                CB-FVT
              </span>
              <span className="text-[8px] font-mono text-teal-600 dark:text-teal-400 font-medium tracking-wide">
                EAST AFRICA
              </span>
            </div>
          </Link>

          <div className="h-4 w-px bg-slate-200 dark:bg-white/15" />

          {/* Corridor Dropdown */}
          <div className="relative">
            <select
              value={selectedCorridor}
              onChange={(e) => onSelectCorridor(e.target.value as CorridorId)}
              aria-label="Select Monitored Corridor"
              className="appearance-none bg-slate-100/90 dark:bg-black/40 hover:bg-slate-200/90 dark:hover:bg-white/10 text-slate-900 dark:text-white font-mono text-xs font-medium pl-2.5 pr-6 py-1.5 rounded-full border border-slate-300 dark:border-white/15 shadow-xs cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-teal-500 transition-all btn-pressable min-h-[36px]"
            >
              {Object.values(CORRIDORS).map((c) => (
                <option key={c.id} value={c.id} className="bg-white dark:bg-neutral-900 text-slate-900 dark:text-white">
                  {c.name} ({c.originCountry} → {c.destCountry})
                </option>
              ))}
            </select>
            <ChevronDown className="w-3 h-3 text-slate-500 dark:text-neutral-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Commodity Dropdown */}
          <div className="relative">
            <select
              value={selectedCommodity}
              onChange={(e) => onSelectCommodity(e.target.value as CommodityId)}
              aria-label="Select Tracked Commodity"
              className="appearance-none bg-teal-500/10 dark:bg-teal-500/20 hover:bg-teal-500/20 dark:hover:bg-teal-500/30 text-teal-800 dark:text-teal-300 font-mono text-xs font-semibold pl-2.5 pr-6 py-1.5 rounded-full border border-teal-500/30 shadow-xs cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-teal-500 transition-all btn-pressable min-h-[36px]"
            >
              {(Object.keys(COMMODITIES) as CommodityId[]).map((cId) => (
                <option key={cId} value={cId} className="bg-white dark:bg-neutral-900 text-slate-900 dark:text-white">
                  {COMMODITIES[cId].name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3 h-3 text-teal-700 dark:text-teal-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Center Section: Compact 30D/90D Segment Toggle (Desktop Only) */}
        <div className="hidden lg:inline-flex pointer-events-auto p-0.5 rounded-full liquid-glass-pill shadow-xl border border-slate-200/80 dark:border-white/15 min-h-[42px] items-center">
          <div className="inline-flex p-0.5 rounded-full bg-slate-200/70 dark:bg-black/40 border border-slate-300/50 dark:border-white/5">
            <button
              onClick={() => onSelectRollingWindow('30')}
              className={`px-2.5 py-1 text-xs font-mono rounded-full btn-pressable transition-all min-h-[32px] flex items-center ${
                rollingWindow === '30'
                  ? 'bg-teal-600 text-white font-semibold shadow-xs'
                  : 'text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              30-Day
            </button>
            <button
              onClick={() => onSelectRollingWindow('90')}
              className={`px-2.5 py-1 text-xs font-mono rounded-full btn-pressable transition-all min-h-[32px] flex items-center ${
                rollingWindow === '90'
                  ? 'bg-teal-600 text-white font-semibold shadow-xs'
                  : 'text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              90-Day
            </button>
          </div>
        </div>

        {/* Right Section: RBAC User Avatar, Admin ETL Trigger, Export & Controls */}
        <div className="hidden md:flex pointer-events-auto items-center gap-1.5 p-1 rounded-full liquid-glass-pill shadow-xl border border-slate-200/80 dark:border-white/15 min-h-[42px]">
          {/* User Account / RBAC Pill */}
          <button
            onClick={onOpenAccount}
            className={`px-2.5 py-1 rounded-full text-xs font-mono font-medium border btn-pressable transition-all flex items-center gap-1.5 min-h-[36px] ${
              isAdmin
                ? 'bg-blue-500/15 text-blue-300 border-blue-500/30'
                : 'bg-slate-200/70 dark:bg-white/10 text-slate-700 dark:text-neutral-300 border-slate-300/60 dark:border-white/10'
            }`}
            title="Open Account & Session Controls"
          >
            {isAdmin && user ? (
              <>
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                <span className="hidden xl:inline">{user.name.split(' ')[0]} (Admin)</span>
                <span className="xl:hidden">{user.shortName}</span>
              </>
            ) : (
              <>
                <Shield className="w-3.5 h-3.5 text-slate-400" />
                <span className="hidden xl:inline">Admin Sign In</span>
                <span className="xl:hidden">Sign In</span>
              </>
            )}
          </button>

          {/* Admin Exclusive: Elevated Direct Link to Dedicated Admin Server (Port 4000) or /admin */}
          {isAdmin ? (
            <a
              href="http://localhost:4000"
              target="_blank"
              rel="noreferrer"
              className="btn-pressable px-2.5 py-1 rounded-full text-xs font-mono bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/40 flex items-center gap-1 min-h-[36px]"
              title="Navigate to Dedicated Control Plane (http://localhost:4000)"
            >
              <Sliders className="w-3 h-3" />
              <span className="hidden lg:inline">Admin Control (4000)</span>
            </a>
          ) : null}

          {/* Policy Shock Simulator Shortcut */}
          <Link
            href="/policy"
            className="btn-pressable px-2.5 py-1 rounded-full text-xs font-mono bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 flex items-center gap-1 min-h-[36px]"
            title="Open Policy Shock Simulator & What-If Sandbox (/policy)"
          >
            <Sliders className="w-3 h-3 text-amber-500" />
            <span className="hidden xl:inline">Simulator</span>
          </Link>

          <div className="h-4 w-px bg-slate-200 dark:bg-white/15" />

          {/* Export Dropdown Trigger */}
          <div className="relative">
            <button
              onClick={() => setExportMenuOpen(!exportMenuOpen)}
              className="btn-pressable px-2.5 py-1 rounded-full bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/15 text-slate-800 dark:text-white font-mono text-xs flex items-center gap-1 border border-slate-300/80 dark:border-white/15 shadow-xs min-h-[36px]"
              title="Export Briefs and Datasets"
            >
              <FileDown className="w-3 h-3 text-teal-600 dark:text-teal-300" />
              <span className="hidden sm:inline font-medium">Export</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {exportMenuOpen && (
              <div
                className="absolute right-0 mt-2 w-52 rounded-2xl liquid-glass shadow-2xl border border-slate-200/80 dark:border-white/20 p-2 z-50 popover-enter flex flex-col gap-1 text-xs font-mono"
                onClick={() => setExportMenuOpen(false)}
              >
                <button
                  onClick={onExportCsv}
                  className="w-full text-left px-3 py-2 rounded-xl text-slate-700 dark:text-neutral-200 hover:text-slate-900 dark:hover:text-white hover:bg-teal-500/10 dark:hover:bg-teal-500/20 flex items-center justify-between transition-colors min-h-[40px]"
                >
                  <span>CSV Dataset</span>
                  <span className="text-[10px] text-teal-600 dark:text-teal-400 font-bold">.csv</span>
                </button>
                <button
                  onClick={onExportJson}
                  className="w-full text-left px-3 py-2 rounded-xl text-slate-700 dark:text-neutral-200 hover:text-slate-900 dark:hover:text-white hover:bg-teal-500/10 dark:hover:bg-teal-500/20 flex items-center justify-between transition-colors min-h-[40px]"
                >
                  <span>JSON Payload</span>
                  <span className="text-[10px] text-cyan-600 dark:text-cyan-400 font-bold">.json</span>
                </button>
                <div className="h-px bg-slate-200 dark:bg-white/10 my-1" />
                <button
                  onClick={onPrintBrief}
                  className="w-full text-left px-3 py-2 rounded-xl text-teal-700 dark:text-teal-300 hover:bg-teal-500/15 dark:hover:bg-teal-500/30 flex items-center justify-between font-bold transition-colors min-h-[40px]"
                >
                  <span>Print Policy Brief</span>
                  <span className="text-[10px] text-slate-500 dark:text-neutral-400">PDF</span>
                </button>
              </div>
            )}
          </div>

          {/* User Manual Modal Trigger */}
          <button
            onClick={onOpenManual}
            className="btn-pressable w-9 h-9 rounded-full flex items-center justify-center text-slate-600 dark:text-neutral-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-white/10 transition-colors"
            title="Field Manual & SRS Documentation"
            aria-label="Field Manual"
          >
            <HelpCircle className="w-3.5 h-3.5 text-teal-600 dark:text-teal-300" />
          </button>

          {/* Dark / Light Toggle */}
          <button
            onClick={onToggleDarkMode}
            className="btn-pressable w-9 h-9 rounded-full flex items-center justify-center text-slate-600 dark:text-neutral-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-white/10 transition-colors"
            title={darkMode ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            aria-label="Toggle Theme"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>
        </div>
      </div>
    </header>
  );
};
