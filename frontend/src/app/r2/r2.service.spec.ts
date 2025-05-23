import { TestBed } from '@angular/core/testing';

import { R2Service } from './r2.service';

describe('R2Service', () => {
  let service: R2Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(R2Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
