import { CanActivateFn } from '@angular/router';

export const childrenGuard: CanActivateFn = (route, state) => {
  return true;
};
