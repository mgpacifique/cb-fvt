'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm';

const RealLeafletMap = dynamic(
  () => import('@/components/RealLeafletMap').then((mod) => mod.RealLeafletMap),
  { ssr: false }
);

export default function ResetPasswordPage() {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 bg-neutral-950 overflow-hidden select-none">
      {/* Background Spatial Layer with Blur */}
      <div className="absolute inset-0 w-full h-full opacity-35 filter blur-xs pointer-events-none">
        <RealLeafletMap
          fullScreen={true}
          selectedCorridor="gatuna-katuna"
          onSelectCorridor={() => {}}
          commodityName="Maize"
          darkMode={true}
        />
      </div>

      {/* Darkened Vignette Overlay */}
      <div className="absolute inset-0 bg-neutral-950/70 backdrop-blur-md pointer-events-none" />

      {/* Centered Liquid Glass Reset Form */}
      <div className="relative z-10 w-full max-w-md">
        <ResetPasswordForm />
      </div>
    </div>
  );
}

