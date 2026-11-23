'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { AccountModal } from '@/components/auth/AccountModal';
import { ArrowLeft } from 'lucide-react';

export default function AccountPage() {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(true);

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-6 text-white">
      <AccountModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          router.push('/');
        }}
      />
      {!modalOpen && (
        <div className="text-center font-mono text-xs">
          <Link href="/" className="text-teal-400 underline">
            Return to spatial workspace
          </Link>
        </div>
      )}
    </div>
  );
}

