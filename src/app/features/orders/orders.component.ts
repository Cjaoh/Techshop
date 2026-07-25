import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OrderService, Order } from '../../services/order.service';

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
  totalSpent = this.orderService.totalSpent;
  totalItemsBought = this.orderService.totalItemsBought;
  averageOrderValue = this.orderService.averageOrderValue;

  // SYSTEME EXCLUSIF GENERATEUR DE FACTURE PDF PRO
  printInvoice(order: Order) {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    // Calcul des taxes fictives (ex: TVA 20% à Madagascar incluse)
    const ht = Math.round(order.total / 1.2);
    const tva = order.total - ht;

    printWindow.document.write(`
      <html>
        <head>
          <title>Facture ${order.id}</title>
          <link href="jsdelivr.net" rel="stylesheet">
          <style>
            body { font-family: sans-serif; background-color: white; color: black; }
          </style>
        </head>
        <body class="p-10">
          <div class="max-w-2xl mx-auto border p-8 rounded-xl shadow-sm">
            <div class="flex justify-between items-start border-b pb-6 mb-6">
              <div>
                <h1 class="text-2xl font-black text-blue-600 tracking-tight">TECHSHOP PREMIUM</h1>
                <p class="text-xs text-gray-500 mt-1">Soarano, Antananarivo, Madagascar</p>
              </div>
              <div class="text-right">
                <h2 class="text-lg font-bold text-gray-800">FACTURE</h2>
                <p class="text-sm font-mono font-bold text-blue-600 mt-1">${order.id}</p>
                <p class="text-xs text-gray-400 mt-0.5">Date : ${order.date}</p>
              </div>
            </div>

            <div class="mb-8">
              <h3 class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Destinataire</h3>
              <p class="text-sm font-bold text-gray-800">Compte Client Premium</p>
              <p class="text-xs text-gray-500">Madagascar</p>
            </div>

            <table class="w-full text-left text-sm mb-6 border-b">
              <thead>
                <tr class="bg-gray-50 text-gray-500 font-bold text-xs uppercase">
                  <th class="p-3">Désignation</th>
                  <th class="p-3 text-right">Total (Ar)</th>
                </tr>
              </thead>
              <tbody class="divide-y text-gray-700">
                <tr>
                  <td class="p-3 font-medium">Panier d'articles électroniques (${order.itemsCount} article(s))</td>
                  <td class="p-3 text-right font-bold">${order.total.toLocaleString('fr-FR')} Ar</td>
                </tr>
              </tbody>
            </table>

            <div class="w-1/2 ml-auto space-y-2 text-sm text-gray-600">
              <div class="flex justify-between text-xs">
                <span>Montant HT :</span>
                <span>${ht.toLocaleString('fr-FR')} Ar</span>
              </div>
              <div class="flex justify-between text-xs">
                <span>TVA (20%) :</span>
                <span>${tva.toLocaleString('fr-FR')} Ar</span>
              </div>
              <div class="flex justify-between text-base font-black text-gray-900 pt-2 border-t">
                <span>Total TTC :</span>
                <span class="text-blue-600">${order.total.toLocaleString('fr-FR')} Ar</span>
              </div>
            </div>

            <div class="mt-12 text-center text-[10px] text-gray-400 border-t pt-4">
              Merci pour votre confiance. Facture certifiée conforme par le protocole TechShop Premium.
            </div>
          </div>
          <script>
            window.onload = function() { window.print(); window.close(); }
          </script>
        </body>
      </html>
    `);

    printWindow.document.close();
  }
}
