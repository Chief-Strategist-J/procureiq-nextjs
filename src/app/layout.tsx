import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';
import { Header } from '@/components/ui/header';

export const metadata: Metadata = {
  title: 'ProcureIQ - Identity & Access Management (IAM) Portal',
  description: 'Enterprise authentication, token rotation, and identity access security portal.',
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
          <Header userName="IAM Admin" userRole="Security Lead" />
          <main className="flex-1">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
