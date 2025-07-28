import { Injectable } from '@angular/core';
import { SearchData } from './easy-search.types';
import { Job, JobLists } from '../job.types';
import { JobService } from '../job.service';
import { filter, take } from 'rxjs';
import { getJobMatchPercentage } from './easy-search.mapper';

@Injectable({
  providedIn: 'root',
})
export class EasySearchService {
  private searchData: SearchData | undefined;

  constructor(private jobService: JobService) {
    this.retrieveSearchDataFromLocalStorage();
  }

  hasSearchData(): boolean {
    return this.searchData !== undefined;
  }

  getSearchData(): SearchData | undefined {
    return this.searchData;
  }

  saveSearchData(searchData: SearchData): void {
    localStorage.setItem('searchData', JSON.stringify(searchData));
    this.searchData = searchData;
    this.updateJobsMatchPercentage();
  }

  getJobMatchPercentage(job: Job): number | undefined {
    return getJobMatchPercentage(job, this.searchData);
  }

  sortByMatchPercentage(jobs: Job[]): Job[] {
    return jobs.sort((a, b) => {
      const aMatchPercentage = a.matchPercentage || 0;
      const bMatchPercentage = b.matchPercentage || 0;

      if (aMatchPercentage === bMatchPercentage) {
        return b.publishedDate.getTime() - a.publishedDate.getTime();
      }

      return bMatchPercentage - aMatchPercentage;
    });
  }

  filterJobsByListType(jobs: Job[], listType: JobLists): Job[] {
    if (listType == JobLists.APPLIED) {
      return jobs.filter((job) => job.interactionStatus.applied);
    }

    if (listType == JobLists.DISCARDED) {
      return jobs.filter((job) => job.interactionStatus.discarded);
    }

    return jobs.filter((job) => !job.interactionStatus.applied && !job.interactionStatus.discarded);
  }

  filterJobsBySearchData = (jobs: Job[]): Job[] => {
    const searchData = this.getSearchData();
    if (!searchData) return jobs;

    return jobs.filter((job) => {
      if (searchData.experienceLevels.length > 0) {
        const hasExperienceLevel = job.experienceLevels.some((experienceLevel) =>
          searchData.experienceLevels.includes(experienceLevel.name),
        );
        if (!hasExperienceLevel) return false;
      }

      if (searchData.workplaceTypes.length > 0) {
        const hasWorkPlaceType = job.workplaceTypes.some((workplaceType) =>
          searchData.workplaceTypes.includes(workplaceType.type),
        );
        if (!hasWorkPlaceType) return false;
      }

      if (searchData.technologies.length > 0) {
        const hasKeywords = job.keywords.some((keyword) => {
          const keywordsName = searchData.technologies.map((keyword) => keyword.name);
          return keywordsName.includes(keyword.name);
        });
        if (!hasKeywords) return false;
      }

      if (searchData.contractTypes.length > 0) {
        const hasContractTypes = job.contractTypes.some((contractType) =>
          searchData.contractTypes.includes(contractType.type),
        );
        if (!hasContractTypes) return false;
      }

      if (searchData.inclusionTypes.length > 0) {
        const hasInclusionTypes = job.inclusionTypes.some((inclusionType) =>
          searchData.inclusionTypes.includes(inclusionType.type),
        );
        if (!hasInclusionTypes) return false;
      }

      return true;
    });
  };

  private updateJobsMatchPercentage(): void {
    this.jobService.jobs$
      .pipe(
        filter((jobs): jobs is Job[] => jobs != undefined),
        take(1),
      )
      .subscribe((jobs) => {
        const updatedJobs = jobs.map((job) => {
          job.matchPercentage = this.getJobMatchPercentage(job);
          return job;
        });

        this.jobService.setJobs(updatedJobs);
      });
  }

  private retrieveSearchDataFromLocalStorage(): void {
    const data = localStorage.getItem('searchData');

    if (data) {
      const storedSearchData = JSON.parse(data);
      const searchDataKeys: (keyof SearchData)[] = [
        'technologies',
        'experienceLevels',
        'workplaceTypes',
        'contractTypes',
        'inclusionTypes',
      ];

      searchDataKeys.forEach((key) => {
        if (storedSearchData[key] == undefined) storedSearchData[key] = [];
      });

      this.searchData = storedSearchData;
    }
  }
}
