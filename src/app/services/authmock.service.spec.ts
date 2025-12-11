import { TestBed } from '@angular/core/testing';

import { AuthmockService } from './authmock.service';

describe('AuthmockService', () => {
  let service: AuthmockService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthmockService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
