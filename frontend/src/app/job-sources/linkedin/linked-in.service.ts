import { Injectable } from '@angular/core';
import {
  Observable,
  catchError,
  defer,
  filter,
  finalize,
  first,
  map,
  shareReplay,
  switchMap,
  tap,
} from 'rxjs';
import { Job } from 'src/app/job/job.types';
import { mapLinkedInJobsToJobs } from './linked-in.mapper';
import { LinkedInJob } from './linked-in.types';
import { EasySearchService } from 'src/app/job/easy-search/easy-search.service';
import { QuarterData, Quarters } from '../job-sources.types';
import { R2Service } from 'src/app/r2/r2.service';
import { MongoService } from 'src/app/mongo/mongo.service';
import { trackError, trackJobCollection } from 'src/app/shared/umami';
import { HttpEvent, HttpEventType, HttpResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class LinkedInService {
  constructor(
    private mongoService: MongoService,
    private R2Service: R2Service,
    private easySearchService: EasySearchService,
  ) {}

  getJobsFromMongo(collectionName: string, quarterData: QuarterData): Observable<Job[]> {
    let hasError = false;

    return this.mongoService.getJobs<LinkedInJob[]>(collectionName).pipe(
      tap((event) => this.updateDownloadProgress(event, quarterData)),
      filter((event) => event.type === HttpEventType.Response),
      map((event) => (event as HttpResponse<LinkedInJob[]>).body),
      switchMap((jobs) => this.mapJobsWithWorker(jobs, quarterData)),
      catchError((error) => {
        hasError = true;
        trackError(`${collectionName}  - New jobs`, error.message);
        throw error;
      }),
      finalize(() => {
        if (!hasError) trackJobCollection(`${collectionName} - New Jobs`);
      }),
      shareReplay(),
    );
  }

  getJobsFromR2(
    collectionName: string,
    year: number,
    quarter: Quarters,
    quarterData: QuarterData,
  ): Observable<Job[]> {
    let hasError = false;

    return defer(() => this.getJobsPromise(collectionName, year, quarter, quarterData)).pipe(
      first(),
      catchError((error) => {
        hasError = true;
        trackError(`${collectionName} - ${quarter}/${year}`, error.message);
        throw error;
      }),
      finalize(() => {
        if (!hasError) trackJobCollection(`${collectionName} - ${quarter}/${year}`);
      }),
      shareReplay(),
    );
  }

  private mapJobsWithWorker(
    jobs: LinkedInJob[] | null,
    quarterData: QuarterData,
  ): Observable<Job[]> {
    return defer(() => {
      if (jobs == null) throw new Error('No jobs were returned');
      quarterData.isDownloading = false;
      quarterData.isLoading = true;
      return this.getWorkerPromise(jobs, quarterData);
    });
  }

  private updateDownloadProgress(event: HttpEvent<LinkedInJob[]>, quarterData: QuarterData): void {
    if (event.type === HttpEventType.ResponseHeader) {
      quarterData.canTrackDownloadProgress = true;
    }

    if (event.type === HttpEventType.DownloadProgress) {
      if (event.loaded == undefined || event.total == undefined) {
        quarterData.canTrackDownloadProgress = false;
        throw new Error('Download progress tracking has failed');
      }
      const percentDone = event.loaded / (event.total || 1);
      quarterData.downloadingProgress = percentDone;
    }
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
}
