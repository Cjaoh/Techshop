import { Injectable, signal, computed, effect, inject } from '@angular/core';
import { Product } from '../models/product.model';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private readonly toastService = inject(ToastService);

  readonly wishlistItems = signal<Product[]>(this.loadWishlistFromStorage());

  readonly totalWishlistItems = computed(() => this.wishlistItems().length);

  constructor() {
    effect(() => {
      localStorage.setItem('tech_shop_wishlist', JSON.stringify(this.wishlistItems()));
    });
  }

  toggleWishlist(product: Product): void {
    const items = this.wishlistItems();
    const exists = items.some(item => item.id === product.id);

    if (exists) {
      this.wishlistItems.set(items.filter(item => item.id !== product.id));
      this.toastService.show(`"${product.title}" retiré de vos favoris`, 'info');
    } else {
      this.wishlistItems.set([...items, product]);
      this.toastService.show(`"${product.title}" ajouté à vos favoris ! ❤️`, 'success');
    }
  }

  isInWishlist(productId: number): boolean {
    return this.wishlistItems().some(item => item.id === productId);
  }

  private loadWishlistFromStorage(): Product[] {
    const saved = localStorage.getItem('tech_shop_wishlist');
    return saved ? JSON.parse(saved) : [];
  }
}
