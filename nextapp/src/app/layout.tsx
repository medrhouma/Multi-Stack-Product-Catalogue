import type { Metadata } from 'next';
import SiteHeader from '@/components/SiteHeader';
import './globals.css';

export const metadata: Metadata = {
  title: 'Product catalogue',
  description: 'Next.js + Tailwind product catalogue',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased">
        <SiteHeader />
        <main className="mx-auto max-w-6xl px-4 pb-12">{children}</main>
      </body>
    </html>
  );
}