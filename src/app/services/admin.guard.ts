import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Bloque radicalement l'accès si l'admin n'est pas connecté au préalable
  if (authService.isAdminConnected()) {
    return true;
  }

  router.navigate(['/']); // Redirection immédiate vers l'accueil
  return false;
};
