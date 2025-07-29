import { Injectable } from '@angular/core';
import {
  JobCollections,
  JobCollectionsMap,
  JobSources,
  QuarterData,
  Quarters,
  QuartersMap,
  YearsMap,
} from './job-sources.types';
import { JobService } from '../job/job.service';
import { BehaviorSubject, first, Observable } from 'rxjs';
import { GupyService } from './gupy/gupy.service';
import { GitHubJobsService } from './github/git-hub-jobs.service';
import { Job } from '../job/job.types';
import { LinkedInService } from './linkedin/linked-in.service';
import { jobCollectionsMap } from './job-sources.data';

@Injectable({
  providedIn: 'root',
})
export class JobSourcesService {
  private _hasOneActiveJobSource$ = new BehaviorSubject(false);
  hasOneActiveJobSource$ = this._hasOneActiveJobSource$.asObservable();

  jobCollectionsMap = jobCollectionsMap;
  hasOneJobCollectionLoaded = false;

  private today = new Date();

  constructor(
    private jobService: JobService,
    private gupyService: GupyService,
    private githubJobsService: GitHubJobsService,
    private linkedInService: LinkedInService,
  ) {
    this.initJobCollectionsMap();
    this.setGupyCollectionsSources();
    this.setGitHubCollectionsSources();
    this.setLinkedInCollectionsSources();
  }

  toggleQuarter(
    selectedCollection: JobCollections,
    selectedQuarter: Quarters,
    selectedYear: number,
  ): void {
    const selectedJobDataState =
      this.jobCollectionsMap[selectedCollection].dataByYear[selectedYear][selectedQuarter];
    selectedJobDataState.isSelected = !selectedJobDataState.isSelected;

    this.updateJobs();
  }

  toggleCollection(collection: JobCollections): void {
    this.jobCollectionsMap[collection].newJobs.isSelected =
      !this.jobCollectionsMap[collection].newJobs.isSelected;

    this.updateJobs();
  }

  private setLinkedInCollectionsSources(): void {
    const linkedInCollections = this.getCollectionsByJobSource(JobSources.linkedin);

    for (const collectionKey in linkedInCollections) {
      const collection = linkedInCollections[collectionKey as JobCollections];

      collection.newJobs.dataSource = this.linkedInService.getJobsFromMongo(
        collectionKey as JobCollections,
        collection.newJobs,
      );

      for (const yearKey in collection.dataByYear) {
        for (const quarterKey in collection.dataByYear[yearKey]) {
          const quarterData = collection.dataByYear[yearKey][quarterKey as Quarters];

          quarterData.dataSource = this.linkedInService.getJobsFromR2(
            collectionKey,
            +yearKey,
            quarterKey as Quarters,
            quarterData,
          );
        }
      }
    }
  }

  private setGitHubCollectionsSources(): void {
    const gitHubCollections = this.getCollectionsByJobSource(JobSources.github);

    for (const collectionKey in gitHubCollections) {
      const collection = gitHubCollections[collectionKey as JobCollections];

      for (const yearKey in collection.dataByYear) {
        for (const quarterKey in collection.dataByYear[yearKey]) {
          const quarterData = collection.dataByYear[yearKey][quarterKey as Quarters];

          quarterData.dataSource = this.githubJobsService.getJobs(
            collectionKey,
            +yearKey,
            quarterKey as Quarters,
            quarterData,
          );
        }
      }
    }
  }

  private setGupyCollectionsSources(): void {
    const gupyCollections = this.getCollectionsByJobSource(JobSources.gupy);

    for (const collectionKey in gupyCollections) {
      const collection = gupyCollections[collectionKey as JobCollections];

      collection.newJobs.dataSource = this.gupyService.getJobsFromMongo(
        collectionKey as JobCollections,
        collection.newJobs,
      );

      for (const yearKey in collection.dataByYear) {
        for (const quarterKey in collection.dataByYear[yearKey]) {
          const quarterData = collection.dataByYear[yearKey][quarterKey as Quarters];

          quarterData.dataSource = this.gupyService.getJobsFromR2(
            collectionKey as JobCollections,
            +yearKey,
            quarterKey as Quarters,
            quarterData,
          );
        }
      }
    }
  }

