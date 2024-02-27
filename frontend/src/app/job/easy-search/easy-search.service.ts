import { Injectable } from '@angular/core';
import { SearchData } from './easy-search.types';
import { Job } from '../job.types';
import { JobService } from '../job.service';
import { filter, take } from 'rxjs';
import { getJobMatchPercentage } from './easy-search.mapper';

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

  getJobMatchPercentage(job: Job): number | undefined {
    return getJobMatchPercentage(job, this.searchData);
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
