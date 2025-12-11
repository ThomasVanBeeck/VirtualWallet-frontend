import { TestBed } from '@angular/core/testing';

import { MockstateService } from './mockstate.service';

describe('MockstateService', () => {
  let service: MockstateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MockstateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
