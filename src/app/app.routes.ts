import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { MainlayoutComponent } from './components/mainlayout/mainlayout.component';
import { authGuard } from './guards/auth.guard';
import { childrenGuard } from './guards/children.guard';
import { AuthlayoutComponent } from './components/authlayout/authlayout.component';
import { loggedinGuard } from './guards/loggedin.guard';

export const routes: Routes = [
  {
    path: '',
    component: AuthlayoutComponent,
    canActivate: [loggedinGuard],
    children: [
      {
        path: 'register',
        loadComponent: () =>
          import('./components/register/register.component').then(
            (m) => m.RegisterComponent
          ),
      },
      {
        path: 'login',
        loadComponent: () =>
          import('./components/login/login.component').then(
            (m) => m.LoginComponent
          ),
      },
      { path: '', redirectTo: 'login', pathMatch: 'full' },
    ],
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'app',
    component: MainlayoutComponent,
    canActivate: [authGuard],
    canActivateChild: [childrenGuard],
    children: [
      {
        path: 'wallet',
        loadComponent: () =>
          import('./components/wallet/wallet.component').then(
            (m) => m.WalletComponent
          ),
      },
      {
        path: 'market',
        loadComponent: () =>
          import('./components/market/market.component').then(
            (m) => m.MarketComponent
          ),
      },
      {
        path: 'orders',
        loadComponent: () =>
          import('./components/orders/orders.component').then(
            (m) => m.OrdersComponent
          ),
      },
      { path: '', redirectTo: 'market', pathMatch: 'full' },
      { path: '**', redirectTo: '' },
    ],
  },
  { path: '**', redirectTo: '' },
];
