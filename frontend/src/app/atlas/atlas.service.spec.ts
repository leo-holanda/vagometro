import { TestBed } from '@angular/core/testing';

import { AtlasService } from './atlas.service';

describe('AtlasService', () => {
  let service: AtlasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AtlasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
