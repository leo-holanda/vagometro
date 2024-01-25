import { TestBed } from '@angular/core/testing';

import { GupyService } from './gupy.service';

describe('GupyService', () => {
  let service: GupyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GupyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
