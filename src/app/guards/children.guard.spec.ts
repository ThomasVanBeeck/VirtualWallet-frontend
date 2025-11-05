import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { childrenGuard } from './children.guard';

describe('childrenGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => childrenGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
