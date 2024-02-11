import { Injectable } from '@angular/core';
import { Observable, map, shareReplay } from 'rxjs';
import { GupyJob, gupyContractTypeMap } from './gupy.types';
import { AtlasService } from 'src/app/atlas/atlas.service';
import {
  internLevelRelatedTypes,
  traineeLevelRelatedTypes,
  juniorLevelRelatedTypes,
  ExperienceLevels,
} from 'src/app/shared/keywords-matcher/experience-levels.data';
import { Job } from 'src/app/job/job.types';
import { ContractTypes } from 'src/app/shared/keywords-matcher/contract-types.data';
import { EducationalData } from 'src/app/shared/keywords-matcher/education.data';
import { WorkplaceTypes } from 'src/app/shared/keywords-matcher/workplace.data';
import {
  matchEducationalTerms,
  matchExperienceLevel,
  matchInclusionTypes,
  matchKeywords,
  matchLanguages,
} from 'src/app/shared/keywords-matcher/keywords-matcher';
import { InclusionTypes } from 'src/app/statistics/ranks/inclusion-rank/inclusion-rank.model';

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

  private getAIJobsObservable(): Observable<Job[]> {
    return this.atlasService.getAIJobs().pipe(
      map((jobs) => {
        return jobs.map((job) => this.mapToJob(job)).sort((a, b) => (a.publishedDate > b.publishedDate ? -1 : 1));
      }),
      shareReplay(),
    );
  }

  private getQAJobsObservable(): Observable<Job[]> {
    return this.atlasService.getQAJobs().pipe(
      map((jobs) => {
        return jobs.map((job) => this.mapToJob(job)).sort((a, b) => (a.publishedDate > b.publishedDate ? -1 : 1));
      }),
      shareReplay(),
    );
  }

  private getDataJobsObservable(): Observable<Job[]> {
    return this.atlasService.getDataJobs().pipe(
      map((jobs) => {
        return jobs.map((job) => this.mapToJob(job)).sort((a, b) => (a.publishedDate > b.publishedDate ? -1 : 1));
      }),
      shareReplay(),
    );
  }

  private getUIUXJobsObservable(): Observable<Job[]> {
    return this.atlasService.getUIUXJobs().pipe(
      map((jobs) => {
        return jobs.map((job) => this.mapToJob(job)).sort((a, b) => (a.publishedDate > b.publishedDate ? -1 : 1));
      }),
      shareReplay(),
    );
  }

  private getDevOpsJobsObservable(): Observable<Job[]> {
    return this.atlasService.getDevOpsJobs().pipe(
      map((jobs) => {
        return jobs.map((job) => this.mapToJob(job)).sort((a, b) => (a.publishedDate > b.publishedDate ? -1 : 1));
      }),
      shareReplay(),
    );
  }

  private getMobileJobsObservable(): Observable<Job[]> {
    return this.atlasService.getMobileJobs().pipe(
      map((jobs) => {
        return jobs.map((job) => this.mapToJob(job)).sort((a, b) => (a.publishedDate > b.publishedDate ? -1 : 1));
      }),
      shareReplay(),
    );
  }

  private getDevJobsObservable(): Observable<Job[]> {
    return this.atlasService.getWebDevJobs().pipe(
      map((jobs) => {
        return jobs.map((job) => this.mapToJob(job)).sort((a, b) => (a.publishedDate > b.publishedDate ? -1 : 1));
      }),
      shareReplay(),
    );
  }

  private mapToJob(job: GupyJob): Job {
    const { coursesNames, educationalLevels } = this.findEducationalData(job);

    return {
      companyUrl: job.careerPageUrl,
      jobUrl: job.jobUrl,
      country: job.country,
      title: job.name,
      state: job.state,
      city: job.city,
      inclusionTypes: this.findJobInclusionTypes(job),
      companyName: job.careerPageName,
      description: job.description,
      id: job.id,
      workplaceTypes: this.getJobWorkplaceType(job),
      publishedDate: new Date(job.publishedDate),
      contractTypes: this.findJobContractType(job),
      experienceLevels: this.findExperienceLevel(job),
      keywords: this.getJobKeywords(job),
      educationTerms: coursesNames,
      educationalLevelTerms: educationalLevels,
      languages: this.findJobLanguages(job),
    };
  }

  private findJobContractType(job: GupyJob): ContractTypes[] {
    return [gupyContractTypeMap[job.type]];
  }

  private findJobInclusionTypes(job: GupyJob): InclusionTypes[] {
    const matchedInclusionTypes = matchInclusionTypes({ title: job.name, description: job.description });
    if (job.disabilities && !matchedInclusionTypes.includes(InclusionTypes.PCD)) {
      matchedInclusionTypes.push(InclusionTypes.PCD);
    }

    return matchedInclusionTypes;
  }

  private getJobWorkplaceType(gupyJob: GupyJob): WorkplaceTypes[] {
    if (gupyJob.workplaceType == 'remote') return [WorkplaceTypes.remote];
    if (gupyJob.workplaceType == 'on-site') return [WorkplaceTypes['on-site']];
    if (gupyJob.workplaceType == 'hybrid') return [WorkplaceTypes.hybrid];

    return [WorkplaceTypes.unknown];
  }

  private findJobLanguages(job: GupyJob): string[] {
    return matchLanguages(job.description);
  }

  private findExperienceLevel(job: GupyJob): ExperienceLevels[] {
    if (internLevelRelatedTypes.includes(job.type)) return [ExperienceLevels.intern];
    if (traineeLevelRelatedTypes.includes(job.type)) return [ExperienceLevels.trainee];
    if (juniorLevelRelatedTypes.includes(job.type)) return [ExperienceLevels.junior];

    return matchExperienceLevel({ title: job.name, description: job.description });
  }

  private getJobKeywords(job: GupyJob): string[] {
    return matchKeywords({ title: job.name, description: job.description });
  }

  private findEducationalData(job: GupyJob): EducationalData {
    return matchEducationalTerms(job.description);
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
