import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { UserService } from '../services/user.service';

export const loggedinGuard: CanActivateFn = () => {
  const userService = inject(UserService);
  const router = inject(Router);

  return userService.getCurrentUser().pipe(
    map(() => {
      // User bestaat dus user is ingelogd
      // Redirect naar app
      return router.createUrlTree(['/app']);
    }),
    catchError(() => {
      // User is NIET ingelogd
      // Laat login/register pagina gewoon tonen
      return of(true);
    })
  );
};
