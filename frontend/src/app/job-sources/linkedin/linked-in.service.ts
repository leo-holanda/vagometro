import { Injectable } from '@angular/core';
import { Observable, defer, shareReplay, switchMap, tap } from 'rxjs';
import { AtlasService } from 'src/app/atlas/atlas.service';
import { Job } from 'src/app/job/job.types';
import { mapLinkedInJobsToJobs } from './linked-in.mapper';
import { LinkedInJob } from './linked-in.types';
import { EasySearchService } from 'src/app/job/easy-search/easy-search.service';
import { JobCollectionStatus } from '../job-sources.types';

@Injectable({
  providedIn: 'root',
})
export class LinkedInService {
  devJobs$: Observable<Job[]>;
  devJobsStatus!: JobCollectionStatus;

  constructor(
    private atlasService: AtlasService,
    private easySearchService: EasySearchService,
  ) {
    this.devJobs$ = this.getDevJobsObservable();
  }

  getDevJobsObservable(): Observable<Job[]> {
    return this.atlasService.getLinkedInDevJobs().pipe(
      tap(() => {
        this.devJobsStatus.isDownloading = false;
        this.devJobsStatus.isLoading = true;
      }),
      switchMap((jobs) => defer(() => this.getWorkerPromise(jobs))),
      shareReplay(),
    );
  }

  private getWorkerPromise(jobs: LinkedInJob[]): Promise<Job[]> {
    return new Promise((resolve) => {
      const worker = this.createWorker();
      const searchData = this.easySearchService.getSearchData();
      if (worker) {
        worker.postMessage({ jobs, searchData });
        worker.onmessage = ({ data }) => resolve(data);
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
