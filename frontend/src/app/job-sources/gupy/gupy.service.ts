import { Injectable } from '@angular/core';
import { Observable, defer, shareReplay, switchMap } from 'rxjs';
import { AtlasService } from 'src/app/atlas/atlas.service';
import { Job } from 'src/app/job/job.types';
import { mapGupyJobsToJobs } from './gupy.mapper';
import { GupyJob } from './gupy.types';

@Injectable({
  providedIn: 'root',
})
export class GupyService {
  devJobs$: Observable<Job[]>;
  mobileJobs$: Observable<Job[]>;
  devopsJobs$: Observable<Job[]>;
  uiuxJobs$: Observable<Job[]>;
  dataJobs$: Observable<Job[]>;
  qaJobs$: Observable<Job[]>;
  aiJobs$: Observable<Job[]>;

  constructor(private atlasService: AtlasService) {
    this.devJobs$ = this.getDevJobsObservable();
    this.mobileJobs$ = this.getMobileJobsObservable();
    this.devopsJobs$ = this.getDevOpsJobsObservable();
    this.uiuxJobs$ = this.getUIUXJobsObservable();
    this.dataJobs$ = this.getDataJobsObservable();
    this.qaJobs$ = this.getQAJobsObservable();
    this.aiJobs$ = this.getAIJobsObservable();
  }

  private getWorkerPromise(jobs: GupyJob[]): Promise<Job[]> {
    return new Promise((resolve) => {
      const worker = this.createWorker();
      if (worker) {
        worker.postMessage(jobs);
        worker.onmessage = ({ data }) => resolve(data);
        worker.onerror = () => resolve(mapGupyJobsToJobs(jobs));
        worker.onmessageerror = () => resolve(mapGupyJobsToJobs(jobs));
      } else {
        resolve(mapGupyJobsToJobs(jobs));
      }
    });
  }

  private getAIJobsObservable(): Observable<Job[]> {
    return this.atlasService.getAIJobs().pipe(
      switchMap((jobs) => defer(() => this.getWorkerPromise(jobs))),
      shareReplay(),
    );
  }

  private getQAJobsObservable(): Observable<Job[]> {
    return this.atlasService.getQAJobs().pipe(
      switchMap((jobs) => defer(() => this.getWorkerPromise(jobs))),
      shareReplay(),
    );
  }

  private getDataJobsObservable(): Observable<Job[]> {
    return this.atlasService.getDataJobs().pipe(
      switchMap((jobs) => defer(() => this.getWorkerPromise(jobs))),
      shareReplay(),
    );
  }

  private getUIUXJobsObservable(): Observable<Job[]> {
    return this.atlasService.getUIUXJobs().pipe(
      switchMap((jobs) => defer(() => this.getWorkerPromise(jobs))),
      shareReplay(),
    );
  }

  private getDevOpsJobsObservable(): Observable<Job[]> {
    return this.atlasService.getDevOpsJobs().pipe(
      switchMap((jobs) => defer(() => this.getWorkerPromise(jobs))),
      shareReplay(),
    );
  }

  private getMobileJobsObservable(): Observable<Job[]> {
    return this.atlasService.getMobileJobs().pipe(
      switchMap((jobs) => defer(() => this.getWorkerPromise(jobs))),
      shareReplay(),
    );
  }

  private getDevJobsObservable(): Observable<Job[]> {
    return this.atlasService.getWebDevJobs().pipe(
      switchMap((jobs) => defer(() => this.getWorkerPromise(jobs))),
      shareReplay(),
    );
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
