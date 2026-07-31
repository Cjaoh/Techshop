import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { CartService } from '../../../services/cart.service';
import { ToastService } from '../../../services/toast.service';
import { WishlistService } from '../../../services/wishlist.service';
import { Product } from '../../../models/product.model';

import { SkeletonLoaderComponent } from '../../../shared/skeleton-loader/skeleton-loader.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, SkeletonLoaderComponent],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private toastService = inject(ToastService);
  private wishlistService = inject(WishlistService);

  // Signaux d'état pour les données de l'API
  products = signal<Product[]>([]);
  loading = signal(true);

  // Signaux d'état pour les 3 filtres avancés
  selectedCategory = signal<string>('all');
  searchQuery = signal<string>('');
  maxPrice = signal<number>(5000000);
  sortBy = signal<string>('default');

  // Liste statique des catégories
  categories = ['all', "electronics", "jewelery", "men's clothing", "women's clothing"];

  // Signal calculé combinant le filtrage textuel, par catégorie, par prix et le tri
  filteredProducts = computed(() => {
    let result = this.products();

    // 1. Filtrage par catégorie
    const category = this.selectedCategory();
    if (category !== 'all') {
      result = result.filter(p => p.category === category);
    }

    // 2. Filtrage par recherche textuelle (insensible à la casse)
    const query = this.searchQuery().trim().toLowerCase();
    if (query) {
      result = result.filter(p => 
        p.title.toLowerCase().includes(query) || 
        p.description.toLowerCase().includes(query)
      );
    }

    // 3. Filtrage par prix maximum
    const limitPrice = this.maxPrice();
    result = result.filter(p => p.price <= limitPrice);

    // 4. Tri des données (Défaut, Croissant, Décroissant, Note)
    const sort = this.sortBy();
    if (sort === 'asc') {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sort === 'desc') {
      result = [...result].sort((a, b) => b.price - a.price);
    } else if (sort === 'rating') {
      result = [...result].sort((a, b) => (b.rating?.rate || 0) - (a.rating?.rate || 0));
    }

    return result;
  });

  ngOnInit() {
    this.productService.getProducts().subscribe({
      next: (data) => {
        const productsInAriary = data.map(p => ({
          ...p,
          price: Math.round(p.price * 4500),
          stock: Math.floor(Math.random() * 16)
        }));
        
        this.products.set(productsInAriary);
        
        if (productsInAriary.length > 0) {
          const highestPrice = Math.max(...productsInAriary.map(p => p.price));
          this.maxPrice.set(Math.ceil(highestPrice));
        }
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Erreur API :', err);
        this.loading.set(false);
      }
    });
  }

  changeCategory(category: string) {
    this.selectedCategory.set(category);
  }

  updateSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
  }

  updatePrice(event: Event) {
    const input = event.target as HTMLInputElement;
    this.maxPrice.set(Number(input.value));
  }

  updateSort(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.sortBy.set(select.value);
  }

  addToCart(product: Product) {
    if (product.stock !== undefined && product.stock > 0) {
      this.cartService.addToCart(product);
      product.stock -= 1;
      this.toastService.show(`"${product.title}" ajouté au panier !`, 'success');
    }
  }

  toggleWishlist(product: Product, event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    this.wishlistService.toggleWishlist(product);
  }

  isInWishlist(productId: number): boolean {
    return this.wishlistService.isInWishlist(productId);
  }
}
