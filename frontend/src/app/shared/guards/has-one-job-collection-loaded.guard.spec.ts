import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { hasOneJobCollectionLoadedGuard } from './has-one-job-collection-loaded.guard';

describe('hasOneJobCollectionLoadedGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => hasOneJobCollectionLoadedGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
