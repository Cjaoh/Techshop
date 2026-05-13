import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent {
  private orderService = inject(OrderService);
  
  orders = this.orderService.orders;
  
  // EXPOSITION DES SIGNALS DE STATISTIQUES POUR L'OPTION 3 :
  totalSpent = this.orderService.totalSpent;
  totalItemsBought = this.orderService.totalItemsBought;
  averageOrderValue = this.orderService.averageOrderValue;
}
