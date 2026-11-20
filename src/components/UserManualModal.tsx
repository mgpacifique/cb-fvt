'use client';

import React, { useEffect } from 'react';
import { X, BookOpen, CheckCircle, ShieldAlert, Cpu, Sparkles } from 'lucide-react';

interface UserManualModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserManualModal: React.FC<UserManualModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity duration-200">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xl p-6 modal-enter z-10 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-md bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                CB-FVT System Manual & Methodology
              </h2>
              <div className="text-xs font-mono text-neutral-500">
                Specification Baseline: SRS Release 1.0 · Authored by Manzi Gatabazi Pacifique (ALU)
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="btn-pressable p-1.5 rounded-md text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section 1: Core Methodology */}
        <div className="space-y-3">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">
            1. Core Econometric Methodology
          </h3>
          <div className="p-3.5 rounded-lg bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 space-y-2 text-xs text-neutral-700 dark:text-neutral-300">
            <p>
              <strong>Paired Market Price Divergence:</strong> Formulated as{' '}
              <code className="font-mono text-teal-700 dark:text-teal-300">
                Divergence = ((P_dest − P_orig) / P_orig) × 100
              </code>
              . A positive value indicates a destination price premium driven by border frictions, transport costs, or localized food scarcity.
            </p>
            <p>
              <strong>Currency & Unit Harmonization:</strong> Raw records from Uganda (UGX), Rwanda (RWF), Kenya (KES), and Tanzania (TZS) are normalized to USD per Metric Ton (MT):{' '}
              <code className="font-mono text-teal-700 dark:text-teal-300">
                (Price_Local_per_kg × 1,000) ÷ Exchange_Rate_to_USD
              </code>
              .
            </p>
          </div>
        </div>

        {/* Section 2: Non-Imputation Rule */}
        <div className="space-y-3">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center">
            <ShieldAlert className="w-4 h-4 mr-1.5" />
            2. SRS Non-Imputation Compliance (Zero Fake Interpolation)
          </h3>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
            Per the project governance rules, informal cross-border monitoring must maintain high analytical integrity. When a reporting agency misses a weekly observation (e.g., 17 Aug destination price on Gatuna/Katuna), the system displays an explicit <strong>“Missed Data”</strong> indicator. Under no circumstances is a synthetic value fabricated or interpolated across the gap.
          </p>
        </div>

        {/* Section 3: Emil Kowalski Craft Standards */}
        <div className="space-y-3">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center">
            <Sparkles className="w-4 h-4 mr-1.5" />
            3. UI Craft & Design Engineering
          </h3>
          <ul className="text-xs text-neutral-600 dark:text-neutral-400 space-y-1.5 list-disc pl-5">
            <li>
              <strong>Tactile Micro-interactions:</strong> Pressable controls use{' '}
              <code className="font-mono">:active &#123; transform: scale(0.97) &#125;</code> with custom ease-out transitions for instantaneous feedback.
            </li>
            <li>
              <strong>Sub-250ms Transitions:</strong> Zero sluggish <code className="font-mono">ease-in</code> timing; all drawer and modal transitions run on hardware-accelerated GPU transforms.
            </li>
            <li>
              <strong>Zero AI Slop:</strong> No tacky glowing borders, neon purple fluff, or decorative clutter. Monochromatic Swiss typography with deliberate data density.
            </li>
          </ul>
        </div>

        {/* Section 4: Functional Requirements Coverage */}
        <div className="space-y-3">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-500">
            4. Functional Requirements Verification
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 flex items-start space-x-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>FR 1:</strong> Automated ingestion, multi-currency conversion to USD/MT.</span>
            </div>
            <div className="p-2.5 rounded bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 flex items-start space-x-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>FR 2:</strong> Paired divergence percentage, 30D/90D rolling window engine.</span>
            </div>
            <div className="p-2.5 rounded bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 flex items-start space-x-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>FR 3:</strong> Responsive single-page analytical UI with dark/light themes.</span>
            </div>
            <div className="p-2.5 rounded bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 flex items-start space-x-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>FR 4:</strong> Policy event timeline annotations & impact briefs.</span>
            </div>
            <div className="p-2.5 rounded bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 flex items-start space-x-2 col-span-1 sm:col-span-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>FR 5:</strong> Tabular observation register with CSV/JSON exports & print brief.</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800 flex justify-between items-center text-xs text-neutral-400 font-mono">
          <span>CB-FVT Release 1.0</span>
          <button
            onClick={onClose}
            className="btn-pressable px-4 py-2 rounded-md bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 font-sans font-medium"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};

