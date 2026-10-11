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
    <a routerLink="/products" class="btn btn-link px-0 mb-3">← Back to catalogue</a>

    @if (loading()) {
      <div class="text-center py-5"><div class="spinner-border text-primary" role="status"></div></div>
    } @else if (error()) {
      <div class="alert alert-danger" role="alert">{{ error() }}</div>
    } @else if (product(); as p) {
      <div class="row g-4">
        <div class="col-12 col-md-5">
          <img [src]="p.images[0] ?? p.thumbnail" [alt]="p.title" class="img-fluid rounded bg-light w-100" />
          <div class="d-flex gap-2 mt-2 flex-wrap">
            @for (img of p.images.slice(1); track img) {
              <img [src]="img" [alt]="p.title" width="72" height="72" class="rounded bg-light border" />
            }
          </div>
        </div>
        <div class="col-12 col-md-7">
          <span class="badge text-bg-secondary mb-2">{{ p.category }}</span>
          <h1 class="h3">{{ p.title }}</h1>
          @if (p.brand) { <p class="text-muted mb-1">by {{ p.brand }}</p> }
          <p class="fs-4 fw-bold text-primary mb-1">
            {{ p.price | currency }}
            <small class="badge text-bg-success fs-6">-{{ p.discountPercentage }}%</small>
          </p>
          <p>⭐ {{ p.rating }} · {{ p.availabilityStatus }} ({{ p.stock }} in stock)</p>
          <p>{{ p.description }}</p>
          <ul class="list-unstyled small text-muted">
            <li>SKU: {{ p.sku }}</li>
            <li>Weight: {{ p.weight }}</li>
            <li>Min. order: {{ p.minimumOrderQuantity }}</li>
            <li>Warranty: {{ p.warrantyInformation }}</li>
            <li>Shipping: {{ p.shippingInformation }}</li>
            <li>Returns: {{ p.returnPolicy }}</li>
          </ul>
          <div class="mb-3">
            @for (t of p.tags; track t) { <span class="badge rounded-pill text-bg-light border me-1">#{{ t }}</span> }
          </div>
        </div>
      </div>

      <h2 class="h5 mt-4">Reviews</h2>
      @for (r of p.reviews; track r.date + r.reviewerEmail) {
        <div class="border rounded p-3 mb-2">
          <strong>{{ r.reviewerName }}</strong> — ⭐ {{ r.rating }}
          <small class="text-muted ms-2">{{ r.date | date: 'mediumDate' }}</small>
          <p class="mb-0">{{ r.comment }}</p>
        </div>
      }
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