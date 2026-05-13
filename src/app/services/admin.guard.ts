import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Si l'admin est connecté, on le laisse passer
  if (authService.isAdminConnected()) {
    return true;
  }

  // Sinon, on le bloque violemment et on le renvoie à l'accueil
  router.navigate(['/']);
  return false;
};
