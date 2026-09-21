import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { CartService } from '../../../services/cart.service';
import { ToastService } from '../../../services/toast.service';
import { WishlistService } from '../../../services/wishlist.service';
import { Product } from '../../../models/product.model';
import { SkeletonLoaderComponent } from '../../../shared/skeleton-loader/skeleton-loader.component';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, SkeletonLoaderComponent],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private toastService = inject(ToastService);
  private wishlistService = inject(WishlistService);

  product = signal<Product | null>(null);
  similarProducts = signal<Product[]>([]);
  loading = signal(true);

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      if (id) {
        this.loadProductDetail(id);
      }
    });
  }

  private loadProductDetail(id: number): void {
    this.loading.set(true);
    this.productService.getProductById(id).subscribe({
      next: (data) => {
        const formattedProduct: Product = {
          ...data,
          price: Math.round(data.price * 4500),
          stock: Math.floor(Math.random() * 15) + 1
        };
        this.product.set(formattedProduct);
        this.loadSimilarProducts(data.category, id);
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.loading.set(false);
      }
    });
  }

  private loadSimilarProducts(category: string, currentId: number): void {
    this.productService.getProducts().subscribe({
      next: (all) => {
        const filtered = all
          .filter(p => p.category === category && p.id !== currentId)
          .slice(0, 4)
          .map(p => ({
            ...p,
            price: Math.round(p.price * 4500),
            stock: Math.floor(Math.random() * 10) + 1
          }));
        this.similarProducts.set(filtered);
      }
    });
  }

  addToCart(prod: Product = this.product()!): void {
    if (prod && prod.stock && prod.stock > 0) {
      this.cartService.addToCart(prod);
      prod.stock -= 1;
      this.toastService.show(`"${prod.title}" ajouté au panier !`, 'success');
    }
  }

  toggleWishlist(prod: Product = this.product()!): void {
    if (prod) {
      this.wishlistService.toggleWishlist(prod);
    }
  }

  isInWishlist(productId: number): boolean {
    return this.wishlistService.isInWishlist(productId);
  }
}
