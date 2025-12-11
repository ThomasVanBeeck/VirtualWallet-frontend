import { TestBed } from '@angular/core/testing';

import { AbstractUserService } from './abstractuser.service';

describe('AbstractuserService', () => {
  let service: AbstractUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AbstractUserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