  private updateJobs(): void {
    const currentJobs: Job[] = [];

    const selectedQuarters: QuarterData[] = [];
    Object.values(this.jobCollectionsMap).forEach((jobSource) => {
      for (const year in jobSource.dataByYear) {
        const yearsData = jobSource.dataByYear[year];
        for (const quarter in yearsData) {
          const quarterData = yearsData[quarter as Quarters];
          if (quarterData.isSelected) selectedQuarters.push(quarterData);
        }
      }

      if (jobSource.newJobs.isSelected) selectedQuarters.push(jobSource.newJobs);
    });

    selectedQuarters.forEach((quarterData) => {
      if (!quarterData.isLoaded) quarterData.isDownloading = true;
    });

    if (selectedQuarters.length == 0) {
      this.jobService.setJobs(undefined);
    } else {
      selectedQuarters.forEach((quarterData) => {
        quarterData.dataSource.pipe(first()).subscribe({
          next: (jobs) => {
            currentJobs.push(...jobs);
            this.jobService.setJobs(currentJobs);
            quarterData.isDownloading = false;
            quarterData.isLoading = false;
            quarterData.isLoaded = true;
          },
          error: (error) => {
            console.error(error);
            quarterData.isDownloading = false;
            quarterData.isLoading = false;
            quarterData.isSelected = false;
            quarterData.hasFailedToLoad = true;
          },
          complete: () => {
            this.updateOneSourceFlag(selectedQuarters);
            this.updateJobCollectionLoadedFlag(selectedQuarters);
          },
        });
      });
    }
  }

  private updateOneSourceFlag(quarterData: QuarterData[]): void {
    const hasOneActiveJobSource = quarterData.some(
      (jobSource) => jobSource.isLoaded && jobSource.isSelected,
    );
    this._hasOneActiveJobSource$.next(hasOneActiveJobSource);
  }

  private updateJobCollectionLoadedFlag(quarterData: QuarterData[]): void {
    this.hasOneJobCollectionLoaded = quarterData.some((jobSource) => jobSource.isLoaded);
  }

  private getCollectionsByJobSource(jobSource: JobSources): JobCollectionsMap {
    const jobSources = Object.entries(jobCollectionsMap).filter(
      ([_, value]) => value.source == jobSource,
    );

    return Object.fromEntries(jobSources) as JobCollectionsMap;
  }

  private initJobCollectionsMap(): void {
    for (const key in jobCollectionsMap) {
      const jobCollection = jobCollectionsMap[key as JobCollections];
      jobCollection.dataByYear = this.createYearsMap();
    }
  }

  private createQuarterData(): QuarterData {
    return {
      dataSource: new Observable(),
      isCurrentQuarter: false,
      isUpcomingQuarter: false,
      isSelected: false,
      isDownloading: false,
      isLoading: false,
      isLoaded: false,
      hasFailedToLoad: false,
      loadingProgress: 0,
      canTrackDownloadProgress: false,
      downloadingProgress: 0,
    };
  }

  private getCurrentQuarter(): Quarters {
    const month = this.today.getMonth();

    if (month >= 0 && month <= 2) {
      return Quarters.Q1;
    } else if (month >= 3 && month <= 5) {
      return Quarters.Q2;
    } else if (month >= 6 && month <= 8) {
      return Quarters.Q3;
    } else {
      return Quarters.Q4;
    }
  }

  createQuartersMap(year = this.today.getFullYear()): QuartersMap {
    const quartersMap = {
      Q1: this.createQuarterData(),
      Q2: this.createQuarterData(),
      Q3: this.createQuarterData(),
      Q4: this.createQuarterData(),
    };

    if (this.today.getFullYear() !== year) return quartersMap;

    const currentQuarter = this.getCurrentQuarter();
    quartersMap[currentQuarter].isCurrentQuarter = true;

    const upcomingQuarters: Quarters[] = [];
    for (const quarter of Object.values(Quarters).reverse()) {
      if (quarter != currentQuarter) upcomingQuarters.push(quarter as Quarters);
      else break;
    }

    for (const quarter of upcomingQuarters) {
      quartersMap[quarter].isUpcomingQuarter = true;
    }

    return quartersMap;
  }

  private createYearsMap(): YearsMap {
    return {
      2024: this.createQuartersMap(2024),
      2025: this.createQuartersMap(2025),
    };
  }
}
