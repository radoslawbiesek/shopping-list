import { redirect } from 'next/navigation';

import * as authService from 'services/auth.service';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  try {
    await authService.me();

    return <div className="flex justify-center">{children}</div>;
  } catch {
    return redirect('/login');
  }
}
