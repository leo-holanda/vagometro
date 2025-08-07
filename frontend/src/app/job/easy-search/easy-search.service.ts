import { Injectable } from '@angular/core';
import { SearchData, SortOrders } from './easy-search.types';
import { Job, JobLists } from '../job.types';
import { JobService } from '../job.service';
import { filter, map, Observable, take } from 'rxjs';
import { getJobMatchPercentage } from './easy-search.mapper';
import { CompaniesOnSearchForm } from './search-form/search-form.types';

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

  sortJobs = (jobs: Job[]): Job[] => {
    const searchData = this.getSearchData();
    const sortBy: keyof Job = searchData ? searchData.sortBy : 'matchPercentage';
    const sortOrder: SortOrders = searchData ? searchData.sortOrder : SortOrders.descending;

    return jobs.sort((a, b) => {
      let aValue = a[sortBy] || 0;
      let bValue = b[sortBy] || 0;

      if (typeof aValue == 'string' && typeof bValue == 'string') {
        aValue = aValue.toString().toLowerCase();
        bValue = bValue.toString().toLowerCase();
      }

      if (aValue instanceof Date && bValue instanceof Date) {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      if (aValue === bValue) {
        if (sortOrder == SortOrders.ascending) return a.publishedDate > b.publishedDate ? 1 : -1;
        return a.publishedDate < b.publishedDate ? 1 : -1;
      }

      if (sortOrder == SortOrders.ascending) return aValue > bValue ? 1 : -1;
      return aValue < bValue ? 1 : -1;
    });
  };

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

      if (searchData.excludedCompanies.length > 0) {
        const hasExcludedCompanies = searchData.excludedCompanies.includes(job.companyName);
        if (hasExcludedCompanies) return false;
      }

      return true;
    });
  };

  setJobsInteractionStatus(jobs: Job[]): Job[] {
    const appliedJobsIds = localStorage.getItem(JobLists.APPLIED)?.split(',') || [];
    const discardedJobsIds = localStorage.getItem(JobLists.DISCARDED)?.split(',') || [];

    jobs.forEach((job) => {
      job.interactionStatus.applied = appliedJobsIds.includes(job.id.toString());
      job.interactionStatus.discarded = discardedJobsIds.includes(job.id.toString());
    });

    return jobs;
  }

  saveMarkedJobsOnLocalStorage(jobs: Job[]): void {
    const appliedJobsIds = this.filterJobsByListType(jobs, JobLists.APPLIED).map((job) => job.id);
    const discardedJobsIds = this.filterJobsByListType(jobs, JobLists.DISCARDED).map(
      (job) => job.id,
    );

    const savedAppliedJobsIds = localStorage.getItem(JobLists.APPLIED)?.split(',') || [];
    const savedDiscardedJobsIds = localStorage.getItem(JobLists.DISCARDED)?.split(',') || [];

    const appliedJobsIdsSet = new Set([
      ...savedAppliedJobsIds,
      ...appliedJobsIds.map((id) => id.toString()),
    ]);

    const discardedJobsIdsSet = new Set([
      ...savedDiscardedJobsIds,
      ...discardedJobsIds.map((id) => id.toString()),
    ]);

    localStorage.setItem(JobLists.APPLIED, [...appliedJobsIdsSet].join(','));
    localStorage.setItem(JobLists.DISCARDED, [...discardedJobsIdsSet].join(','));
  }

  removeFromMarkedJobs(jobId: number, listType: JobLists): void {
    const savedJobsIds = localStorage.getItem(listType)?.split(',') || [];
    const jobIdString = jobId.toString();
    const updatedJobsIds = savedJobsIds.filter((id) => id !== jobIdString);
    localStorage.setItem(listType, updatedJobsIds.join(','));
  }

  getCompaniesForSearchForm(): Observable<CompaniesOnSearchForm[]> {
    return this.jobService.getCompaniesNames().pipe(map(this.mapToCompaniesOnSearchForm));
  }

  private mapToCompaniesOnSearchForm(companiesNames: string[]): CompaniesOnSearchForm[] {
    return companiesNames.map((company) => ({
      isSelected: false,
      name: company,
    }));
  }

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
        'excludedCompanies',
      ];

      searchDataKeys.forEach((key) => {
        if (storedSearchData[key] == undefined) storedSearchData[key] = [];
      });

      this.searchData = storedSearchData;
    }
  }
}
