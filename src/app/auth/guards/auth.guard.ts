import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { APP_ROUTES } from '../../../config/routes.config';

/**
 * canMatch (and not canActivate): if the user is not logged in, the route
 * does not even match, so its lazy chunk is never downloaded.
 * We return a UrlTree (redirect) instead of `false` so the router does not
 * fall through to the next route (e.g. 'cv/add' would match 'cv/:id').
 */
export const authGuard: CanMatchFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isAuthenticated()
    ? true
    : router.createUrlTree([APP_ROUTES.login]);
};
