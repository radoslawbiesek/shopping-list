'use client';

import { redirect } from 'next/navigation';

import { Spinner } from '../../components/ui/spinner/Spinner';
import { useUser } from '../../hooks/useUser';

export default function Home() {
  const { user, isLoading, isRefetching, logout } = useUser();

  if (isLoading && isRefetching) {
    return <Spinner />;
  }

  if (!user) {
    return redirect('/login');
  }

  return (
    <div>
      Home
      <button onClick={logout}>Logout</button>
    </div>
  );
}
