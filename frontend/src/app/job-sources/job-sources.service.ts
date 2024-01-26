import { Injectable } from '@angular/core';
import { JobSources, jobSourcesMap } from './job-sources.types';
import { JobService } from '../job/job.service';
import { BehaviorSubject, combineLatest, first } from 'rxjs';
import { GupyService } from './gupy/gupy.service';
import { GitHubJobsService } from './github/git-hub-jobs.service';

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
    const activeJobSources = Object.values(this.jobSourcesMap).filter(
      (jobSource) => jobSource.isActive
    );

    const jobsObservables = activeJobSources.map(
      (jobSource) => jobSource.dataSource
    );

    activeJobSources.forEach((jobSource) => {
      if (!jobSource.isLoaded) jobSource.isLoading = true;
    });

    if (jobsObservables.length == 0) this.jobService.setJobs([]);
    else {
      combineLatest(jobsObservables)
        .pipe(first())
        .subscribe((allJobs) => {
          activeJobSources.forEach((jobSource) => {
            jobSource.isLoading = false;
            jobSource.isLoaded = true;
          });
          this.jobService.setPristineJobs(allJobs.flat());
          this.jobService.setJobs(allJobs.flat());
        });
    }
  }
}
