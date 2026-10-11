import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  template: `
    <section class="login-shell">
      <div class="login-card">
        <div class="login-hero">
          <span class="login-mark" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <path d="M5 8.5h14l-1 11H6l-1-11Z"></path>
              <path d="M9 9V6a3 3 0 0 1 6 0v3"></path>
            </svg>
          </span>
          <p class="login-eyebrow">Product catalogue</p>
          <h1>Welcome back</h1>
          <p>Manage your catalogue with a clear view of every product, category and update.</p>
          <div class="login-hero-line" aria-hidden="true"></div>
          <span class="login-hero-caption">Simple tools. Better products.</span>
        </div>
        <div class="login-form-panel">
          <div class="login-heading">
            <p class="login-eyebrow">Admin access</p>
            <h2>Sign in to your account</h2>
            <p>Enter your details to continue.</p>
          </div>
          <form [formGroup]="form" (ngSubmit)="submit()" class="login-form">
            <label for="ng-email">Email address</label>
            <input id="ng-email" type="email" placeholder="you@example.com" autocomplete="email" formControlName="email" />
            <label for="ng-password">Password</label>
            <input id="ng-password" type="password" placeholder="Your password" autocomplete="current-password" formControlName="password" />
            <button type="submit" [disabled]="form.invalid || loading()">
              {{ loading() ? 'Signing in…' : 'Sign in' }}
              @if (!loading()) { <span aria-hidden="true">→</span> }
            </button>
          </form>
          @if (error()) { <p class="login-error" role="alert">{{ error() }}</p> }
        </div>
      </div>
    </section>
  `,
})
export class Login {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  submit(): void {
    const { email, password } = this.form.getRawValue();
    this.loading.set(true);
    this.error.set(null);
    this.auth.login(email, password).subscribe({
      next: () => void this.router.navigate(['/admin']),
      error: () => {
        this.loading.set(false);
        this.error.set('Invalid email or password.');
      },
    });
  }
}