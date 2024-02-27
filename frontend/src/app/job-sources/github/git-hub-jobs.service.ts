import { Injectable } from '@angular/core';
import { GitHubJob } from './git-hub-jobs.types';
import { environment } from 'src/environments/environment';
import { Observable, defer, first, shareReplay, tap } from 'rxjs';
import * as zip from '@zip.js/zip.js';
import { Job } from 'src/app/job/job.types';
import { mapGitHubJobToJob } from './git-hub-jobs.mapper';
import { EasySearchService } from 'src/app/job/easy-search/easy-search.service';

@Injectable({
  providedIn: 'root',
})
export class GitHubJobsService {
  frontendJobs$: Observable<Job[]>;
  backendJobs$: Observable<Job[]>;
  soujavaJobs$: Observable<Job[]>;
  reactBrasilJobs$: Observable<Job[]>;
  androidDevBrJobs$: Observable<Job[]>;

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
    type: 'frontend' | 'backend' | 'soujava' | 'react-brasil' | 'androiddevbr',
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
      if (worker) {
        worker.postMessage({ jobs: JSON.parse(jobs), searchData });
        worker.onmessage = ({ data }) => resolve(data);
        worker.onerror = () =>
          resolve(JSON.parse(jobs).map((job: GitHubJob) => mapGitHubJobToJob(job, searchData)));
        worker.onmessageerror = () =>
          resolve(JSON.parse(jobs).map((job: GitHubJob) => mapGitHubJobToJob(job, searchData)));
      } else {
        resolve(JSON.parse(jobs).map((job: GitHubJob) => mapGitHubJobToJob(job, searchData)));
      }
    });
  }

  getJobsObservable(
    type: 'frontend' | 'backend' | 'soujava' | 'react-brasil' | 'androiddevbr',
  ): Observable<Job[]> {
    return defer(() => this.getJobsPromise(type)).pipe(
      first(),
      tap(() => this.sendEventToUmami(type)),
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
}
