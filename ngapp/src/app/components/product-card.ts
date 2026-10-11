import { CurrencyPipe } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '../models/product';

@Component({
  selector: 'app-product-card',
  imports: [RouterLink, CurrencyPipe],
  template: `
    <div class="card h-100 shadow-sm">
      <img [src]="product().thumbnail" [alt]="product().title" class="card-img-top bg-light"
           style="aspect-ratio: 1 / 1; object-fit: contain;" loading="lazy" />
      <div class="card-body d-flex flex-column">
        <h2 class="h6 card-title">{{ product().title }}</h2>
        <p class="fw-bold text-primary mb-2">{{ product().price | currency }}</p>
        <p class="card-text text-muted small flex-grow-1">{{ excerpt() }}</p>
        <a [routerLink]="['/products', product().id]" class="btn btn-outline-primary btn-sm mt-2">
          View details
        </a>
      </div>
    </div>
  `,
})
export class ProductCard {
  readonly product = input.required<Product>();
  readonly maxLength = input(80);

  readonly excerpt = computed(() => {
    const text = this.product().description;
    const max = this.maxLength();
    return text.length > max ? text.slice(0, max).trimEnd() + '…' : text;
  });
}