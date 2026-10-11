import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Category, Product, ProductInput, ProductPage, ProductQuery } from '../models/product';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly api = environment.apiUrl;

  getProducts({ limit, skip, q, category }: ProductQuery): Observable<ProductPage> {
    let params = new HttpParams().set('limit', limit).set('skip', skip);
    if (q) params = params.set('q', q);
    if (category) params = params.set('category', category);
    return this.http.get<ProductPage>(`${this.api}/products`, { params });
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.api}/products/${id}`);
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.api}/categories`);
  }

  createProduct(product: ProductInput): Observable<Product> {
    return this.http.post<Product>(`${this.api}/products`, product);
  }

  updateProduct(id: number, product: Partial<ProductInput>): Observable<Product> {
    return this.http.patch<Product>(`${this.api}/products/${id}`, product);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/products/${id}`);
  }
}