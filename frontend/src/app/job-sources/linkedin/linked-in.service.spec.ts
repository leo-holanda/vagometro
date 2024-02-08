import { TestBed } from '@angular/core/testing';

import { LinkedInService } from './linked-in.service';

describe('LinkedInService', () => {
  let service: LinkedInService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LinkedInService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
