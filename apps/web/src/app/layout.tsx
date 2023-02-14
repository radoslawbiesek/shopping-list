import { AppProviders } from '../../providers/AppProvider';

import '../styles/globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html data-theme="garden">
      <head />
      <body className="h-screen w-screen p-0 m-0">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
