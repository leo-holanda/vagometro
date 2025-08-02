import { Injectable } from '@angular/core';
import { Observable, catchError, defer, finalize, first, shareReplay, switchMap, tap } from 'rxjs';
import { Job } from 'src/app/job/job.types';
import { mapGupyJobsToJobs } from './gupy.mapper';
import { GupyJob } from './gupy.types';
import { EasySearchService } from 'src/app/job/easy-search/easy-search.service';
import { QuarterData, Quarters } from '../job-sources.types';
import { R2Service } from 'src/app/r2/r2.service';
import { MongoService } from 'src/app/mongo/mongo.service';
import { trackError, trackJobCollection } from 'src/app/shared/umami';

@Injectable({
  providedIn: 'root',
})
export class GupyService {
  constructor(
    private easySearchService: EasySearchService,
    private R2Service: R2Service,
    private mongoService: MongoService,
  ) {}

  getJobsFromMongo(collectionName: string, quarterData: QuarterData): Observable<Job[]> {
    let hasError = false;

    return this.mongoService.getJobs<GupyJob[]>(collectionName).pipe(
      tap(() => {
        quarterData.isDownloading = false;
        quarterData.isLoading = true;
      }),
      catchError((error) => {
        hasError = true;
        trackError(`${collectionName} - New jobs`, error.message);
        throw error;
      }),
      finalize(() => {
        if (!hasError) trackJobCollection(`${collectionName} - New Jobs`);
      }),
      switchMap((jobs) => defer(() => this.getWorkerPromise(jobs, quarterData))),
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
    )) as GupyJob[];
    quarterData.isDownloading = false;
    quarterData.isLoading = true;
    return this.getWorkerPromise(jobs, quarterData);
  }

  private getWorkerPromise(jobs: GupyJob[], quarterData: QuarterData): Promise<Job[]> {
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

        worker.onerror = () => resolve(mapGupyJobsToJobs(jobs, searchData));
        worker.onmessageerror = () => resolve(mapGupyJobsToJobs(jobs, searchData));
      } else {
        resolve(mapGupyJobsToJobs(jobs, searchData));
      }
    });
  }

  private createWorker(): Worker | undefined {
    if (typeof Worker !== 'undefined') {
      return new Worker(new URL('./gupy.worker', import.meta.url));
    } else {
      console.error('Web workers are not supported in this environment.');
      return undefined;
    }
  }
}
