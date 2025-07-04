import { Injectable } from '@angular/core';
import { Observable, defer, first, shareReplay, switchMap, tap } from 'rxjs';
import { Job } from 'src/app/job/job.types';
import { mapLinkedInJobsToJobs } from './linked-in.mapper';
import { LinkedInJob } from './linked-in.types';
import { EasySearchService } from 'src/app/job/easy-search/easy-search.service';
import { QuarterData, Quarters } from '../job-sources.types';
import { R2Service } from 'src/app/r2/r2.service';
import { MongoService } from 'src/app/mongo/mongo.service';

@Injectable({
  providedIn: 'root',
})
export class LinkedInService {
  constructor(
    private mongoService: MongoService,
    private R2Service: R2Service,
    private easySearchService: EasySearchService,
  ) {}

  getJobs(
    collectionName: string,
    year: number,
    quarter: Quarters,
    quarterData: QuarterData,
  ): Observable<Job[]> {
    if (quarterData.isCurrentQuarter) return this.getJobsFromMongo(collectionName, quarterData);
    return this.getJobsFromR2(collectionName, year, quarter, quarterData);
  }

  private getJobsFromMongo(collectionName: string, quarterData: QuarterData): Observable<Job[]> {
    return this.mongoService.getJobs<LinkedInJob[]>(collectionName).pipe(
      tap(() => {
        quarterData.isDownloading = false;
        quarterData.isLoading = true;
      }),
      switchMap((jobs) => defer(() => this.getWorkerPromise(jobs, quarterData))),
      shareReplay(),
    );
  }

  private getJobsFromR2(
    collectionName: string,
    year: number,
    quarter: Quarters,
    quarterData: QuarterData,
  ): Observable<Job[]> {
    return defer(() => this.getJobsPromise(collectionName, year, quarter, quarterData)).pipe(
      first(),
      tap(() => {
        this.sendEventToUmami(`${collectionName} - ${quarter}/${year}`);
      }),
      shareReplay(),
    );
  }

  private async getJobsPromise(
    collectionName: string,
    year: number,
    quarter: Quarters,
    quarterData: QuarterData,
  ): Promise<Job[]> {
    const jobs = (await this.R2Service.getJobs(
      collectionName,
      year,
      quarter,
      quarterData,
    )) as LinkedInJob[];
    quarterData.isDownloading = false;
    quarterData.isLoading = true;
    return this.getWorkerPromise(jobs, quarterData);
  }

  private getWorkerPromise(jobs: LinkedInJob[], quarterData: QuarterData): Promise<Job[]> {
    return new Promise((resolve) => {
      const worker = this.createWorker();
      const searchData = this.easySearchService.getSearchData();

      if (worker) {
        worker.postMessage({ jobs, searchData });

        let hasFinished = false;
        worker.onmessage = ({ data }) => {
          if (hasFinished) resolve(data);

          if (data.loadingProgress == 1) hasFinished = true;
          quarterData.loadingProgress = data.loadingProgress;
        };

        worker.onerror = () => resolve(mapLinkedInJobsToJobs(jobs, searchData));
        worker.onmessageerror = () => resolve(mapLinkedInJobsToJobs(jobs, searchData));
      } else {
        resolve(mapLinkedInJobsToJobs(jobs, searchData));
      }
    });
  }

  private createWorker(): Worker | undefined {
    if (typeof Worker !== 'undefined') {
      return new Worker(new URL('./linked-in.worker', import.meta.url));
    } else {
      console.error('Web workers are not supported in this environment.');
      return undefined;
    }
  }

  private sendEventToUmami(event: string): void {
    try {
      (window as any).umami.track(event);
    } catch (error) {
      console.warn('Umami not available');
    }
  }
}
