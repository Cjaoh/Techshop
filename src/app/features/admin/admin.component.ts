import { Component, inject, signal, effect, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service'; // <- Import du service d'authentification
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
  private authService = inject(AuthService); // <- Injection du service

  orders = this.orderService.orders;

  @ViewChild('salesChart') salesChartCanvas!: ElementRef<HTMLCanvasElement>;
  private chart: Chart | null = null;

  // Lecture directe du statut global de connexion
  isAuthenticated = this.authService.isAdminConnected;
  
  usernameInput = signal<string>('');
  passwordInput = signal<string>('');
  loginError = signal<string>('');
  activeTab = signal<'status' | 'ca'>('status');

  constructor() {
    effect(() => {
      if (this.isAuthenticated() && this.orders().length >= 0 && this.activeTab()) {
        setTimeout(() => this.initChart(), 50);
      }
    });
  }

  login() {
    // Appel du validateur centralisé
    const success = this.authService.login(this.usernameInput(), this.passwordInput());
    if (!success) {
      this.loginError.set('Identifiants administrateur incorrects.');
    } else {
      this.loginError.set('');
    }
  }

  logout() {
    this.authService.logout();
    this.usernameInput.set('');
    this.passwordInput.set('');
    if (this.chart) { this.chart.destroy(); this.chart = null; }
  }

  setTab(tab: 'status' | 'ca') { this.activeTab.set(tab); }

  initChart() {
    if (!this.salesChartCanvas) return;
    if (this.chart) this.chart.destroy();
    const ctx = this.salesChartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    const ordersChronological = [...this.orders()].reverse();
    const labels = ordersChronological.map(o => `Cmd ${o.id}`);

    if (this.activeTab() === 'status') {
      let totalPrep = 0; let totalShipped = 0; let totalDelivered = 0;
      const dataPrep: number[] = []; const dataShipped: number[] = []; const dataDelivered: number[] = [];

      ordersChronological.forEach(o => {
        if (o.status.includes('Préparation')) totalPrep += o.total;
        else if (o.status.includes('Expédié')) totalShipped += o.total;
        else if (o.status.includes('Livré')) totalDelivered += o.total;
        dataPrep.push(totalPrep); dataShipped.push(totalShipped); dataDelivered.push(totalDelivered);
      });

      this.chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            { label: 'En Préparation (Ar)', data: dataPrep, borderColor: '#f97316', backgroundColor: 'rgba(249, 115, 22, 0.01)', borderWidth: 3, tension: 0.2 },
            { label: 'Expédiées (Ar)', data: dataShipped, borderColor: '#3b82f6', backgroundColor: 'rgba(59, 130, 246, 0.01)', borderWidth: 3, tension: 0.2 },
            { label: 'Livrées (Ar)', data: dataDelivered, borderColor: '#22c55e', backgroundColor: 'rgba(34, 197, 94, 0.01)', borderWidth: 3, tension: 0.2 }
          ]
        },
        options: this.getChartOptions()
      });
    } else {
      let runningTotalCA = 0;
      const dataCA = ordersChronological.map(o => { runningTotalCA += o.total; return runningTotalCA; });
      this.chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{ label: 'Chiffre d\'Affaires Total Cumulé (Ar)', data: dataCA, borderColor: '#a855f7', backgroundColor: 'rgba(168, 85, 247, 0.05)', borderWidth: 4, tension: 0.3, fill: true }]
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
      plugins: { legend: { labels: { color: isDark ? '#fff' : '#000', font: { size: 11, weight: 'bold' as const } } } },
      scales: {
        y: { grid: { color: 'rgba(128, 128, 128, 0.08)' }, ticks: { color: isDark ? '#a3a3a3' : '#4b5563' } },
        x: { grid: { display: false }, ticks: { color: isDark ? '#a3a3a3' : '#4b5563' } }
      }
    };
  }

  shipOrder(orderId: string) { this.orderService.updateOrderStatus(orderId, '🚚 Expédié'); }
  deliverOrder(orderId: string) { this.orderService.updateOrderStatus(orderId, '📦 Livré'); }
}
