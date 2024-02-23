import { Injectable } from '@angular/core';
import { JobCollections, jobCollectionsMap } from './job-sources.types';
import { JobService } from '../job/job.service';
import { BehaviorSubject, first } from 'rxjs';
import { GupyService } from './gupy/gupy.service';
import { GitHubJobsService } from './github/git-hub-jobs.service';
import { Job } from '../job/job.types';
import { LinkedInService } from './linkedin/linked-in.service';

@Injectable({
  providedIn: 'root',
})
export class JobSourcesService {
  private _hasOneActiveJobSource$ = new BehaviorSubject(false);
  hasOneActiveJobSource$ = this._hasOneActiveJobSource$.asObservable();

  jobCollectionsMap = jobCollectionsMap;
  hasOneJobCollectionLoaded = false;

  constructor(
    private jobService: JobService,
    private gupyService: GupyService,
    private githubJobsService: GitHubJobsService,
    private linkedInService: LinkedInService,
  ) {
    this.jobCollectionsMap.gupydev.dataSource = this.gupyService.devJobs$;
    this.jobCollectionsMap.gupymobile.dataSource = this.gupyService.mobileJobs$;
    this.jobCollectionsMap.gupydevops.dataSource = this.gupyService.devopsJobs$;
    this.jobCollectionsMap.gupyuiux.dataSource = this.gupyService.uiuxJobs$;
    this.jobCollectionsMap.gupydados.dataSource = this.gupyService.dataJobs$;
    this.jobCollectionsMap.gupyqa.dataSource = this.gupyService.qaJobs$;
    this.jobCollectionsMap.gupyia.dataSource = this.gupyService.aiJobs$;
    this.jobCollectionsMap.gupyProductManager.dataSource = this.gupyService.productManagerJobs$;
    this.jobCollectionsMap.gupyAgileRelated.dataSource = this.gupyService.agileRelatedJobs$;

    this.jobCollectionsMap.frontendbr.dataSource = this.githubJobsService.frontendJobs$;

    this.jobCollectionsMap.backendbr.dataSource = this.githubJobsService.backendJobs$;

    this.jobCollectionsMap.soujava.dataSource = this.githubJobsService.soujavaJobs$;

    this.jobCollectionsMap.linkedin_dev.dataSource = this.linkedInService.devJobs$;
  }

  toggleJobCollection(jobCollection: JobCollections): void {
    const currentJobSourceState = this.jobCollectionsMap[jobCollection];

    if (currentJobSourceState)
      this.jobCollectionsMap[jobCollection].isActive = !currentJobSourceState.isActive;

    this.updateJobs();
  }

  private updateJobs(): void {
    const currentJobs: Job[] = [];

    const activeJobSources = Object.values(this.jobCollectionsMap).filter(
      (jobSource) => jobSource.isActive,
    );

    activeJobSources.forEach((jobSource) => {
      if (!jobSource.isLoaded) jobSource.isLoading = true;
    });

    if (activeJobSources.length == 0) {
      this.jobService.setJobs(undefined);
    } else {
      activeJobSources.forEach((jobSource) => {
        jobSource.dataSource.pipe(first()).subscribe({
          next: (jobs) => {
            currentJobs.push(...jobs);
            this.jobService.setJobs(currentJobs);
            jobSource.isLoading = false;
            jobSource.isLoaded = true;
          },
          error: (error) => {
            console.error(error);
            jobSource.isLoading = false;
            jobSource.isActive = false;
            jobSource.hasFailedToLoad = true;
          },
          complete: () => {
            this.updateOneSourceFlag();
            this.updateJobCollectionLoadedFlag();
          },
        });
      });
    }
  }

  private updateOneSourceFlag(): void {
    const hasOneActiveJobSource = Object.values(jobCollectionsMap).some(
      (jobSource) => jobSource.isLoaded && jobSource.isActive,
    );
    this._hasOneActiveJobSource$.next(hasOneActiveJobSource);
  }

  private updateJobCollectionLoadedFlag(): void {
    this.hasOneJobCollectionLoaded = Object.values(jobCollectionsMap).some(
      (jobSource) => jobSource.isLoaded,
    );
  }
}
