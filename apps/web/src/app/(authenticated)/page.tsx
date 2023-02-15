'use client';

import { useUser } from '../../hooks/useUser';

export default function Home() {
  const { logout } = useUser();

  return (
    <div>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
