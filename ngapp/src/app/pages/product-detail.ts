import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { catchError, of, switchMap, tap } from 'rxjs';
import { Product } from '../models/product';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-product-detail',
  imports: [RouterLink, CurrencyPipe, DatePipe],
  template: `
    <a routerLink="/products" class="back-catalogue-link">
      <span class="back-catalogue-icon" aria-hidden="true">←</span>
      <span><small>Navigation</small>Back to catalogue</span>
    </a>

    @if (loading()) {
      <div class="text-center py-5"><div class="spinner-border text-primary" role="status"></div></div>
    } @else if (error()) {
      <div class="alert alert-danger" role="alert">{{ error() }}</div>
    } @else if (product(); as p) {
      <div class="row g-4">
        <div class="col-12 col-md-5">
          <img [src]="p.thumbnail" [alt]="p.title" class="img-fluid rounded bg-light w-100" />
        </div>
        <div class="col-12 col-md-7">
          <span class="badge text-bg-secondary mb-2">{{ p.category.name }}</span>
          <h1 class="h3">{{ p.title }}</h1>
          <p class="fs-4 fw-bold text-primary mb-1">{{ p.price | currency }}</p>
          <p>
            @if (p.stock > 0) {
              <span class="badge text-bg-success">In stock ({{ p.stock }})</span>
            } @else {
              <span class="badge text-bg-danger">Out of stock</span>
            }
          </p>
          <p>{{ p.description }}</p>
          <ul class="list-unstyled small text-muted">
            <li>ID: {{ p.id }}</li>
            <li>Created: {{ p.createdAt | date: 'medium' }}</li>
            <li>Updated: {{ p.updatedAt | date: 'medium' }}</li>
          </ul>
        </div>
      </div>
    }
  `,
})
export class ProductDetail {
  private readonly service = inject(ProductService);
  private readonly route = inject(ActivatedRoute);

  readonly product = signal<Product | null>(null);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  constructor() {
    this.route.paramMap
      .pipe(
        tap(() => {
          this.loading.set(true);
          this.error.set(null);
        }),
        switchMap((p) =>
          this.service.getProduct(Number(p.get('id'))).pipe(
            catchError(() => {
              this.error.set('Product not found or the API is unavailable.');
              return of(null);
            }),
          ),
        ),
        takeUntilDestroyed(),
      )
      .subscribe((p) => {
        this.product.set(p);
        this.loading.set(false);
      });
  }
}