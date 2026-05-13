import { Injectable, signal } from '@angular/core';

export interface Toast {
  message: string;
  type: 'success' | 'error' | 'info';
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  toast = signal<Toast | null>(null);

  show(message: string, type: 'success' | 'error' | 'info' = 'success') {
    this.toast.set({ message, type });
    // Masquage automatique après 3 secondes (OPTION 2)
    setTimeout(() => {
      this.toast.set(null);
    }, 3000);
  }
}
