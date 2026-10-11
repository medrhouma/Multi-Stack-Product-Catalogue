import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  template: `
    <header class="site-header">
      <div class="site-header-inner">
        <a class="site-brand" routerLink="/products">
          <span class="site-brand-mark" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <path d="M5 8.5h14l-1 11H6l-1-11Z"></path>
              <path d="M9 9V6a3 3 0 0 1 6 0v3"></path>
            </svg>
          </span>
          <span>Catalogue <small>Angular</small></span>
        </a>
        <nav class="site-nav" aria-label="Main navigation">
          <a class="site-nav-link" routerLink="/products">Products</a>
          @if (auth.isLoggedIn()) {
            <a class="site-nav-link" routerLink="/admin">Admin</a>
            <button type="button" class="site-action site-action-logout" (click)="logout()">
              <span aria-hidden="true">↪</span> Logout
            </button>
          } @else {
            <a class="site-action site-action-login" routerLink="/login">
              Login <span aria-hidden="true">→</span>
            </a>
          }
        </nav>
      </div>
    </header>
    <main class="container pb-5"><router-outlet /></main>
  `,
})
export class App {
  protected readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  logout(): void {
    this.auth.logout();
    void this.router.navigate(['/products']);
  }
}