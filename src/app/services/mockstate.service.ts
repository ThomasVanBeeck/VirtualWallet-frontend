import { Injectable } from '@angular/core';
import { HoldingSummaryDto } from '../DTOs/HoldingDtos';
import { OrderDto } from '../DTOs/OrderDtos';
import { TransferSummaryDto } from '../DTOs/TransferDtos';
import { UserRegisterDto } from '../DTOs/UserDtos';
import { WalletSummaryDto } from '../DTOs/WalletDtos';

@Injectable({
  providedIn: 'root',
})
export class MockstateService {
  constructor() {
    this.createOrderMockData(6);
    this.createWalletMockData(15);
    this.mockWallet.transferPage = {
      transfers: this.mockTransferList,
      pageNumber: 1,
      totalPages: this.mockTransferList.length,
    };

    let totalCash = 0;
    for (const tf of this.mockTransferList) {
      if (tf.type === 'Deposit') totalCash += tf.amount;
      else totalCash -= tf.amount;
    }
    this.mockWallet.totalCash = totalCash;
  }

  public isMockLoggedIn: boolean = false;

  mockOrder1: OrderDto = {
    stockName: 'Tesla',
    date: new Date().toISOString(),
    type: 'Buy',
    price: 123.45,
    amount: 5,
    total: 123.45 * 5,
  };

  mockOrder2: OrderDto = {
    stockName: 'Bitcoin',
    date: new Date().toISOString(),
    type: 'Sell',
    price: 234.56,
    amount: 3,
    total: 234.56 * 3,
  };

  mockOrderList: OrderDto[] = [];

  private mockHolding1: HoldingSummaryDto = {
    stockName: 'TSLA',
    amount: 7,
    currentPrice: 99,
    totalValue: 693,
    totalProfit: 185.85,
    winLossPct: 36.65,
  };

  public mockTransferList: TransferSummaryDto[] = [];

  public mockWallet: WalletSummaryDto = {
    holdings: [this.mockHolding1],
    transferPage: { transfers: [], pageNumber: 0, totalPages: 0 },
    totalCash: 0,
    totalInStocks: 10685.85,
    totalProfit: 185.85,
    winLossPct: 1.77,
  };

  public mockUser: UserRegisterDto = {
    Username: 'ThomasVanBeeck',
    FirstName: 'Thomas',
    LastName: 'Van Beeck',
    Email: 'thomas@vanbeeck.be',
    Password: 'Test1234Test!',
  };

  public mockNewUsers: Array<UserRegisterDto> = [this.mockUser];
  public currentMockUser: UserRegisterDto | null = null;

  private createOrderMockData(numSets: number): void {
    for (let i = 0; i < numSets; i++) {
      const randomAmount: number = Math.floor(Math.random() * 10 + 1);
      let randomType: string = 'Sell';
      if (randomAmount % 2 == 0) randomType = 'Buy';
      const order1: OrderDto = {
        ...this.mockOrder1,
        date: new Date().toISOString(),
        price: this.mockOrder1.price + i * 0.1,
        amount: randomAmount,
        type: randomType,
        total: (this.mockOrder1.price + i * 0.1) * randomAmount,
      };
      const order2: OrderDto = {
        ...this.mockOrder2,
        date: new Date().toISOString(),
        price: this.mockOrder2.price - i * 0.1,
        amount: randomAmount,
        type: randomType,
        total: (this.mockOrder2.price - i * 0.1) * randomAmount,
      };

      this.mockOrderList.push(order1);
      this.mockOrderList.push(order2);
    }
    console.log(`Mock Order List total: ${this.mockOrderList.length} orders.`);
  }

  private createWalletMockData(num: number): void {
    const firstTransfer: TransferSummaryDto = {
      date: new Date().toISOString(),
      amount: 50000,
      type: 'Deposit',
    };
    this.mockTransferList.unshift(firstTransfer);

    for (let i = 0; i < num; i++) {
      const randomAmount: number = Math.floor((Math.random() * 10 + 1) * 5);
      let randomType: string = 'Deposit';
      if (randomAmount % 2 == 0) randomType = 'Withdrawal';
      const transfer1: TransferSummaryDto = {
        date: new Date().toISOString(),
        amount: randomAmount,
        type: randomType,
      };
      this.mockTransferList.unshift(transfer1);
    }
    console.log(`Mock Transfer List total: ${this.mockTransferList.length} transfers.`);
  }
}
