import { Injectable } from '@angular/core';
import { Observable, defer, shareReplay, switchMap, tap } from 'rxjs';
import { AtlasService } from 'src/app/atlas/atlas.service';
import { Job } from 'src/app/job/job.types';
import { mapLinkedInJobsToJobs } from './linked-in.mapper';
import { LinkedInJob } from './linked-in.types';
import { EasySearchService } from 'src/app/job/easy-search/easy-search.service';
import { QuarterData, Quarters } from '../job-sources.types';

@Injectable({
  providedIn: 'root',
})
export class LinkedInService {
  constructor(
    private atlasService: AtlasService,
    private easySearchService: EasySearchService,
  ) {}

  getJobsObservable(year: number, quarter: Quarters, quarterData: QuarterData): Observable<Job[]> {
    return this.atlasService.getLinkedInDevJobs().pipe(
      tap(() => {
        quarterData.isDownloading = false;
        quarterData.isLoading = true;
      }),
      switchMap((jobs) => defer(() => this.getWorkerPromise(jobs, quarterData))),
      shareReplay(),
    );
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
