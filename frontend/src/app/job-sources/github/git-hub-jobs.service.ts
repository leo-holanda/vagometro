import { Injectable } from '@angular/core';
import { GitHubJob } from './git-hub-jobs.types';
import { environment } from 'src/environments/environment';
import { Observable, defer, first, map, shareReplay, tap } from 'rxjs';
import { ExperienceLevels } from '../../shared/keywords-matcher/experience-levels.data';
import { EducationalData } from '../../shared/keywords-matcher/education.data';
import * as zip from '@zip.js/zip.js';
import { Job } from 'src/app/job/job.types';
import { ContractTypes } from 'src/app/shared/keywords-matcher/contract-types.data';
import { WorkplaceTypes } from 'src/app/shared/keywords-matcher/workplace.data';
import {
  matchCertificationStatus,
  matchContractTypes,
  matchEducationalTerms,
  matchExperienceLevel,
  matchInclusionTypes,
  matchKeywords,
  matchLanguages,
  matchWorkplaceTypes,
} from 'src/app/shared/keywords-matcher/keywords-matcher';
import { InclusionTypes } from 'src/app/shared/keywords-matcher/inclusion.data';
import { CertificationStatus } from 'src/app/shared/keywords-matcher/certification.data';

@Injectable({
  providedIn: 'root',
})
export class GitHubJobsService {
  frontendJobs$: Observable<Job[]>;
  backendJobs$: Observable<Job[]>;
  soujavaJobs$: Observable<Job[]>;

  constructor() {
    //https://github.com/frontendbr/vagas/issues
    this.frontendJobs$ = this.getJobsObservable('frontend');
    //https://github.com/backend-br/vagas/issues
    this.backendJobs$ = this.getJobsObservable('backend');
    //https://github.com/soujava/vagas-java/issues
    this.soujavaJobs$ = this.getJobsObservable('soujava');
  }

  async getJobsPromise(
    //TODO: Auto generate this types
    type: 'frontend' | 'backend' | 'soujava',
  ): Promise<GitHubJob[]> {
    // https://gildas-lormeau.github.io/zip.js/
    // Try catch is not necessary. Errors are handled in Job Source Service.

    const zippedJobs = await fetch(`${environment.GITHUB_WORKER_URL}/${type}`);
    const zipFileReader = new zip.BlobReader(await zippedJobs.blob());

    const zippedJobsWriter = new zip.TextWriter();
    const zipReader = new zip.ZipReader(zipFileReader);
    const firstEntry = (await zipReader.getEntries()).shift();
    const jobs = await firstEntry!.getData!(zippedJobsWriter);
    await zipReader.close();

    return JSON.parse(jobs);
  }

  getJobsObservable(type: 'frontend' | 'backend' | 'soujava'): Observable<Job[]> {
    return defer(() => this.getJobsPromise(type)).pipe(
      first(),
      map((jobs) => jobs.map((job) => this.mapToJob(job)).sort((a, b) => (a.publishedDate > b.publishedDate ? -1 : 1))),
      tap(() => this.sendEventToUmami(type)),
      shareReplay(),
    );
  }

  private mapToJob(job: GitHubJob): Job {
    const { coursesNames, educationalLevels } = this.findEducationalData(job);

    return {
      city: 'Desconhecido',
      companyUrl: '',
      country: 'Brasil',
      description: job.body,
      educationalLevelTerms: educationalLevels,
      educationTerms: coursesNames,
      id: job.id,
      jobUrl: job.html_url,
      publishedDate: new Date(job.created_at),
      state: 'Desconhecido',
      title: job.title,
      companyName: this.findCompanyName(job),
      contractTypes: this.findContractTypesCitedInJob(job),
      experienceLevels: this.findJobExperienceLevel(job),
      inclusionTypes: this.findInclusionTypes(job),
      keywords: this.findJobKeywords(job),
      languages: this.findJobLanguages(job),
      workplaceTypes: this.findJobWorkplaceTypes(job),
      certificationStatuses: this.findCertificationStatuses(job),
    };
  }

  private findCertificationStatuses(job: GitHubJob): CertificationStatus[] {
    return matchCertificationStatus({ description: job.body });
  }

  private findCompanyName(job: GitHubJob): string {
    if (job.title.includes('@')) {
      const splittedTitle = job.title.split('@');
      return splittedTitle[splittedTitle.length - 1];
    }

    if (job.title.includes('na ')) {
      const splittedTitle = job.title.split('na ');
      return splittedTitle[splittedTitle.length - 1];
    }

    if (job.title.includes('no ')) {
      const splittedTitle = job.title.split('no ');
      return splittedTitle[splittedTitle.length - 1];
    }

    if (job.title.includes('- ')) {
      const splittedTitle = job.title.split('- ');
      return splittedTitle[splittedTitle.length - 1];
    }

    return 'Desconhecido';
  }

  private findInclusionTypes(job: GitHubJob): InclusionTypes[] {
    return matchInclusionTypes({ title: job.title, description: job.body, labels: job.labels });
  }

  private findJobWorkplaceTypes(job: GitHubJob): WorkplaceTypes[] {
    return matchWorkplaceTypes({ title: job.title, description: job.body, labels: job.labels });
  }

  private findJobExperienceLevel(job: GitHubJob): ExperienceLevels[] {
    return matchExperienceLevel({ title: job.title, description: job.body, labels: job.labels });
  }

  private findJobKeywords(job: GitHubJob): string[] {
    return matchKeywords({ title: job.title, description: job.body, labels: job.labels });
  }

  private findEducationalData(job: GitHubJob): EducationalData {
    return matchEducationalTerms(job.body);
  }

  private findJobLanguages(job: GitHubJob): string[] {
    return matchLanguages({ description: job.body });
  }

  private findContractTypesCitedInJob(job: GitHubJob): ContractTypes[] {
    return matchContractTypes({ title: job.title, description: job.body, labels: job.labels });
  }

  private sendEventToUmami(jobCollection: string): void {
    console.log(`GitHub - ${jobCollection}`);
    try {
      (window as any).umami.track(`GitHub - ${jobCollection}`);
    } catch (error) {
      console.warn('Umami not available');
    }
  }
}
