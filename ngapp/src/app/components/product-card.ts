import { CurrencyPipe } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '../models/product';

@Component({
  selector: 'app-product-card',
  imports: [RouterLink, CurrencyPipe],
  template: `
    <article class="product-card">
      <div class="product-card-image"><img [src]="product().thumbnail" [alt]="product().title" loading="lazy" /></div>
      <div class="product-card-body">
        <h2>{{ product().title }}</h2>
        <p class="product-card-price">{{ product().price | currency }}</p>
        <p class="product-card-description">{{ excerpt() }}</p>
        <a [routerLink]="['/products', product().id]" class="product-card-link">
          View details <span aria-hidden="true">→</span>
        </a>
      </div>
    </article>
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