import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Signal global pour savoir si l'utilisateur est admin ou non
  isAdminConnected = signal<boolean>(false);

  login(user: string, pass: string): boolean {
    if (user === 'ced@gmail.com' && pass === 'cedrick') {
      this.isAdminConnected.set(true);
      return true;
    }
    return false;
  }

  logout() {
    this.isAdminConnected.set(false);
  }
}
