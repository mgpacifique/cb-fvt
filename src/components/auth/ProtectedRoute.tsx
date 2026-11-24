'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth, UserRole } from '@/context/AuthContext';
import { ShieldAlert, RefreshCw } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  redirectUrl?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles = ['admin'],
  redirectUrl = '/login',
}) => {
  const { role, isAuthenticated, showToast } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState<boolean>(false);

  useEffect(() => {
    if (!isAuthenticated) {
      showToast('Authentication required to access administrative resources', 'warning');
      router.replace(`${redirectUrl}?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    if (!allowedRoles.includes(role)) {
      showToast('Administrator credentials required. Access restricted for Standard Analyst role.', 'error');
      router.replace(`${redirectUrl}?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    setAuthorized(true);
  }, [isAuthenticated, role, allowedRoles, router, pathname, redirectUrl, showToast]);

  if (!authorized) {
    return (
      <div className="min-h-screen w-full bg-neutral-950 flex flex-col items-center justify-center p-6 text-slate-200">
        <div className="liquid-glass p-8 rounded-3xl border border-white/10 shadow-2xl flex flex-col items-center max-w-sm text-center">
          <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center mb-4 animate-pulse">
            <RefreshCw className="w-6 h-6 animate-spin" />
          </div>
          <span className="font-mono text-xs uppercase tracking-wider text-teal-400">
            Authorizing Session
          </span>
          <p className="text-xs text-slate-400 mt-2 font-mono">
            Verifying RBAC policy permissions...
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

