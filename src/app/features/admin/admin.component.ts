import { Component, inject, signal, effect, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../services/order.service';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
  private orderService = inject(OrderService);
  orders = this.orderService.orders;

  @ViewChild('salesChart') salesChartCanvas!: ElementRef<HTMLCanvasElement>;
  private chart: Chart | null = null;

  isAuthenticated = signal<boolean>(false);
  usernameInput = signal<string>('');
  passwordInput = signal<string>('');
  loginError = signal<string>('');

  // Signal pour basculer entre l'analyse des statuts et le Chiffre d'Affaires (CA)
  activeTab = signal<'status' | 'ca'>('status');

  constructor() {
    effect(() => {
      // Re-dessine le graphique dès que l'admin se connecte, change d'onglet ou modifie une commande
      if (this.isAuthenticated() && this.orders().length >= 0 && this.activeTab()) {
        setTimeout(() => this.initChart(), 50);
      }
    });
  }

  login() {
    if (this.usernameInput() === 'ced@gmail.com' && this.passwordInput() === 'cedrick') {
      this.isAuthenticated.set(true);
      this.loginError.set('');
    } else {
      this.loginError.set('Identifiants administrateur incorrects.');
    }
  }

  logout() {
    this.isAuthenticated.set(false);
    this.usernameInput.set('');
    this.passwordInput.set('');
    if (this.chart) { this.chart.destroy(); this.chart = null; }
  }

  setTab(tab: 'status' | 'ca') {
    this.activeTab.set(tab);
  }

  initChart() {
    if (!this.salesChartCanvas) return;
    if (this.chart) { this.chart.destroy(); }

    const ctx = this.salesChartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    const ordersChronological = [...this.orders()].reverse();
    const labels = ordersChronological.map(o => `Cmd ${o.id}`);

    if (this.activeTab() === 'status') {
      // MODE 1 : LES 3 COURBES DE STATUTS INDÉPENDANTES
      let totalPrep = 0; let totalShipped = 0; let totalDelivered = 0;
      const dataPrep: number[] = []; const dataShipped: number[] = []; const dataDelivered: number[] = [];

      ordersChronological.forEach(o => {
        if (o.status.includes('Préparation')) totalPrep += o.total;
        else if (o.status.includes('Expédié')) totalShipped += o.total;
        else if (o.status.includes('Livré')) totalDelivered += o.total;

        dataPrep.push(totalPrep);
        dataShipped.push(totalShipped);
        dataDelivered.push(totalDelivered);
      });

      this.chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            { label: 'En Préparation (Ar)', data: dataPrep, borderColor: '#f97316', backgroundColor: 'rgba(249, 115, 22, 0.02)', borderWidth: 3, tension: 0.2 },
            { label: 'Expédiées (Ar)', data: dataShipped, borderColor: '#3b82f6', backgroundColor: 'rgba(59, 130, 246, 0.02)', borderWidth: 3, tension: 0.2 },
            { label: 'Livrées (Ar)', data: dataDelivered, borderColor: '#22c55e', backgroundColor: 'rgba(34, 197, 94, 0.02)', borderWidth: 3, tension: 0.2 }
          ]
        },
        options: this.getChartOptions()
      });

    } else {
      // MODE 2 : LA 4ÈME COURBE - CHIFFRE D'AFFAIRES GLOBAL CUMULÉ
      let runningTotalCA = 0;
      const dataCA = ordersChronological.map(o => {
        runningTotalCA += o.total;
        return runningTotalCA;
      });

      this.chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: 'Chiffre d\'Affaires Total Cumulé (Ar)',
            data: dataCA,
            borderColor: '#a855f7', // Violet Premium pour le CA global
            backgroundColor: 'rgba(168, 85, 247, 0.1)',
            borderWidth: 4,
            tension: 0.3,
            fill: true
          }]
        },
        options: this.getChartOptions()
      });
    }
  }

    private getChartOptions() {
    const isDark = document.documentElement.classList.contains('dark');
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { 
        legend: { 
          labels: { 
            color: isDark ? '#fff' : '#000', 
            font: { 
              size: 11, 
              weight: 'bold' as const // <- Ajout de 'as const' pour satisfaire le typage strict de Chart.js
            } 
          } 
        } 
      },
      scales: {
        y: { 
          grid: { color: 'rgba(128, 128, 128, 0.08)' }, 
          ticks: { color: isDark ? '#a3a3a3' : '#4b5563' } 
        },
        x: { 
          grid: { display: false }, 
          ticks: { color: isDark ? '#a3a3a3' : '#4b5563' } 
        }
      }
    };
  }


  shipOrder(orderId: string) { this.orderService.updateOrderStatus(orderId, '🚚 Expédié'); }
  deliverOrder(orderId: string) { this.orderService.updateOrderStatus(orderId, '📦 Livré'); }
}
