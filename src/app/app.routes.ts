import { Routes } from '@angular/router';
import { adminGuard } from './services/admin.guard';

export const routes: Routes = [
  { 
    path: '', 
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent) 
  },
  { 
    path: 'products', 
    loadComponent: () => import('./features/products/product-list/product-list.component').then(m => m.ProductListComponent) 
  },
  { 
    path: 'cart', 
    loadComponent: () => import('./features/cart/cart.component').then(m => m.CartComponent) 
  },
  { 
    path: 'products/:id', 
    loadComponent: () => import('./features/products/product-detail/product-detail.component').then(m => m.ProductDetailComponent) 
  },
  { 
    path: 'orders', 
    loadComponent: () => import('./features/orders/orders.component').then(m => m.OrdersComponent) 
  },
  { 
    path: 'admin', 
    loadComponent: () => import('./features/admin/admin.component').then(m => m.AdminComponent),
    canActivate: [adminGuard]
  }, 
  { 
    path: '**', 
    redirectTo: '', 
    pathMatch: 'full' 
  }
];
