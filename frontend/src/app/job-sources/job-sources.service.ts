import { Injectable } from '@angular/core';
import { JobCollections, jobCollectionsMap, JobSources, Quarters } from './job-sources.types';
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
    this.setGupyJobs();
    this.setGitHubJobs();
    this.setLinkedInJobs();
  }

  updateJobsDataSelection(selectedCollection: JobCollections, selectedQuarter: Quarters, selectedYear: number): void {
    const selectedJobDataState = this.jobCollectionsMap[selectedCollection].dataByYear[selectedYear][selectedQuarter];
    if (selectedJobDataState) selectedJobDataState.isActive = !selectedJobDataState.isActive;
  }

  buildJobDataID(jobSource: JobSources, jobCollection: JobCollections, quarter: Quarters, year: number): string {
    return `${jobSource}_${jobCollection}_${quarter}${year}`
  }

  private setLinkedInJobs(): void {
    this.jobCollectionsMap.linkedinDev.dataSource = this.linkedInService.devJobs$;
    this.linkedInService.devJobsStatus = this.jobCollectionsMap.linkedinDev.status;
  }

  private setGitHubJobs(): void {
    this.jobCollectionsMap.frontendbr.dataSource = this.githubJobsService.frontendJobs$;
    this.githubJobsService.frontendJobsStatus = this.jobCollectionsMap.frontendbr.status;

    this.jobCollectionsMap.backendbr.dataSource = this.githubJobsService.backendJobs$;
    this.githubJobsService.backendJobsStatus = this.jobCollectionsMap.backendbr.status;

    this.jobCollectionsMap.soujava.dataSource = this.githubJobsService.soujavaJobs$;
    this.githubJobsService.soujavaJobsStatus = this.jobCollectionsMap.soujava.status;

    this.jobCollectionsMap.reactBrasil.dataSource = this.githubJobsService.reactBrasilJobs$;
    this.githubJobsService.reactBrasilJobsStatus = this.jobCollectionsMap.reactBrasil.status;

    this.jobCollectionsMap.androidDevBr.dataSource = this.githubJobsService.androidDevBrJobs$;
    this.githubJobsService.androidDevBrStatus = this.jobCollectionsMap.androidDevBr.status;
  }

  private setGupyJobs(): void {
    this.jobCollectionsMap.gupyDev.dataSource = this.gupyService.devJobs$;
    this.gupyService.devJobsStatus = this.jobCollectionsMap.gupyDev.status;

    this.jobCollectionsMap.gupyMobile.dataSource = this.gupyService.mobileJobs$;
    this.gupyService.mobileJobsStatus = this.jobCollectionsMap.gupyMobile.status;

    this.jobCollectionsMap.gupyDevops.dataSource = this.gupyService.devopsJobs$;
    this.gupyService.devopsJobsStatus = this.jobCollectionsMap.gupyDevops.status;

    this.jobCollectionsMap.gupyUIUX.dataSource = this.gupyService.uiuxJobs$;
    this.gupyService.uiuxJobsStatus = this.jobCollectionsMap.gupyUIUX.status;

    this.jobCollectionsMap.gupyDados.dataSource = this.gupyService.dataJobs$;
    this.gupyService.dataJobsStatus = this.jobCollectionsMap.gupyDados.status;

    this.jobCollectionsMap.gupyQA.dataSource = this.gupyService.qaJobs$;
    this.gupyService.qaJobsStatus = this.jobCollectionsMap.gupyQA.status;

    this.jobCollectionsMap.gupyIA.dataSource = this.gupyService.aiJobs$;
    this.gupyService.aiJobsStatus = this.jobCollectionsMap.gupyIA.status;

    this.jobCollectionsMap.gupyProductManager.dataSource = this.gupyService.productManagerJobs$;
    this.gupyService.productManagerJobsStatus = this.jobCollectionsMap.gupyProductManager.status;

    this.jobCollectionsMap.gupyAgileRelated.dataSource = this.gupyService.agileRelatedJobs$;
    this.gupyService.agileRelatedJobsStatus = this.jobCollectionsMap.gupyAgileRelated.status;

    this.jobCollectionsMap.gupyRecruitment.dataSource = this.gupyService.recruitmentJobs$;
    this.gupyService.recruitmentJobsStatus = this.jobCollectionsMap.gupyRecruitment.status;
  }

  private updateJobs(): void {
    const currentJobs: Job[] = [];

    const activeJobSources = Object.values(this.jobCollectionsMap).filter(
      (jobSource) => jobSource.status.isActive,
    );

    activeJobSources.forEach((jobSource) => {
      if (!jobSource.status.isLoaded) jobSource.status.isDownloading = true;
    });

    if (activeJobSources.length == 0) {
      this.jobService.setJobs(undefined);
    } else {
      activeJobSources.forEach((jobSource) => {
        jobSource.dataSource.pipe(first()).subscribe({
          next: (jobs) => {
            currentJobs.push(...jobs);
            this.jobService.setJobs(currentJobs);
            jobSource.status.isDownloading = false;
            jobSource.status.isLoading = false;
            jobSource.status.isLoaded = true;
          },
          error: (error) => {
            console.error(error);
            jobSource.status.isDownloading = false;
            jobSource.status.isLoading = false;
            jobSource.status.isActive = false;
            jobSource.status.hasFailedToLoad = true;
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
      (jobSource) => jobSource.status.isLoaded && jobSource.status.isActive,
    );
    this._hasOneActiveJobSource$.next(hasOneActiveJobSource);
  }

  private updateJobCollectionLoadedFlag(): void {
    this.hasOneJobCollectionLoaded = Object.values(jobCollectionsMap).some(
      (jobSource) => jobSource.status.isLoaded,
    );
  }
}
