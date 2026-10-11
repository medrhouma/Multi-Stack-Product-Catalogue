import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Category, Product, ProductQuery, ProductsResponse } from '../models/product';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly base = 'https://dummyjson.com/products';

  getProducts({ limit, skip, q, category }: ProductQuery): Observable<ProductsResponse> {
    let url = this.base;
    let params = new HttpParams().set('limit', limit).set('skip', skip);

    if (q) {
      url += '/search';
      params = params.set('q', q);
    } else if (category) {
      url += `/category/${encodeURIComponent(category)}`;
    }
    return this.http.get<ProductsResponse>(url, { params });
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.base}/${id}`);
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.base}/categories`);
  }
}