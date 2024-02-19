import { Injectable } from '@angular/core';
import { Observable, defer, map, shareReplay, switchMap } from 'rxjs';
import { AtlasService } from 'src/app/atlas/atlas.service';
import { Job } from 'src/app/job/job.types';
import { mapLinkedInJobsToJobs } from './linked-in.mapper';
import { LinkedInJob } from './linked-in.types';

@Injectable({
  providedIn: 'root',
})
export class LinkedInService {
  devJobs$: Observable<Job[]>;

  constructor(private atlasService: AtlasService) {
    this.devJobs$ = this.getDevJobsObservable();
  }

  getDevJobsObservable(): Observable<Job[]> {
    return this.atlasService.getLinkedInDevJobs().pipe(
      switchMap((jobs) => defer(() => this.getWorkerPromise(jobs))),
      shareReplay(),
    );
  }

  private getWorkerPromise(jobs: LinkedInJob[]): Promise<Job[]> {
    return new Promise((resolve) => {
      const worker = this.createWorker();
      if (worker) {
        worker.postMessage(jobs);
        worker.onmessage = ({ data }) => resolve(data);
        worker.onerror = () => resolve(mapLinkedInJobsToJobs(jobs));
        worker.onmessageerror = () => resolve(mapLinkedInJobsToJobs(jobs));
      } else {
        resolve(mapLinkedInJobsToJobs(jobs));
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
