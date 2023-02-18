'use client';

import { redirect } from 'next/navigation';
import { useSession } from 'next-auth/react';

import { FullPageSpinner } from '../../components/ui/full-page-spinner/FullPageSpinner';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const { status } = useSession();

  if (status === 'loading') {
    return <FullPageSpinner />;
  }

  if (status === 'unauthenticated') {
    redirect('/login');
  }

  return <div className="container mx-auto h-screen w-screen">{children}</div>;
}
