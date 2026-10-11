'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        setError('Invalid email or password.');
        return;
      }
      const data = (await res.json()) as { token: string };
      localStorage.setItem('token', data.token);
      window.dispatchEvent(new Event('auth-change'));
      router.push('/admin');
    } catch {
      setError('Unable to connect. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="login-shell">
      <div className="login-card">
        <div className="login-hero">
          <span className="login-mark" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M5 8.5h14l-1 11H6l-1-11Z" />
              <path d="M9 9V6a3 3 0 0 1 6 0v3" />
            </svg>
          </span>
          <p className="login-eyebrow">Product catalogue</p>
          <h1>Welcome back</h1>
          <p>Manage your catalogue with a clear view of every product, category and update.</p>
          <div className="login-hero-line" aria-hidden="true" />
          <span className="login-hero-caption">Simple tools. Better products.</span>
        </div>
        <div className="login-form-panel">
          <div className="login-heading">
            <p className="login-eyebrow">Admin access</p>
            <h2>Sign in to your account</h2>
            <p>Enter your details to continue.</p>
          </div>
          <form onSubmit={submit} className="login-form">
            <label htmlFor="next-email">Email address</label>
            <input id="next-email" type="email" placeholder="you@example.com" autoComplete="email"
                   required value={email} onChange={(e) => setEmail(e.target.value)} />
            <label htmlFor="next-password">Password</label>
            <input id="next-password" type="password" placeholder="Your password" autoComplete="current-password"
                   required value={password} onChange={(e) => setPassword(e.target.value)} />
            <button type="submit" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign in'}
              {!loading && <span aria-hidden="true">→</span>}
            </button>
          </form>
          {error && <p className="login-error" role="alert">{error}</p>}
        </div>
      </div>
    </section>
  );
}