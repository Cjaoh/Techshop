import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { LucideAngularModule, ShoppingCart, Sun, Moon, Menu } from 'lucide-angular';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, LucideAngularModule],
  templateUrl: './navbar.component.html'
})
export class NavbarComponent {
  // Injection du service de panier
  private cartService = inject(CartService); 

  // Propriété pour la gestion du thème
  isDark = false;

  // Raccourcis vers les icônes Lucide pour le HTML
  readonly ShoppingCart = ShoppingCart;
  readonly Sun = Sun;
  readonly Moon = Moon;
  readonly Menu = Menu;

  // Exposition du signal calculé pour afficher le nombre d'articles
  totalItems = this.cartService.totalItems;

  // Gestion du basculement de thème (Clair / Sombre)
  toggleTheme() {
    this.isDark = !this.isDark;
    document.documentElement.classList.toggle('dark');
  }
}
