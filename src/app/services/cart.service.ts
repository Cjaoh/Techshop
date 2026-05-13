import { Injectable, signal, computed, effect } from '@angular/core';
import { Product } from '../models/product.model';

export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  // Initialisation du signal avec les données du LocalStorage si elles existent
  cartItems = signal<CartItem[]>(this.loadCartFromStorage());

  totalItems = computed(() => 
    this.cartItems().reduce((total, item) => total + item.quantity, 0)
  );

  totalPrice = computed(() => 
    this.cartItems().reduce((total, item) => total + (item.product.price * item.quantity), 0)
  );

  constructor() {
    // Un effet Angular réagit à chaque modification du signal cartItems pour sauvegarder en local
    effect(() => {
      localStorage.setItem('tech_shop_cart', JSON.stringify(this.cartItems()));
    });
  }

    private loadCartFromStorage(): CartItem[] {
    const saved = localStorage.getItem('tech_shop_cart');
    return saved ? JSON.parse(saved) : []; // <- Remplacement de stringify par parse ici
  }


  addToCart(product: Product) {
    const items = this.cartItems();
    const existingItem = items.find(item => item.product.id === product.id);

    if (existingItem) {
      existingItem.quantity += 1;
      this.cartItems.set([...items]);
    } else {
      this.cartItems.set([...items, { product, quantity: 1 }]);
    }
  }

  removeFromCart(productId: number) {
    const updatedItems = this.cartItems().filter(item => item.product.id !== productId);
    this.cartItems.set(updatedItems);
  }

  clearCart() {
    this.cartItems.set([]);
  }
}
