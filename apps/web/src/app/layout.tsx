import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html data-theme="lemonade">
      <head />
      <body className="h-screen w-screen bg-base-200 p-0 m-0">{children}</body>
    </html>
  );
}
