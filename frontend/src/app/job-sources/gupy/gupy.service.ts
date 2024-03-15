import { Injectable } from '@angular/core';
import { Observable, defer, shareReplay, switchMap, tap } from 'rxjs';
import { AtlasService } from 'src/app/atlas/atlas.service';
import { Job } from 'src/app/job/job.types';
import { mapGupyJobsToJobs } from './gupy.mapper';
import { GupyJob } from './gupy.types';
import { EasySearchService } from 'src/app/job/easy-search/easy-search.service';
import { JobCollectionStatus } from '../job-sources.types';

@Injectable({
  providedIn: 'root',
})
export class GupyService {
  devJobs$: Observable<Job[]>;
  devJobsStatus!: JobCollectionStatus;

  mobileJobs$: Observable<Job[]>;
  mobileJobsStatus!: JobCollectionStatus;

  devopsJobs$: Observable<Job[]>;
  devopsJobsStatus!: JobCollectionStatus;

  uiuxJobs$: Observable<Job[]>;
  uiuxJobsStatus!: JobCollectionStatus;

  dataJobs$: Observable<Job[]>;
  dataJobsStatus!: JobCollectionStatus;

  qaJobs$: Observable<Job[]>;
  qaJobsStatus!: JobCollectionStatus;

  aiJobs$: Observable<Job[]>;
  aiJobsStatus!: JobCollectionStatus;

  productManagerJobs$: Observable<Job[]>;
  productManagerJobsStatus!: JobCollectionStatus;

  agileRelatedJobs$: Observable<Job[]>;
  agileRelatedJobsStatus!: JobCollectionStatus;

  recruitmentJobs$: Observable<Job[]>;
  recruitmentJobsStatus!: JobCollectionStatus;

  constructor(
    private atlasService: AtlasService,
    private easySearchService: EasySearchService,
  ) {
    //TODO: Find a way to automate this
    this.devJobs$ = this.getDevJobsObservable();
    this.mobileJobs$ = this.getMobileJobsObservable();
    this.devopsJobs$ = this.getDevOpsJobsObservable();
    this.uiuxJobs$ = this.getUIUXJobsObservable();
    this.dataJobs$ = this.getDataJobsObservable();
    this.qaJobs$ = this.getQAJobsObservable();
    this.aiJobs$ = this.getAIJobsObservable();
    this.productManagerJobs$ = this.getProductManagerJobsObservable();
    this.agileRelatedJobs$ = this.getAgileRelatedJobsObservable();
    this.recruitmentJobs$ = this.getRecruitmentJobsObservable();
  }

  private getWorkerPromise(jobs: GupyJob[], collectionStatus: JobCollectionStatus): Promise<Job[]> {
    return new Promise((resolve) => {
      const worker = this.createWorker();
      const searchData = this.easySearchService.getSearchData();
      if (worker) {
        worker.postMessage({ jobs, searchData });

        let hasFinished = false;
        worker.onmessage = ({ data }) => {
          if (hasFinished) resolve(data);

          if (data.loadingProgress == 1) hasFinished = true;
          collectionStatus.loadingProgress = data.loadingProgress;
        };

        worker.onerror = () => resolve(mapGupyJobsToJobs(jobs, searchData));
        worker.onmessageerror = () => resolve(mapGupyJobsToJobs(jobs, searchData));
      } else {
        resolve(mapGupyJobsToJobs(jobs, searchData));
      }
    });
  }

  private getRecruitmentJobsObservable(): Observable<Job[]> {
    return this.atlasService.getRecruitmentJobs().pipe(
      tap(() => {
        this.recruitmentJobsStatus.isDownloading = false;
        this.recruitmentJobsStatus.isLoading = true;
      }),
      switchMap((jobs) => defer(() => this.getWorkerPromise(jobs, this.recruitmentJobsStatus))),
      shareReplay(),
    );
  }

  private getAgileRelatedJobsObservable(): Observable<Job[]> {
    return this.atlasService.getAgileRelatedJobs().pipe(
      tap(() => {
        this.agileRelatedJobsStatus.isDownloading = false;
        this.agileRelatedJobsStatus.isLoading = true;
      }),
      switchMap((jobs) => defer(() => this.getWorkerPromise(jobs, this.agileRelatedJobsStatus))),
      shareReplay(),
    );
  }

  private getProductManagerJobsObservable(): Observable<Job[]> {
    return this.atlasService.getProductManagerJobs().pipe(
      tap(() => {
        this.productManagerJobsStatus.isDownloading = false;
        this.productManagerJobsStatus.isLoading = true;
      }),
      switchMap((jobs) => defer(() => this.getWorkerPromise(jobs, this.productManagerJobsStatus))),
      shareReplay(),
    );
  }

  private getAIJobsObservable(): Observable<Job[]> {
    return this.atlasService.getAIJobs().pipe(
      tap(() => {
        this.aiJobsStatus.isDownloading = false;
        this.aiJobsStatus.isLoading = true;
      }),
      switchMap((jobs) => defer(() => this.getWorkerPromise(jobs, this.aiJobsStatus))),
      shareReplay(),
    );
  }

  private getQAJobsObservable(): Observable<Job[]> {
    return this.atlasService.getQAJobs().pipe(
      tap(() => {
        this.qaJobsStatus.isDownloading = false;
        this.qaJobsStatus.isLoading = true;
      }),
      switchMap((jobs) => defer(() => this.getWorkerPromise(jobs, this.qaJobsStatus))),
      shareReplay(),
    );
  }

  private getDataJobsObservable(): Observable<Job[]> {
    return this.atlasService.getDataJobs().pipe(
      tap(() => {
        this.dataJobsStatus.isDownloading = false;
        this.dataJobsStatus.isLoading = true;
      }),
      switchMap((jobs) => defer(() => this.getWorkerPromise(jobs, this.dataJobsStatus))),
      shareReplay(),
    );
  }

  private getUIUXJobsObservable(): Observable<Job[]> {
    return this.atlasService.getUIUXJobs().pipe(
      tap(() => {
        this.uiuxJobsStatus.isDownloading = false;
        this.uiuxJobsStatus.isLoading = true;
      }),
      switchMap((jobs) => defer(() => this.getWorkerPromise(jobs, this.uiuxJobsStatus))),
      shareReplay(),
    );
  }

  private getDevOpsJobsObservable(): Observable<Job[]> {
    return this.atlasService.getDevOpsJobs().pipe(
      tap(() => {
        this.devJobsStatus.isDownloading = false;
        this.devJobsStatus.isLoading = true;
      }),
      switchMap((jobs) => defer(() => this.getWorkerPromise(jobs, this.devopsJobsStatus))),
      shareReplay(),
    );
  }

  private getMobileJobsObservable(): Observable<Job[]> {
    return this.atlasService.getMobileJobs().pipe(
      tap(() => {
        this.mobileJobsStatus.isDownloading = false;
        this.mobileJobsStatus.isLoading = true;
      }),
      switchMap((jobs) => defer(() => this.getWorkerPromise(jobs, this.mobileJobsStatus))),
      shareReplay(),
    );
  }

  private getDevJobsObservable(): Observable<Job[]> {
    return this.atlasService.getWebDevJobs().pipe(
      tap(() => {
        this.devJobsStatus.isDownloading = false;
        this.devJobsStatus.isLoading = true;
      }),
      switchMap((jobs) => defer(() => this.getWorkerPromise(jobs, this.devJobsStatus))),
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
