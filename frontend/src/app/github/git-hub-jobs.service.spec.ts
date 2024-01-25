import { TestBed } from '@angular/core/testing';

import { GitHubJobsService } from './git-hub-jobs.service';

describe('GitHubJobsService', () => {
  let service: GitHubJobsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GitHubJobsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
