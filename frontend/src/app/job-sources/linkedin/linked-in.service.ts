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

  private worker: Worker | undefined;

  constructor(private atlasService: AtlasService) {
    if (typeof Worker !== 'undefined') {
      this.worker = new Worker(new URL('./linked-in.worker', import.meta.url), {
        name: 'LinkedIn Worker',
      });
    } else {
      console.error('Web workers are not supported in this environment.');
    }

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
      if (this.worker) {
        this.worker.postMessage(jobs);
        this.worker.onmessage = ({ data }) => resolve(data);
        this.worker.onerror = () => resolve(mapLinkedInJobsToJobs(jobs));
        this.worker.onmessageerror = () => resolve(mapLinkedInJobsToJobs(jobs));
      } else {
        resolve(mapLinkedInJobsToJobs(jobs));
      }
    });
  }
}
