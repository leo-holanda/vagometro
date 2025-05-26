import { Injectable } from '@angular/core';
import { Observable, defer, first, shareReplay, switchMap, tap } from 'rxjs';
import { AtlasService } from 'src/app/atlas/atlas.service';
import { Job } from 'src/app/job/job.types';
import { mapGupyJobsToJobs } from './gupy.mapper';
import { GupyJob } from './gupy.types';
import { EasySearchService } from 'src/app/job/easy-search/easy-search.service';
import { JobCollections, QuarterData, Quarters } from '../job-sources.types';
import { R2Service } from 'src/app/r2/r2.service';

@Injectable({
  providedIn: 'root',
})
export class GupyService {
  constructor(
    private atlasService: AtlasService,
    private easySearchService: EasySearchService,
    private R2Service: R2Service,
  ) {}

  getJobs(collectionName: JobCollections, year: number, quarter: Quarters, quarterData: QuarterData): Observable<Job[]> {
    if(quarterData.isCurrentQuarter) return this.getJobsFromAtlas(collectionName, quarterData);
    return this.getJobsFromR2(collectionName, year, quarter, quarterData);
  }

  private getJobsFromAtlas(collectionName: JobCollections, quarterData: QuarterData): Observable<Job[]> {
    return this.atlasService.getGupyJobs(collectionName).pipe(
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
      quarterData: QuarterData
    ): Observable<Job[]> {
        return defer(() => this.getJobsPromise(collectionName, year, quarter, quarterData)).pipe(
          first(),
          tap(() => {
            this.sendEventToUmami(collectionName);
          }),
          shareReplay(),
        );
    }


  private async getJobsPromise(
      collectionName: string,
      year: number,
      quarter: Quarters,
      quarterData: QuarterData
    ): Promise<Job[]> {
      const jobs = await this.R2Service.getJobs(collectionName, year, quarter) as GupyJob[];
      return this.getWorkerPromise(jobs, quarterData)
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

  private sendEventToUmami(event: string): void {
    try {
      (window as any).umami.track(event);
    } catch (error) {
      console.warn('Umami not available');
    }
  }
}
