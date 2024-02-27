import { TestBed } from '@angular/core/testing';

import { EasySearchService } from './easy-search.service';

describe('EasySearchService', () => {
  let service: EasySearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EasySearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
