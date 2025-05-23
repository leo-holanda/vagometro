import { Injectable } from '@angular/core';
import { JobCollectionData, JobCollections, jobCollectionsMap, JobSources, QuarterData, Quarters } from './job-sources.types';
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
    this.setGupyCollectionsSources();
    this.setGitHubCollectionsSources();
    this.setLinkedInCollectionsSources();
  }

  updateSelectedCollections(selectedCollection: JobCollections, selectedQuarter: Quarters, selectedYear: number): void {
    const selectedJobDataState = this.jobCollectionsMap[selectedCollection].dataByYear[selectedYear][selectedQuarter];
    if (selectedJobDataState) selectedJobDataState.isSelected = !selectedJobDataState.isSelected;
  }

  private setLinkedInCollectionsSources(): void {
    const linkedInYearsData = this.jobCollectionsMap.linkedinDev.dataByYear;
    for (const year in linkedInYearsData){
      const quarters = linkedInYearsData[year]
      for (const quarter in quarters){
        const quarterData = quarters[quarter as Quarters]
        quarterData.dataSource = this.linkedInService.getJobsObservable(+year, quarter as Quarters, quarterData)
      }
    }
  }

  private setGitHubCollectionsSources(): void {
    const gitHubCollections = this.getCollectionsByJobSource(JobSources.github);
     
    for (const collection of gitHubCollections){
      for(const yearKey in collection.dataByYear){
        for(const quarterKey in collection.dataByYear[yearKey]){
          const quarterData = collection.dataByYear[yearKey][quarterKey as Quarters]
          quarterData.dataSource = this.githubJobsService.getJobsObservable(+yearKey, quarterKey as Quarters)     
        }
      }
    }
  }

  private setGupyCollectionsSources(): void {
    const gupyCollections = this.getCollectionsByJobSource(JobSources.gupy);
        
    for (const collection of gupyCollections){
      for(const yearKey in collection.dataByYear){
        for(const quarterKey in collection.dataByYear[yearKey]){
          const quarterData = collection.dataByYear[yearKey][quarterKey as Quarters]
          quarterData.dataSource = this.gupyService.(+yearKey, quarterKey as Quarters)     
        }
      }
    }
  }

  private updateJobs(): void {
    const currentJobs: Job[] = [];

    const selectedQuarters: QuarterData[] = []
    Object.values(this.jobCollectionsMap).forEach(
      (jobSource) => {
        for(const year in jobSource.dataByYear){
          const yearsData = jobSource.dataByYear[year]
          for(const quarter in yearsData){
            const quarterData = yearsData[quarter as Quarters]
            if(quarterData.isSelected) selectedQuarters.push(quarterData)
          }
        }
      },
    );

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
    this.hasOneJobCollectionLoaded = quarterData.some(
      (jobSource) => jobSource.isLoaded,
    );
  }

  private getCollectionsByJobSource(jobSource: JobSources): JobCollectionData[] {
    const collections: JobCollectionData[] = []
    
    for(const collectionKey in this.jobCollectionsMap){
      const collection = this.jobCollectionsMap[collectionKey as JobCollections]
      if(collection.source == jobSource) collections.push(collection)
    }
    
    return collections
  }
}
