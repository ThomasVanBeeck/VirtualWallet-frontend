import { TestBed } from '@angular/core/testing';

import { OrdersmockService } from './ordersmock.service';

describe('OrdersmockService', () => {
  let service: OrdersmockService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrdersmockService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
