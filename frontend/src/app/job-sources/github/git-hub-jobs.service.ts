import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable, defer, first, shareReplay, tap } from 'rxjs';
import * as zip from '@zip.js/zip.js';
import { Job } from 'src/app/job/job.types';
import { EasySearchService } from 'src/app/job/easy-search/easy-search.service';
import { mapGitHubJobsToJobs } from './git-hub-jobs.mapper';
import { GitHubCollections } from './git-hub-jobs.types';

@Injectable({
  providedIn: 'root',
})
export class GitHubJobsService {
  frontendJobs$: Observable<Job[]>;
  frontendJobsStatus!: JobCollectionStatus;

  backendJobs$: Observable<Job[]>;
  backendJobsStatus!: JobCollectionStatus;

  soujavaJobs$: Observable<Job[]>;
  soujavaJobsStatus!: JobCollectionStatus;

  reactBrasilJobs$: Observable<Job[]>;
  reactBrasilJobsStatus!: JobCollectionStatus;

  androidDevBrJobs$: Observable<Job[]>;
  androidDevBrStatus!: JobCollectionStatus;

  constructor(private easySearchService: EasySearchService) {
    //https://github.com/frontendbr/vagas/issues
    this.frontendJobs$ = this.getJobsObservable('frontend');
    //https://github.com/backend-br/vagas/issues
    this.backendJobs$ = this.getJobsObservable('backend');
    //https://github.com/soujava/vagas-java/issues
    this.soujavaJobs$ = this.getJobsObservable('soujava');
    //https://github.com/react-brasil/vagas/issues
    this.reactBrasilJobs$ = this.getJobsObservable('react-brasil');
    //https://github.com/androiddevbr/vagas
    this.androidDevBrJobs$ = this.getJobsObservable('androiddevbr');
  }

  async getJobsPromise(
    //TODO: Auto generate this types
    type: GitHubCollections,
  ): Promise<Job[]> {
    // https://gildas-lormeau.github.io/zip.js/
    // Try catch is not necessary. Errors are handled in Job Source Service.

    const zippedJobs = await fetch(`${environment.GITHUB_WORKER_URL}/${type}`);
    const zipFileReader = new zip.BlobReader(await zippedJobs.blob());

    const zippedJobsWriter = new zip.TextWriter();
    const zipReader = new zip.ZipReader(zipFileReader);
    const firstEntry = (await zipReader.getEntries()).shift();
    const jobs = await firstEntry!.getData!(zippedJobsWriter);
    await zipReader.close();

    return new Promise((resolve) => {
      const worker = this.createWorker();
      const searchData = this.easySearchService.getSearchData();

      const collectionStatus = this.getCollectionStatus(type);
      collectionStatus.isDownloading = false;
      collectionStatus.isLoading = true;

      if (worker) {
        worker.postMessage({ jobs: JSON.parse(jobs), searchData });

        let hasFinished = false;
        worker.onmessage = ({ data }) => {
          if (hasFinished) resolve(data);

          if (data.loadingProgress == 1) hasFinished = true;
          collectionStatus.loadingProgress = data.loadingProgress;
        };

        worker.onerror = () => resolve(mapGitHubJobsToJobs(JSON.parse(jobs), searchData));
        worker.onmessageerror = () => resolve(mapGitHubJobsToJobs(JSON.parse(jobs), searchData));
      } else {
        resolve(mapGitHubJobsToJobs(JSON.parse(jobs), searchData));
      }
    });
  }

  getJobsObservable(type: GitHubCollections): Observable<Job[]> {
    return defer(() => this.getJobsPromise(type)).pipe(
      first(),
      tap(() => {
        this.sendEventToUmami(type);
      }),
      shareReplay(),
    );
  }

  private sendEventToUmami(jobCollection: string): void {
    try {
      (window as any).umami.track(`GitHub - ${jobCollection}`);
    } catch (error) {
      console.warn('Umami not available');
    }
  }

  private createWorker(): Worker | undefined {
    if (typeof Worker !== 'undefined') {
      return new Worker(new URL('./git-hub.worker', import.meta.url));
    } else {
      console.error('Web workers are not supported in this environment.');
      return undefined;
    }
  }

  private getCollectionStatus(type: GitHubCollections): JobCollectionStatus {
    switch (type) {
      case 'frontend':
        return this.frontendJobsStatus;

      case 'backend':
        return this.backendJobsStatus;

      case 'androiddevbr':
        return this.androidDevBrStatus;

      case 'react-brasil':
        return this.reactBrasilJobsStatus;

      case 'soujava':
        return this.soujavaJobsStatus;
    }
  }
}
