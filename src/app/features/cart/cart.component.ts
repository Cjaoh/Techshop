import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service'; // <- AJOUTE CET IMPORT
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent {
  private cartService = inject(CartService);
  private orderService = inject(OrderService); // <- AJOUTE CETTE INJECTION

  cartItems = this.cartService.cartItems;
  totalPriceBeforeDiscount = this.cartService.totalPrice;
  totalItems = this.cartService.totalItems;

  promoInput = signal<string>('');
  activeDiscount = signal<number>(0);
  promoError = signal<string>('');
  promoSuccess = signal<string>('');

  private validCoupons: { [key: string]: number } = {
    'MADA20': 20, 'TECH10': 10, 'PREMIUM5': 5
  };

  discountAmount = computed(() => Math.round((this.totalPriceBeforeDiscount() * this.activeDiscount()) / 100));
  totalPrice = computed(() => this.totalPriceBeforeDiscount() - this.discountAmount());

  applyCoupon() {
    const code = this.promoInput().trim().toUpperCase();
    if (!code) { this.promoError.set('Veuillez saisir un code.'); this.promoSuccess.set(''); return; }
    if (this.validCoupons[code] !== undefined) {
      this.activeDiscount.set(this.validCoupons[code]);
      this.promoSuccess.set(`Code ${code} appliqué : -${this.validCoupons[code]}% !`);
      this.promoError.set('');
    } else {
      this.promoError.set('Code promotionnel invalide.'); this.promoSuccess.set(''); this.activeDiscount.set(0);
    }
  }

  incrementQuantity(product: Product) { this.cartService.addToCart(product); }
  decrementQuantity(productId: number) {
    const items = this.cartItems();
    const existingItem = items.find(item => item.product.id === productId);
    if (existingItem) {
      if (existingItem.quantity > 1) { existingItem.quantity -= 1; this.cartService.cartItems.set([...items]); }
      else { this.removeFromCart(productId); }
    }
  }

  removeFromCart(productId: number) {
    this.cartService.removeFromCart(productId);
    if (this.cartItems().length === 0) { this.clearPromo(); }
  }

  clearCart() { this.cartService.clearCart(); this.clearPromo(); }
  clearPromo() { this.promoInput.set(''); this.activeDiscount.set(0); this.promoSuccess.set(''); this.promoError.set(''); }

  // MODIFICATION DE LA MÉTHODE CHECKOUT :
  checkout() {
    // Enregistrement de la commande dans l'historique global
    this.orderService.addOrder(this.totalPrice(), this.totalItems());
    
    alert('🎉 Commande enregistrée avec succès ! Retrouvez votre reçu dans votre espace commandes.');
    this.clearCart();
  }
}
