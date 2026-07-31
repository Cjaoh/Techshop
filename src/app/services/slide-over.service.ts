import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SlideOverService {
  // Signal pour gérer l'état d'ouverture du panier coulissant
  readonly isOpen = signal<boolean>(false);

  // Ouvrir le panier coulissant
  open(): void {
    this.isOpen.set(true);
    // Empêcher le scroll du body quand le panier est ouvert
    document.body.style.overflow = 'hidden';
  }

  // Fermer le panier coulissant
  close(): void {
    this.isOpen.set(false);
    // Rétablir le scroll du body
    document.body.style.overflow = '';
  }

  // Basculer l'état du panier
  toggle(): void {
    if (this.isOpen()) {
      this.close();
    } else {
      this.open();
    }
  }
}
