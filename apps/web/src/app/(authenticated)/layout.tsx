import { redirect } from 'next/navigation';

import * as authService from 'services/auth.service';
import { Navigation } from 'components/layout/Navbar';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  try {
    const { data } = await authService.me();

    return (
      <>
        <Navigation name={data.name} />
        <div className="flex justify-center">{children}</div>
      </>
    );
  } catch {
    return redirect('/login');
  }
}
