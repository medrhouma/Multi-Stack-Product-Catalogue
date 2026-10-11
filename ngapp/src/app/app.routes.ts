import { Routes } from '@angular/router';
import { ProductDetail } from './pages/product-detail';
import { ProductList } from './pages/product-list';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'products' },
  { path: 'products', component: ProductList },
  { path: 'products/:id', component: ProductDetail },
  { path: '**', redirectTo: 'products' },
];