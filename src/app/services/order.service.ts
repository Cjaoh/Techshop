import { Injectable, signal, effect } from '@angular/core';

export interface Order {
  id: string;
  date: string;
  itemsCount: number;
  total: number;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  // Signal contenant la liste des commandes passées
  orders = signal<Order[]>(this.loadOrdersFromStorage());

  constructor() {
    // Sauvegarde automatique dans le LocalStorage à chaque nouvelle commande
    effect(() => {
      localStorage.setItem('tech_shop_orders', JSON.stringify(this.orders()));
    });
  }

  private loadOrdersFromStorage(): Order[] {
    const saved = localStorage.getItem('tech_shop_orders');
    return saved ? JSON.parse(saved) : [];
  }

  // Ajouter une nouvelle commande à l'historique
  addOrder(total: number, itemsCount: number) {
    const newOrder: Order = {
      id: 'TS-' + Math.floor(100000 + Math.random() * 900000), // Génère un ID unique (ex: TS-452107)
      date: new Date().toLocaleDateString('fr-FR'),
      itemsCount,
      total,
      status: 'En cours de préparation'
    };

    this.orders.set([newOrder, ...this.orders()]);
  }
}
