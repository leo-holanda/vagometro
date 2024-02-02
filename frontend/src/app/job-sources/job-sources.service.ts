import { Injectable } from '@angular/core';
import {
  JobCollections,
  JobSources,
  jobCollectionsMap,
} from './job-sources.types';
import { JobService } from '../job/job.service';
import { BehaviorSubject, combineLatest, first, last } from 'rxjs';
import { GupyService } from './gupy/gupy.service';
import { GitHubJobsService } from './github/git-hub-jobs.service';
import { Job } from '../job/job.types';

@Injectable({
  providedIn: 'root',
})
export class JobSourcesService {
  private _hasOneJobSourceActive$ = new BehaviorSubject(false);
  hasOneJobSourceActive$ = this._hasOneJobSourceActive$.asObservable();

  jobCollectionsMap = jobCollectionsMap;

  constructor(
    private jobService: JobService,
    private gupyService: GupyService,
    private githubJobsService: GitHubJobsService
  ) {
    this.jobCollectionsMap.gupy.dataSource = this.gupyService.jobs$;

    this.jobCollectionsMap.gupymobile.dataSource = this.gupyService.mobileJobs$;

    this.jobCollectionsMap.frontendbr.dataSource =
      this.githubJobsService.frontendJobs$;

    this.jobCollectionsMap.backendbr.dataSource =
      this.githubJobsService.backendJobs$;

    this.jobCollectionsMap.soujava.dataSource =
      this.githubJobsService.soujavaJobs$;
  }

  toggleJobCollection(jobCollection: JobCollections): void {
    const currentJobSourceState = this.jobCollectionsMap[jobCollection];

    if (currentJobSourceState)
      this.jobCollectionsMap[jobCollection].isActive =
        !currentJobSourceState.isActive;

    this.updateOneSourceFlag();
    this.updateJobs();
  }

  private updateJobs(): void {
    const currentJobs: Job[] = [];

    const activeJobSources = Object.values(this.jobCollectionsMap).filter(
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
          error: (error) => {
            console.error(error);
            jobSource.isLoading = false;
            jobSource.isActive = false;
            jobSource.hasFailedToLoad = true;
            this.updateOneSourceFlag();
          },
        });
      });
    }
  }

  private updateOneSourceFlag(): void {
    const hasOneJobSourceActive = Object.values(jobCollectionsMap).some(
      (jobSource) => jobSource.isActive
    );

    this._hasOneJobSourceActive$.next(hasOneJobSourceActive);
  }
}
