import '../styles/globals.css';
import { Providers } from './providers';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl" className="dark">
      <head />
      <body className="h-screen w-screen p-0 m-0">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
