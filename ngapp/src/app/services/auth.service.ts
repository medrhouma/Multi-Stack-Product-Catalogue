import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

interface LoginResponse {
  token: string;
  user: { id: number; email: string };
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly storageKey = 'token';

  readonly token = signal<string | null>(localStorage.getItem(this.storageKey));
  readonly isLoggedIn = computed(() => this.token() !== null);

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${environment.apiUrl}/auth/login`, { email, password })
      .pipe(
        tap((r) => {
          localStorage.setItem(this.storageKey, r.token);
          this.token.set(r.token);
        }),
      );
  }

  logout(): void {
    localStorage.removeItem(this.storageKey);
    this.token.set(null);
  }
}