import { Injectable } from '@angular/core';
import { SearchData } from './easy-search.types';
import { Job } from '../job.types';
import { JobService } from '../job.service';
import { filter, take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EasySearchService {
  private searchData: SearchData | undefined;

  constructor(private jobService: JobService) {
    const data = localStorage.getItem('searchData');
    if (data) this.searchData = JSON.parse(data);
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

  /*
    ATTENTION: Every time you change this function, change in easy-search mapper too.
    This duplication is necessary because the easy search service can't be imported on a worker
  */
  getJobMatchPercentage(job: Job): number | undefined {
    if (this.searchData == undefined) return undefined;

    const searchDataKeywords = this.searchData.keywords.map((keyword) => keyword.name);

    const matchedKeywords = job.keywords.filter((keyword) =>
      searchDataKeywords.includes(keyword.name),
    );

    const matchedExperienceLevels = job.experienceLevels.filter((experienceLevel) =>
      this.searchData!.experienceLevels.includes(experienceLevel),
    );

    const howManyItemsWereMatched = matchedKeywords.length + matchedExperienceLevels.length;
    const howManyItemsWereSelected =
      searchDataKeywords.length + this.searchData.experienceLevels.length;

    const matchPercentage = (howManyItemsWereMatched / howManyItemsWereSelected) * 100;
    return matchPercentage;
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
}
