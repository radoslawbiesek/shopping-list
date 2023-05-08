import '../styles/globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html data-theme="garden">
      <head />
      <body className="h-screen w-screen p-0 m-0">{children}</body>
    </html>
  );
}
