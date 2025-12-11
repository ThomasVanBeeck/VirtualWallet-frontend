import { TestBed } from '@angular/core/testing';

import { MarketDatamockService } from './market-datamock.service';

describe('MarketDatamockService', () => {
  let service: MarketDatamockService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MarketDatamockService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
