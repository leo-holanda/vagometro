import { Injectable } from '@angular/core';
import { JobSources, jobSourcesMap } from './job-sources.types';
import { JobService } from '../job/job.service';
import { combineLatest, first } from 'rxjs';
import { GupyService } from './gupy/gupy.service';
import { GitHubJobsService } from './github/git-hub-jobs.service';

@Injectable({
  providedIn: 'root',
})
export class JobSourcesService {
  activeJobSources = jobSourcesMap;

  constructor(
    private jobService: JobService,
    private gupyService: GupyService,
    private githubJobsService: GitHubJobsService
  ) {}

  toggleJobSource(jobSource: JobSources): void {
    const currentJobSourceState = this.activeJobSources[jobSource];

    if (currentJobSourceState)
      this.activeJobSources[jobSource].isActive =
        !currentJobSourceState.isActive;

    this.updateJobs();
  }

  updateJobs(): void {
    const jobsObservables = [];

    if (this.activeJobSources.gupy.isActive)
      jobsObservables.push(this.gupyService.jobs$);

    if (this.activeJobSources.frontendbr.isActive)
      jobsObservables.push(this.githubJobsService.frontendJobs$);

    if (this.activeJobSources.backendbr.isActive)
      jobsObservables.push(this.githubJobsService.backendJobs$);

    if (jobsObservables.length == 0) this.jobService.setJobs([]);
    else {
      combineLatest(jobsObservables)
        .pipe(first())
        .subscribe((allJobs) => {
          this.jobService.setJobs(allJobs.flat());
        });
    }
  }
}
