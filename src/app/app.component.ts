import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { ToastService } from './services/toast.service';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    RouterOutlet, 
    RouterLink, 
    FormsModule, 
    NavbarComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  // Services
  private readonly toastService = inject(ToastService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  
  // Propriétés globales
  readonly title = 'tech-shop-premium';
  readonly currentToast = this.toastService.toast;

  // Signaux d'état
  readonly isAdmin = this.authService.isAdminConnected;
  readonly showLoginModal = signal<boolean>(false);
  readonly usernameInput = signal<string>('');
  readonly passwordInput = signal<string>('');
  readonly loginError = signal<string>(''); // Résout l'erreur TS2339 pour loginError

  // Actions de la modale
  openLoginModal(): void {
    this.showLoginModal.set(true);
  }

  closeModal(): void {
    this.showLoginModal.set(false);
    this.resetForm();
  }

  // Actions d'authentification
  loginAdmin(): void {
    this.loginError.set('');
    
    const success = this.authService.login(this.usernameInput(), this.passwordInput());
    
    if (success) {
      this.closeModal();
      this.router.navigate(['/admin']);
    } else {
      this.loginError.set('Identifiants admin incorrects.');
    }
  }


  logoutAdmin(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  // Nettoyage des champs et erreurs du formulaire
  private resetForm(): void {
    this.usernameInput.set('');
    this.passwordInput.set('');
    this.loginError.set('');
  }
}
