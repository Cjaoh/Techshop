import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent {
  // Injection directe du service de panier
  private cartService = inject(CartService);

  // Exposition des signaux pour le template HTML
  cartItems = this.cartService.cartItems;
  totalPrice = this.cartService.totalPrice;
  totalItems = this.cartService.totalItems;

  // Actions de modification du panier
  incrementQuantity(product: Product) {
    this.cartService.addToCart(product);
  }

  decrementQuantity(productId: number) {
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

  removeFromCart(productId: number) {
    this.cartService.removeFromCart(productId);
  }

  clearCart() {
    this.cartService.clearCart();
  }

  // Ajoute simplement cette méthode dans ta classe CartComponent existante :
checkout() {
  alert('🎉 Commande enregistrée avec succès ! Merci pour votre achat premium.');
  this.clearCart();
}

}
