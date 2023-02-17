'use client';

import { redirect } from 'next/navigation';

import { FullPageSpinner } from '../../components/ui/full-page-spinner/FullPageSpinner';

import { useUser } from '../../hooks/useUser';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, isRefetching } = useUser();

  if (isLoading || isRefetching) {
    return <FullPageSpinner />;
  }

  if (!user) {
    return redirect('/login');
  }

  return <div className="container mx-auto h-screen w-screen">{children}</div>;
}
