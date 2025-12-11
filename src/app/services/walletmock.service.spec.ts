import { TestBed } from '@angular/core/testing';

import { WalletmockService } from './walletmock.service';

describe('WalletmockService', () => {
  let service: WalletmockService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WalletmockService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
