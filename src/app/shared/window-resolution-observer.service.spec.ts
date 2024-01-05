import { TestBed } from '@angular/core/testing';

import { WindowResolutionObserverService } from './window-resolution-observer.service';

describe('WindowResolutionObserverService', () => {
  let service: WindowResolutionObserverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WindowResolutionObserverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
