import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GitHubJob } from './git-hub-jobs.types';
import { environment } from 'src/environments/environment';
import { Observable, defer, first, map, shareReplay } from 'rxjs';
import { MapDataService } from '../../statistics/maps/map-data.service';
import { ExperienceLevels } from '../../shared/keywords-matcher/experience-levels.data';
import { EducationalData } from '../../shared/keywords-matcher/education.data';
import { DisabilityStatuses } from '../../statistics/ranks/disability-rank/disability-rank.model';
import * as zip from '@zip.js/zip.js';
import { Job } from 'src/app/job/job.types';
import { ContractTypes } from 'src/app/shared/keywords-matcher/contract-types.data';
import { WorkplaceTypes } from 'src/app/shared/keywords-matcher/workplace.data';
import {
  matchContractTypes,
  matchEducationalTerms,
  matchExperienceLevel,
  matchKeywords,
  matchLanguages,
  matchWorkplaceTypes,
} from 'src/app/shared/keywords-matcher/keywords-matcher';

@Injectable({
  providedIn: 'root',
})
export class GitHubJobsService {
  frontendJobs$: Observable<Job[]>;
  backendJobs$: Observable<Job[]>;
  soujavaJobs$: Observable<Job[]>;

  private citiesNames: string[];

  constructor(
    private httpClient: HttpClient,
    private mapDataService: MapDataService,
  ) {
    //https://github.com/frontendbr/vagas/issues
    this.frontendJobs$ = this.getJobsObservable('frontend');
    //https://github.com/backend-br/vagas/issues
    this.backendJobs$ = this.getJobsObservable('backend');
    //https://github.com/soujava/vagas-java/issues
    this.soujavaJobs$ = this.getJobsObservable('soujava');

    this.citiesNames = this.mapDataService.getCitiesNames().map((cityName) => this.removeAccents(cityName).toLowerCase());
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
      shareReplay(),
    );
  }

  private mapToJob(job: GitHubJob): Job {
    const { coursesNames, educationalLevels } = this.findEducationalData(job);

    return {
      companyUrl: '',
      jobUrl: job.html_url,
      workplaceTypes: this.findJobWorkplaceTypes(job),
      country: 'Brasil',
      title: job.title,
      state: 'Desconhecido',
      city: 'Desconhecido',
      disabilityStatus: DisabilityStatuses.unknown,
      companyName: 'Desconhecido',
      description: job.body,
      id: job.id,
      publishedDate: new Date(job.created_at),
      contractTypes: this.findContractTypesCitedInJob(job),
      experienceLevels: this.findJobExperienceLevel(job),
      keywords: this.findJobKeywords(job),
      educationTerms: coursesNames,
      educationalLevelTerms: educationalLevels,
      languages: this.findJobLanguages(job),
    };
  }

  private findJobWorkplaceTypes(job: GitHubJob): WorkplaceTypes[] {
    return matchWorkplaceTypes({ title: job.title, description: job.body, labels: job.labels });
  }

  private findJobExperienceLevel(job: GitHubJob): ExperienceLevels[] {
    return matchExperienceLevel({ title: job.title, description: job.body });
  }

  private findJobKeywords(job: GitHubJob): string[] {
    return matchKeywords({ title: job.title, description: job.body });
  }

  private findEducationalData(job: GitHubJob): EducationalData {
    return matchEducationalTerms(job.body);
  }

  private findJobLanguages(job: GitHubJob): string[] {
    return matchLanguages(job.body);
  }

  private findContractTypesCitedInJob(job: GitHubJob): ContractTypes[] {
    return matchContractTypes({ title: job.title, description: job.body, labels: job.labels });
  }

  private removeAccents(string: string) {
    //TODO Understand how it works
    return string.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  private getUniqueStrings(strings: string[]): string[] {
    const uniqueSet = new Set(strings);
    const uniqueArray = Array.from(uniqueSet);
    return uniqueArray;
  }
}
