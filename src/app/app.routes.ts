import { Routes } from '@angular/router';
import { authGuard } from './auth-guard'
import { Login } from './login/login';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: 'login', component:Login},
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./task-list/task-list').then(m => m.TaskList),
    canActivate: [authGuard]
  },
  {path: '**',redirectTo: 'login'}
];
