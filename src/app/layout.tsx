import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';
import { Header } from '@/components/ui/header';

export const metadata: Metadata = {
  title: 'ProcureIQ - Enterprise Procurement & Supply Chain Platform',
  description: 'AI-assisted enterprise procurement, supplier management, and automated workflow authorization.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
        <Providers>
          <Header notificationCount={3} userName="Jaydeep Vagh" userRole="Lead Strategist" />
          <main className="flex-1">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
