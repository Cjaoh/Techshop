import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { ThemeService } from '../../services/theme.service';
import { WishlistService } from '../../services/wishlist.service';
import { SlideOverService } from '../../services/slide-over.service';
import { LucideAngularModule, ShoppingCart, Sun, Moon, Menu, Heart } from 'lucide-angular';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, LucideAngularModule],
  templateUrl: './navbar.component.html'
})
export class NavbarComponent {
  private readonly cartService = inject(CartService);
  private readonly themeService = inject(ThemeService);
  private readonly wishlistService = inject(WishlistService);
  private readonly slideOverService = inject(SlideOverService);

  readonly currentTheme = this.themeService.theme;

  readonly ShoppingCart = ShoppingCart;
  readonly Sun = Sun;
  readonly Moon = Moon;
  readonly Menu = Menu;
  readonly Heart = Heart;

  totalItems = this.cartService.totalItems;
  totalWishlistItems = this.wishlistService.totalWishlistItems;

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  openCart(): void {
    this.slideOverService.open();
  }
}
