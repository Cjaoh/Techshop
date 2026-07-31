import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService, CartItem } from '../../services/cart.service';
import { SlideOverService } from '../../services/slide-over.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-slide-over-cart',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './slide-over-cart.component.html',
  styleUrls: ['./slide-over-cart.component.css']
})
export class SlideOverCartComponent {
  private readonly cartService = inject(CartService);
  private readonly slideOverService = inject(SlideOverService);

  // Accès aux signaux du CartService
  cartItems = this.cartService.cartItems;
  totalPriceBeforeDiscount = this.cartService.totalPrice;
  totalItems = this.cartService.totalItems;

  // Gestion des codes promo dans le slide-over
  promoInput = signal<string>('');
  activeDiscount = signal<number>(0);
  promoError = signal<string>('');
  promoSuccess = signal<string>('');

  private validCoupons: { [key: string]: number } = {
    'MADA20': 20, 'TECH10': 10, 'PREMIUM5': 5
  };

  // Calculs pour le panier
  discountAmount = computed(() => Math.round((this.totalPriceBeforeDiscount() * this.activeDiscount()) / 100));
  totalPrice = computed(() => this.totalPriceBeforeDiscount() - this.discountAmount());

  // État d'ouverture du slide-over
  isOpen = this.slideOverService.isOpen;

  // Fermer le panier
  close(): void {
    this.slideOverService.close();
  }

  // Appliquer un code promo
  applyCoupon(): void {
    const code = this.promoInput().trim().toUpperCase();
    if (!code) {
      this.promoError.set('Veuillez saisir un code.');
      this.promoSuccess.set('');
      return;
    }
    if (this.validCoupons[code] !== undefined) {
      this.activeDiscount.set(this.validCoupons[code]);
      this.promoSuccess.set(`Code ${code} appliqué : -${this.validCoupons[code]}% !`);
      this.promoError.set('');
    } else {
      this.promoError.set('Code promotionnel invalide.');
      this.promoSuccess.set('');
      this.activeDiscount.set(0);
    }
  }

  // Incrémenter la quantité
  incrementQuantity(product: Product): void {
    this.cartService.addToCart(product);
  }

  // Décrémenter la quantité
  decrementQuantity(productId: number): void {
    const items = this.cartItems();
    const existingItem = items.find(item => item.product.id === productId);
    if (existingItem) {
      if (existingItem.quantity > 1) {
        existingItem.quantity -= 1;
        this.cartService.cartItems.set([...items]);
      } else {
        this.removeFromCart(productId);
      }
    }
  }

  // Supprimer un article du panier
  removeFromCart(productId: number): void {
    this.cartService.removeFromCart(productId);
    if (this.cartItems().length === 0) {
      this.clearPromo();
    }
  }

  // Vider le panier
  clearCart(): void {
    this.cartService.clearCart();
    this.clearPromo();
  }

  // Réinitialiser les codes promo
  clearPromo(): void {
    this.promoInput.set('');
    this.activeDiscount.set(0);
    this.promoSuccess.set('');
    this.promoError.set('');
  }

  // Redirection vers la page panier complète
  goToFullCart(): void {
    this.close();
  }
}
