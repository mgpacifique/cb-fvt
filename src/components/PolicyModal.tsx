'use client';

import React, { useEffect } from 'react';
import { PolicyEvent } from '../lib/types';
import { X, Flag, Calendar, ArrowRight, ShieldCheck, Clock } from 'lucide-react';

interface PolicyModalProps {
  event: PolicyEvent | null;
  onClose: () => void;
}

export const PolicyModal: React.FC<PolicyModalProps> = ({ event, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!event) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity duration-200">
      {/* Backdrop click */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Card */}
      <div className="relative w-full max-w-lg rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xl p-6 modal-enter z-10 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 border border-teal-300 dark:border-teal-800">
              {event.code}
            </span>
            <span className="text-xs font-mono text-neutral-500 uppercase tracking-wider">
              {event.category} Intervention
            </span>
          </div>

          <button
            onClick={onClose}
            className="btn-pressable p-1 rounded-md text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div>
          <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
            {event.title}
          </h3>
          <div className="flex items-center space-x-3 text-xs text-neutral-500 mt-1 font-mono">
            <span className="flex items-center">
              <Calendar className="w-3.5 h-3.5 mr-1 text-neutral-400" />
              Effective: {event.date}
            </span>
            <span>·</span>
            <span>Corridor: {event.corridorId}</span>
          </div>
        </div>

        {/* Description */}
        <div className="p-3.5 rounded-lg bg-neutral-50 dark:bg-neutral-950/70 border border-neutral-200/80 dark:border-neutral-800/80 text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed">
          {event.description}
        </div>

        {/* Observed Impact & Divergence Delta */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <div className="p-3 rounded-lg bg-neutral-100/60 dark:bg-neutral-800/40 border border-neutral-200/60 dark:border-neutral-700/60">
            <div className="text-[10px] font-mono uppercase text-neutral-400 font-semibold">
              Observed Impact
            </div>
            <div className="text-xs font-medium text-neutral-800 dark:text-neutral-200 mt-1">
              {event.observedImpact}
            </div>
          </div>

          <div className="p-3 rounded-lg bg-neutral-100/60 dark:bg-neutral-800/40 border border-neutral-200/60 dark:border-neutral-700/60">
            <div className="text-[10px] font-mono uppercase text-neutral-400 font-semibold">
              Divergence Delta
            </div>
            <div className="text-xs font-mono font-bold text-teal-700 dark:text-teal-400 mt-1">
              {event.divergenceDelta}
            </div>
          </div>
        </div>

        {/* Provenance and Audit trail */}
        <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800/80 space-y-1 text-[11px] font-mono text-neutral-400">
          <div className="flex items-center">
            <ShieldCheck className="w-3 h-3 mr-1 text-teal-600" />
            <span>Provenance: {event.sourceProvenance}</span>
          </div>
          <div className="flex items-center">
            <Clock className="w-3 h-3 mr-1 text-neutral-400" />
            <span>Scheduled Review: {event.reviewDate}</span>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="btn-pressable px-4 py-2 rounded-md text-xs font-medium bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-200"
          >
            Dismiss Brief
          </button>
        </div>
      </div>
    </div>
  );
};

