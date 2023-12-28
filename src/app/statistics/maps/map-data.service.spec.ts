import { TestBed } from '@angular/core/testing';

import { MapDataService } from './map-data.service';

describe('MapDataService', () => {
  let service: MapDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MapDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
