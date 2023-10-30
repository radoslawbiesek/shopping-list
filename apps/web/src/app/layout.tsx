import 'styles/globals.css';
import { Providers } from './providers';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl" className="light">
      <head />
      <body className="m-0 h-screen w-screen p-0">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
