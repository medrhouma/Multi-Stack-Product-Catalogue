import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Product } from '../models/product';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-admin',
  imports: [ReactiveFormsModule, CurrencyPipe],
  template: `
    <div class="admin-page">
      <div class="admin-page-heading">
        <div><p class="admin-eyebrow">Workspace</p><h1>Product management</h1><p>Keep your catalogue organised and up to date.</p></div>
        <span class="admin-live-status"><span></span> Catalogue live</span>
      </div>
      <div class="admin-stats">
        <div class="admin-stat-card"><span class="admin-stat-icon">▦</span><div><strong>{{ products().length }}</strong><span>Total products</span></div></div>
        <div class="admin-stat-card"><span class="admin-stat-icon admin-stat-icon-blue">◈</span><div><strong>{{ categoriesCount() }}</strong><span>Categories</span></div></div>
        <div class="admin-stat-card"><span class="admin-stat-icon admin-stat-icon-orange">!</span><div><strong>{{ lowStockCount() }}</strong><span>Low stock</span></div></div>
      </div>
      <section class="admin-form-card">
        <div class="admin-section-heading"><div><p class="admin-eyebrow">{{ editingId() ? 'Update listing' : 'New listing' }}</p><h2>{{ editingId() ? 'Edit product' : 'Add a product' }}</h2></div>
          @if (editingId()) { <span class="admin-editing-label">Editing product #{{ editingId() }}</span> }
        </div>
        <form [formGroup]="form" (ngSubmit)="save()" class="admin-form-grid">
          <label>Title<input placeholder="e.g. Wireless headphones" formControlName="title" /></label>
          <label>Price<input type="number" step="0.01" placeholder="0.00" formControlName="price" /></label>
          <label>Stock<input type="number" placeholder="0" formControlName="stock" /></label>
          <label>Category<input placeholder="e.g. Audio" formControlName="category" /></label>
          <label class="admin-field-wide">Thumbnail URL<input placeholder="https://..." formControlName="thumbnail" /></label>
          <label class="admin-field-wide">Description<textarea rows="3" placeholder="Describe the product..." formControlName="description"></textarea></label>
          <div class="admin-form-actions admin-field-wide">
            <button class="admin-primary-button" [disabled]="form.invalid">{{ editingId() ? 'Update product' : 'Create product' }} <span>→</span></button>
        @if (editingId()) {
              <button type="button" class="admin-secondary-button" (click)="reset()">Cancel</button>
        }
          </div>
        </form>
      </section>
      @if (message()) { <p class="admin-message" role="status">{{ message() }}</p> }
      <section class="admin-list-card">
        <div class="admin-list-heading"><div><p class="admin-eyebrow">Inventory</p><h2>All products <span>{{ total() }}</span></h2></div><span class="admin-page-label">Page {{ page() }} of {{ totalPages() }}</span></div>
        <div class="admin-table-wrap"><table class="admin-table">
          <thead><tr><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th class="admin-actions-column">Actions</th></tr></thead>
          <tbody>@for (p of products(); track p.id) {
            <tr><td><div class="admin-product-cell"><img [src]="p.thumbnail" alt="" /><strong>{{ p.title }}</strong></div></td>
              <td><span class="admin-category">{{ p.category.name }}</span></td><td class="admin-price">{{ p.price | currency }}</td>
              <td><span class="admin-stock" [class.admin-stock-low]="p.stock < 10">{{ p.stock }} {{ p.stock < 10 ? 'low' : 'in stock' }}</span></td>
              <td class="admin-actions"><button (click)="edit(p)">Edit</button><button (click)="remove(p.id)">Delete</button></td>
            </tr>
          }</tbody>
        </table></div>
        <nav class="admin-pagination"><button class="admin-secondary-button" [disabled]="page() <= 1" (click)="go(page() - 1)">Previous</button><button class="admin-secondary-button" [disabled]="page() >= totalPages()" (click)="go(page() + 1)">Next</button></nav>
      </section>
    </div>
  `,
})
export class Admin {
  private readonly service = inject(ProductService);
  private readonly fb = inject(FormBuilder);
  private readonly limit = 10;

  readonly products = signal<Product[]>([]);
  readonly total = signal(0);
  readonly page = signal(1);
  readonly editingId = signal<number | null>(null);
  readonly message = signal<string | null>(null);
  readonly totalPages = computed(() => Math.max(1, Math.ceil(this.total() / this.limit)));
  readonly categoriesCount = computed(() => new Set(this.products().map((product) => product.category.name)).size);
  readonly lowStockCount = computed(() => this.products().filter((product) => product.stock < 10).length);

  readonly form = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(2)]],
    description: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(0.01)]],
    thumbnail: ['', [Validators.required, Validators.pattern(/^https?:\/\/.+/)]],
    stock: [0, [Validators.required, Validators.min(0)]],
    category: ['', Validators.required],
  });

  constructor() {
    this.load();
  }

  load(): void {
    this.service
      .getProducts({ limit: this.limit, skip: (this.page() - 1) * this.limit })
      .subscribe({
        next: (r) => {
          this.products.set(r.products);
          this.total.set(r.total);
        },
        error: () => this.message.set('Could not load products.'),
      });
  }

  go(page: number): void {
    this.page.set(page);
    this.load();
  }

  edit(p: Product): void {
    this.editingId.set(p.id);
    this.form.setValue({
      title: p.title,
      description: p.description,
      price: p.price,
      thumbnail: p.thumbnail,
      stock: p.stock,
      category: p.category.name,
    });
  }

  reset(): void {
    this.editingId.set(null);
    this.form.reset({ title: '', description: '', price: 0, thumbnail: '', stock: 0, category: '' });
  }

  save(): void {
    const value = this.form.getRawValue();
    const id = this.editingId();
    const request = id ? this.service.updateProduct(id, value) : this.service.createProduct(value);
    request.subscribe({
      next: () => {
        this.message.set(id ? 'Product updated' : 'Product created');
        this.reset();
        this.load();
      },
      error: () => this.message.set('Request failed. Check the fields and the API.'),
    });
  }

  remove(id: number): void {
    if (!confirm('Delete this product?')) return;
    this.service.deleteProduct(id).subscribe({
      next: () => {
        this.message.set('Product deleted');
        this.load();
      },
      error: () => this.message.set('Delete failed.'),
    });
  }
}