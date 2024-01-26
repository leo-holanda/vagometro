import { TestBed } from '@angular/core/testing';

import { JobSourcesService } from './job-sources.service';

describe('JobSourcesService', () => {
  let service: JobSourcesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JobSourcesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
