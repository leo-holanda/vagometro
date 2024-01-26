import { Injectable } from '@angular/core';
import { JobSources, jobSourcesMap } from './job-sources.types';
import { JobService } from '../job/job.service';
import { BehaviorSubject, combineLatest, first } from 'rxjs';
import { GupyService } from './gupy/gupy.service';
import { GitHubJobsService } from './github/git-hub-jobs.service';
import { Job } from '../job/job.types';

@Injectable({
  providedIn: 'root',
})
export class JobSourcesService {
  private _hasOneJobSourceActive$ = new BehaviorSubject(false);
  hasOneJobSourceActive$ = this._hasOneJobSourceActive$.asObservable();

  jobSourcesMap = jobSourcesMap;

  constructor(
    private jobService: JobService,
    private gupyService: GupyService,
    private githubJobsService: GitHubJobsService
  ) {
    this.jobSourcesMap.gupy.dataSource = this.gupyService.jobs$;
    this.jobSourcesMap.frontendbr.dataSource =
      this.githubJobsService.frontendJobs$;
    this.jobSourcesMap.backendbr.dataSource =
      this.githubJobsService.backendJobs$;
  }

  toggleJobSource(jobSource: JobSources): void {
    const currentJobSourceState = this.jobSourcesMap[jobSource];

    if (currentJobSourceState)
      this.jobSourcesMap[jobSource].isActive = !currentJobSourceState.isActive;

    const hasOneJobSourceActive = Object.values(jobSourcesMap).some(
      (jobSource) => jobSource.isActive
    );

    this._hasOneJobSourceActive$.next(hasOneJobSourceActive);

    this.updateJobs();
  }

  updateJobs(): void {
    const currentJobs: Job[] = [];

    const activeJobSources = Object.values(this.jobSourcesMap).filter(
      (jobSource) => jobSource.isActive
    );

    activeJobSources.forEach((jobSource) => {
      if (!jobSource.isLoaded) jobSource.isLoading = true;
    });

    if (activeJobSources.length == 0) {
      this.jobService.setPristineJobs([]);
      this.jobService.setJobs([]);
    } else {
      activeJobSources.forEach((jobSource) => {
        jobSource.dataSource.pipe(first()).subscribe({
          next: (jobs) => {
            currentJobs.push(...jobs);
            this.jobService.setPristineJobs(currentJobs);
            this.jobService.setJobs(currentJobs);
            jobSource.isLoading = false;
            jobSource.isLoaded = true;
          },
          error: () => {
            jobSource.isLoading = false;
            jobSource.isActive = false;
            jobSource.hasFailedToLoad = true;
          },
        });
      });
    }
  }
}
