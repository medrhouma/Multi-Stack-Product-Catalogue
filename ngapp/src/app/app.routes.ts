import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { Admin } from './pages/admin';
import { Login } from './pages/login';
import { ProductDetail } from './pages/product-detail';
import { ProductList } from './pages/product-list';


export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'products' },
  { path: 'products', component: ProductList },
  { path: 'products/:id', component: ProductDetail },
    { path: 'login', component: Login },
  { path: 'admin', component: Admin, canActivate: [authGuard] },
  { path: '**', redirectTo: 'products' },
];