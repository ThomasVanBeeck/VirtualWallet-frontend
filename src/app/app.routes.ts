import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { MainlayoutComponent } from './mainlayout/mainlayout.component';
import { authGuard } from './guards/auth.guard';
import { childrenGuard } from './guards/children.guard';
import { AuthlayoutComponent } from './authlayout/authlayout.component';
import { loggedinGuard } from './guards/loggedin.guard';

export const routes: Routes = [
    {
        path: '', component: AuthlayoutComponent,
        canActivate: [loggedinGuard],
        children: [
            { path: 'register', loadComponent: () => import('./register/register.component').then(m => m.RegisterComponent) },
            { path: 'login', loadComponent: () => import('./login/login.component').then(m => m.LoginComponent) },
            { path: '', redirectTo: 'login', pathMatch: 'full' }
        ]
     },
    {
        path: 'login', component: LoginComponent
    },
    {
        path: 'app', component: MainlayoutComponent,
        canActivate: [authGuard],
        canActivateChild: [childrenGuard],
        children: [
            { path: 'welcome', loadComponent: () => import('./welcome/welcome.component').then(m => m.WelcomeComponent) },
            { path: 'wallet', loadComponent: () => import('./wallet/wallet.component').then(m => m.WalletComponent) },
            { path: 'market', loadComponent: () => import('./market/market.component').then(m => m.MarketComponent) },
            { path: 'orders', loadComponent: () => import('./orders/orders.component').then(m =>m.OrdersComponent)},
            { path: '', redirectTo: 'welcome', pathMatch: 'full' },
            { path: '**', redirectTo: ''}
    ]
  },
    { path: '**', redirectTo: ''}
];
