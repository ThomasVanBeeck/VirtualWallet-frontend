import { InjectionToken } from '@angular/core';
import { IAuthService } from './interfaces/i-auth.service';
import { IMarketDataService } from './interfaces/i-market-data.service';
import { IOrdersService } from './interfaces/i-orders.service';
import { IUserService } from './interfaces/i-user.service';
import { IWalletService } from './interfaces/i-wallet.service';

export const AUTH_SERVICE_TOKEN = new InjectionToken<IAuthService>('Auth Service');
export const MARKETDATA_SERVICE_TOKEN = new InjectionToken<IMarketDataService>(
  'Marketdata Service'
);
export const ORDERS_SERVICE_TOKEN = new InjectionToken<IOrdersService>('Orders Service');
export const USER_SERVICE_TOKEN = new InjectionToken<IUserService>('User Service');
export const WALLET_SERVICE_TOKEN = new InjectionToken<IWalletService>('Wallet Service');
