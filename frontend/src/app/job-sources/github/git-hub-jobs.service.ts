import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GitHubJob } from './git-hub-jobs.types';
import { environment } from 'src/environments/environment';
import { Observable, defer, first, map, shareReplay } from 'rxjs';
import { MapDataService } from '../../statistics/maps/map-data.service';
import { ExperienceLevels } from '../../shared/keywords-matcher/experience-levels.data';
import { keywords } from '../../shared/keywords-matcher/technologies.data';
import { educationRelatedTerms, educationalLevelTerms } from '../../shared/keywords-matcher/education.data';
import { DisabilityStatuses } from '../../statistics/ranks/disability-rank/disability-rank.model';
import * as zip from '@zip.js/zip.js';
import { Job } from 'src/app/job/job.types';
import { ContractTypes, contractTypeRelatedTerms } from 'src/app/shared/keywords-matcher/contract-types.data';
import { WorkplaceTypes, workplaceTypeRelatedTerms } from 'src/app/shared/keywords-matcher/workplace.data';
import { matchExperienceLevel, matchLanguages } from 'src/app/shared/keywords-matcher/keywords-matcher';

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

  private mapToJob(githubJob: GitHubJob): Job {
    return {
      companyUrl: '',
      jobUrl: githubJob.html_url,
      workplaceTypes: this.findJobWorkplaceTypes(githubJob),
      country: 'Brasil',
      title: githubJob.title,
      state: 'Desconhecido',
      city: 'Desconhecido',
      disabilityStatus: DisabilityStatuses.unknown,
      companyName: 'Desconhecido',
      description: githubJob.body,
      id: githubJob.id,
      publishedDate: new Date(githubJob.created_at),
      contractTypes: this.findContractTypesCitedInJob(githubJob),
      experienceLevels: this.findJobExperienceLevel(githubJob),
      keywords: this.findJobKeywords(githubJob),
      educationTerms: this.findCitedCoursesInJob(githubJob),
      educationalLevelTerms: this.findEducationalLevelsCitedInJob(githubJob),
      languages: this.findJobLanguages(githubJob),
    };
  }

  private findJobWorkplaceTypes(githubJob: GitHubJob): WorkplaceTypes[] {
    const matchedWorkplaceTypes: WorkplaceTypes[] = [];

    githubJob.labels.forEach((label) => {
      const labelContent = this.removeAccents(label).toLowerCase();

      const matchedWorkplaceType = workplaceTypeRelatedTerms[labelContent];

      if (matchedWorkplaceType) matchedWorkplaceTypes.push(matchedWorkplaceType);
    });

    Object.keys(workplaceTypeRelatedTerms).forEach((term) => {
      const titleHasTerm = this.removeAccents(githubJob.title).toLowerCase().includes(term);

      if (titleHasTerm) matchedWorkplaceTypes.push(workplaceTypeRelatedTerms[term]);
    });

    if (matchedWorkplaceTypes.length == 0) {
      const hasMatchedLabelWithCityName = githubJob.labels.some((label) => {
        const labelContent = this.removeAccents(label).toLowerCase();
        return this.citiesNames.includes(labelContent);
      });

      if (hasMatchedLabelWithCityName) matchedWorkplaceTypes.push(WorkplaceTypes['on-site']);

      const titleContent = this.removeAccents(githubJob.title).toLowerCase();

      const hasMatchedTitleWithCityName = this.citiesNames.some((cityName) => titleContent.includes(cityName));
      if (hasMatchedTitleWithCityName) matchedWorkplaceTypes.push(WorkplaceTypes['on-site']);
    }

    if (matchedWorkplaceTypes.length == 0) return [WorkplaceTypes.unknown];
    return this.getUniqueStrings(matchedWorkplaceTypes) as WorkplaceTypes[];
  }

  private findJobExperienceLevel(job: GitHubJob): ExperienceLevels[] {
    return matchExperienceLevel({ title: job.title, description: job.body });
  }

  private findJobKeywords(job: GitHubJob): string[] {
    return matchKeywords({ title: job.title, description: job.body });
  }

  private findCitedCoursesInJob(githubJob: GitHubJob): string[] {
    //TODO: Apparently there are some jobs without title or body. Investigate this.
    if (githubJob.body) {
      const jobDescription = this.removeAccents(githubJob.body).toLowerCase();

      return educationRelatedTerms.filter((term) => jobDescription.includes(term.termForMatching)).map((term) => term.termForListing);
    }

    return [];
  }

  private findEducationalLevelsCitedInJob(githubJob: GitHubJob): string[] {
    if (githubJob.body) {
      const jobDescription = this.removeAccents(githubJob.body).toLowerCase();

      return educationalLevelTerms.filter((term) => jobDescription.includes(term.termForMatching)).map((term) => term.termForListing);
    }

    return [];
  }

  private findJobLanguages(job: GitHubJob): string[] {
    return matchLanguages(job.body);
  }

  private findContractTypesCitedInJob(job: GitHubJob): ContractTypes[] {
    const matchedContractTypes: ContractTypes[] = [];

    job.labels.forEach((label) => {
      const labelContent = this.removeAccents(label).toLowerCase();
      const matchedContractType = contractTypeRelatedTerms[labelContent];
      if (matchedContractType) matchedContractTypes.push(matchedContractType);
    });

    Object.keys(contractTypeRelatedTerms).forEach((term) => {
      const titleHasTerm = this.removeAccents(job.title).toLowerCase().includes(term);

      if (titleHasTerm) matchedContractTypes.push(contractTypeRelatedTerms[term]);
    });

    if (matchedContractTypes.length == 0) return [ContractTypes.unknown];
    return this.getUniqueStrings(matchedContractTypes) as ContractTypes[];
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
function matchKeywords(arg0: { title: string; description: any }): string[] {
  throw new Error('Function not implemented.');
}
