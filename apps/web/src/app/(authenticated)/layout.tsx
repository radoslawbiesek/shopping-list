'use client';

import { redirect } from 'next/navigation';

import { FullPageSpinner } from '../../components/ui/full-page-spinner/FullPageSpinner';

import { useUser } from '../../hooks/useUser';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, isRefetching, logout } = useUser();

  if (isLoading || isRefetching) {
    return <FullPageSpinner />;
  }

  if (!user) {
    return redirect('/login');
  }

  return children;
}
