import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = new Router();

  const userData = localStorage.getItem('user');

  if (!userData) {
    router.navigate(['/login']);
    return false;
  }

  const user = JSON.parse(userData);

  // OPTIONAL: Role-based route protection
  const requiredRole = route.data?.['role'];

  if (requiredRole && user.role !== requiredRole) {
    router.navigate(['/dashboard']); // fallback
    return false;
  }

  return true;
};
