import { Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { catchError, of, switchMap, tap } from 'rxjs';
import { ProductCard } from '../components/product-card';
import { Category, Product } from '../models/product';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-product-list',
  imports: [ProductCard],
  template: `
    <h1 class="h3 mb-3">Product catalogue</h1>

    <div class="row g-2 mb-4">
      <div class="col-12 col-md-6">
        <div class="input-group">
          <input #search type="search" class="form-control" placeholder="Search products…"
                 [value]="q()" (keydown.enter)="onSearch(search.value)" />
          <button class="btn btn-primary" type="button" (click)="onSearch(search.value)">Search</button>
        </div>
      </div>
      <div class="col-12 col-md-6">
        <select #cat class="form-select" (change)="onCategory(cat.value)">
          <option value="" [selected]="category() === ''">All categories</option>
          @for (c of categories(); track c.slug) {
            <option [value]="c.slug" [selected]="c.slug === category()">{{ c.name }}</option>
          }
        </select>
      </div>
    </div>

    @if (loading()) {
      <div class="text-center py-5">
        <div class="spinner-border text-primary" role="status"></div>
        <p class="mt-2 text-muted">Loading products…</p>
      </div>
    } @else if (error()) {
      <div class="alert alert-danger" role="alert">{{ error() }}</div>
    } @else if (products().length === 0) {
      <div class="alert alert-info">No products found.</div>
    } @else {
      <div class="row g-4">
        @for (p of products(); track p.id) {
          <div class="col-12 col-sm-6 col-lg-3">
            <app-product-card [product]="p" />
          </div>
        }
      </div>

      <nav class="d-flex justify-content-between align-items-center mt-4">
        <button class="btn btn-outline-secondary" [disabled]="page() <= 1" (click)="prev()">Previous</button>
        <span class="text-muted">Page {{ page() }} of {{ totalPages() }}</span>
        <button class="btn btn-outline-secondary" [disabled]="page() >= totalPages()" (click)="next()">Next</button>
      </nav>
    }
  `,
})
export class ProductList {
  private readonly service = inject(ProductService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly limit = 12;
  readonly products = signal<Product[]>([]);
  readonly categories = signal<Category[]>([]);
  readonly total = signal(0);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly page = signal(1);
  readonly q = signal('');
  readonly category = signal('');
  readonly totalPages = computed(() => Math.max(1, Math.ceil(this.total() / this.limit)));

  constructor() {
    this.service
      .getCategories()
      .pipe(catchError(() => of<Category[]>([])), takeUntilDestroyed())
      .subscribe((c) => this.categories.set(c));

    this.route.queryParamMap
      .pipe(
        tap((p) => {
          this.q.set(p.get('q') ?? '');
          this.category.set(p.get('category') ?? '');
          this.page.set(Math.max(1, Number(p.get('page')) || 1));
          this.loading.set(true);
          this.error.set(null);
        }),
        switchMap(() =>
          this.service
            .getProducts({
              limit: this.limit,
              skip: (this.page() - 1) * this.limit,
              q: this.q(),
              category: this.category(),
            })
            .pipe(
              catchError(() => {
                this.error.set('Could not load products. Please try again later.');
                return of(null);
              }),
            ),
        ),
        takeUntilDestroyed(),
      )
      .subscribe((res) => {
        this.loading.set(false);
        this.products.set(res?.products ?? []);
        this.total.set(res?.total ?? 0);
      });
  }

  onSearch(value: string): void {
    this.go({ q: value.trim() || null, category: null, page: null });
  }
  onCategory(value: string): void {
    this.go({ category: value || null, q: null, page: null });
  }
  prev(): void {
    const target = this.page() - 1;
    this.go({ page: target > 1 ? target : null });
  }
  next(): void {
    this.go({ page: this.page() + 1 });
  }

  private go(queryParams: Params): void {
    void this.router.navigate([], { relativeTo: this.route, queryParams, queryParamsHandling: 'merge' });
  }
}