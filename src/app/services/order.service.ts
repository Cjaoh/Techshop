import { Injectable, signal, computed, effect } from '@angular/core';

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
  // Chargement brut depuis le stockage local sans calcul de minutes
  orders = signal<Order[]>(this.loadOrdersFromStorage());

  totalSpent = computed(() => this.orders().reduce((sum, o) => sum + o.total, 0));
  totalItemsBought = computed(() => this.orders().reduce((sum, o) => sum + o.itemsCount, 0));
  averageOrderValue = computed(() => {
    const count = this.orders().length;
    return count > 0 ? Math.round(this.totalSpent() / count) : 0;
  });

  constructor() {
    effect(() => {
      localStorage.setItem('tech_shop_orders', JSON.stringify(this.orders()));
    });
  }

  private loadOrdersFromStorage(): Order[] {
    const saved = localStorage.getItem('tech_shop_orders');
    return saved ? JSON.parse(saved) : [];
  }

  addOrder(total: number, itemsCount: number) {
    const newOrder: Order = {
      id: 'TS-' + Math.floor(100000 + Math.random() * 900000),
      date: new Date().toLocaleDateString('fr-FR'),
      itemsCount,
      total,
      status: '⏳ Préparation' // Statut de départ par défaut
    };
    this.orders.set([newOrder, ...this.orders()]);
  }

  // MÉTHODE EXCLUSIVE POUR L'ADMINISTRATEUR (OPTION ACTION MANUELLE)
  updateOrderStatus(orderId: string, newStatus: string) {
    const updatedOrders = this.orders().map(order => {
      if (order.id === orderId) {
        return { ...order, status: newStatus };
      }
      return order;
    });
    this.orders.set(updatedOrders);
  }
}
