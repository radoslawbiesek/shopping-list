import { redirect } from 'next/navigation';

import * as authService from 'services/auth.service';
import { Navigation } from 'components/layout/Navbar';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  try {
    const { data } = await authService.me();

    return (
      <div className="container mx-auto">
        <Navigation name={data.name} />
        <main className="px-4">{children}</main>
      </div>
    );
  } catch {
    return redirect('/login');
  }
}
