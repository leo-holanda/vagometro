import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GitHubJob } from './git-hub-jobs.types';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, first } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GitHubJobsService {
  private _frontendJobs$ = new BehaviorSubject<GitHubJob[] | undefined>(
    undefined
  );
  frontendJobs$ = this._frontendJobs$.asObservable();

  constructor(private httpClient: HttpClient) {
    this.getFrontendBrJobs();
  }

  getFrontendBrJobs(): void {
    this.httpClient
      .get<GitHubJob[]>(environment.GITHUB_WORKER_URL)
      .pipe(first())
      .subscribe((jobs) => {
        this._frontendJobs$.next(jobs);
      });
  }
}
