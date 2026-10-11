'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export default function SiteHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const syncAuth = () => setIsLoggedIn(localStorage.getItem('token') !== null);
    syncAuth();
    window.addEventListener('storage', syncAuth);
    window.addEventListener('auth-change', syncAuth);
    window.addEventListener('pageshow', syncAuth);

    return () => {
      window.removeEventListener('storage', syncAuth);
      window.removeEventListener('auth-change', syncAuth);
      window.removeEventListener('pageshow', syncAuth);
    };
  }, [pathname]);

  function logout() {
    localStorage.removeItem('token');
    window.dispatchEvent(new Event('auth-change'));
    router.push('/login');
  }

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link href="/products" className="site-brand">
          <span className="site-brand-mark" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M5 8.5h14l-1 11H6l-1-11Z" />
              <path d="M9 9V6a3 3 0 0 1 6 0v3" />
            </svg>
          </span>
          <span>Catalogue <small>Next.js</small></span>
        </Link>
        <nav className="site-nav" aria-label="Main navigation">
          <Link href="/products" className="site-nav-link">Products</Link>
          {isLoggedIn === true ? (
            <>
              <Link href="/admin" className="site-nav-link">Admin</Link>
              <button type="button" className="site-action site-action-logout" onClick={logout}>
                <span aria-hidden="true">↪</span> Logout
              </button>
            </>
          ) : isLoggedIn === false ? (
            <Link href="/login" className="site-action site-action-login">
              Login <span aria-hidden="true">→</span>
            </Link>
          ) : null}
        </nav>
      </div>
    </header>
  );
}
