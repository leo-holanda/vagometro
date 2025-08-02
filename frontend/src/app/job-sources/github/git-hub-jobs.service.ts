import { Injectable } from '@angular/core';
import { Observable, catchError, defer, finalize, first, shareReplay } from 'rxjs';
import { Job } from 'src/app/job/job.types';
import { EasySearchService } from 'src/app/job/easy-search/easy-search.service';
import { mapGitHubJobsToJobs } from './git-hub-jobs.mapper';
import { R2Service } from 'src/app/r2/r2.service';
import { QuarterData, Quarters } from '../job-sources.types';
import { GitHubJob } from './git-hub-jobs.types';
import { trackError, trackJobCollection } from 'src/app/shared/umami';

@Injectable({
  providedIn: 'root',
})
export class GitHubJobsService {
  constructor(
    private R2Service: R2Service,
    private easySearchService: EasySearchService,
  ) {}

  getJobs(
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
    const jobs = await this.R2Service.getJobs(collectionName, year, quarter, quarterData);

    return new Promise((resolve) => {
      const worker = this.createWorker();
      const searchData = this.easySearchService.getSearchData();

      quarterData.isDownloading = false;
      quarterData.isLoading = true;

      if (worker) {
        worker.postMessage({ jobs, searchData });

        let hasFinished = false;
        worker.onmessage = ({ data }) => {
          if (hasFinished) resolve(data);

          if (data.loadingProgress == 1) hasFinished = true;
          quarterData.loadingProgress = data.loadingProgress;
        };

        worker.onerror = () => resolve(mapGitHubJobsToJobs(jobs as GitHubJob[], searchData));
        worker.onmessageerror = () => resolve(mapGitHubJobsToJobs(jobs as GitHubJob[], searchData));
      } else {
        resolve(mapGitHubJobsToJobs(jobs as GitHubJob[], searchData));
      }
    });
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
