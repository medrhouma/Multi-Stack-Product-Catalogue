import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: 'Product catalogue',
  description: 'Next.js + Tailwind product catalogue',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased">
        <header className="mb-6 bg-gray-900 py-3 text-white">
          <div className="mx-auto max-w-6xl px-4">
            <Link href="/products" className="text-lg font-semibold">
              🛍️ Catalogue (Next.js)
            </Link>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-4 pb-12">{children}</main>
      </body>
    </html>
  );
}