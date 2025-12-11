import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';

import { environment } from '../environments/environment';
import { AuthService } from './services/auth.service';
import { AuthmockService } from './services/authmock.service';
import { MarketDataService } from './services/market-data.service';
import { MarketDatamockService } from './services/market-datamock.service';
import { OrdersService } from './services/orders.service';
import { OrdersmockService } from './services/ordersmock.service';
import { UserService } from './services/user.service';
import { UsermockService } from './services/usermock.service';
import { WalletService } from './services/wallet.service';
import { WalletmockService } from './services/walletmock.service';
import {
  AUTH_SERVICE_TOKEN,
  MARKETDATA_SERVICE_TOKEN,
  ORDERS_SERVICE_TOKEN,
  USER_SERVICE_TOKEN,
  WALLET_SERVICE_TOKEN,
} from './tokens';

const AuthServiceClass = environment.mockApi ? AuthmockService : AuthService;
const MarketDataServiceClass = environment.mockApi ? MarketDatamockService : MarketDataService;
const OrdersServiceClass = environment.mockApi ? OrdersmockService : OrdersService;
const UserServiceClass = environment.mockApi ? UsermockService : UserService;
const WalletServiceClass = environment.mockApi ? WalletmockService : WalletService;

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    { provide: AUTH_SERVICE_TOKEN, useClass: AuthServiceClass },
    { provide: MARKETDATA_SERVICE_TOKEN, useClass: MarketDataServiceClass },
    { provide: ORDERS_SERVICE_TOKEN, useClass: OrdersServiceClass },
    { provide: USER_SERVICE_TOKEN, useClass: UserServiceClass },
    { provide: WALLET_SERVICE_TOKEN, useClass: WalletServiceClass },
  ],
};
