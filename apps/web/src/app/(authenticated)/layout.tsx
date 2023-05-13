import { redirect } from 'next/navigation';

import * as authService from '../../services/auth.service';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  try {
    await authService.me();

    return <div className="container mx-auto h-screen w-screen">{children}</div>;
  } catch {
    return redirect('/login');
  }
}
