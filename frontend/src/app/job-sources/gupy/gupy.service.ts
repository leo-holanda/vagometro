import { Injectable } from '@angular/core';
import { Observable, map, shareReplay } from 'rxjs';
import { DisabilityStatuses } from 'src/app/statistics/ranks/disability-rank/disability-rank.model';
import { GupyJob, gupyContractTypeMap } from './gupy.types';
import { AtlasService } from 'src/app/atlas/atlas.service';
import { internLevelRelatedTypes, traineeLevelRelatedTypes, juniorLevelRelatedTypes, ExperienceLevels } from 'src/app/shared/keywords-matcher/experience-levels.data';
import { keywords } from 'src/app/shared/keywords-matcher/technologies.data';
import { Job } from 'src/app/job/job.types';
import { ContractTypes } from 'src/app/shared/keywords-matcher/contract-types.data';
import { educationRelatedTerms, educationalLevelTerms } from 'src/app/shared/keywords-matcher/education.data';
import { WorkplaceTypes } from 'src/app/shared/keywords-matcher/workplace.data';
import { matchExperienceLevel, matchKeywords, matchLanguages } from 'src/app/shared/keywords-matcher/keywords-matcher';

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

  private mapToJob(gupyJob: GupyJob): Job {
    return {
      companyUrl: gupyJob.careerPageUrl,
      jobUrl: gupyJob.jobUrl,
      workplaceTypes: this.getJobWorkplaceType(gupyJob),
      country: gupyJob.country,
      title: gupyJob.name,
      state: gupyJob.state,
      city: gupyJob.city,
      disabilityStatus: this.findJobDisabilityStatus(gupyJob),
      companyName: gupyJob.careerPageName,
      description: gupyJob.description,
      id: gupyJob.id,
      publishedDate: new Date(gupyJob.publishedDate),
      contractTypes: this.findJobContractType(gupyJob),
      experienceLevels: this.findExperienceLevel(gupyJob),
      keywords: this.getJobKeywords(gupyJob),
      educationTerms: this.getJobEducationTerms(gupyJob),
      educationalLevelTerms: this.getJobEducationalLevelTerms(gupyJob),
      languages: this.findJobLanguages(gupyJob),
    };
  }

  private findJobContractType(job: GupyJob): ContractTypes[] {
    return [gupyContractTypeMap[job.type]];
  }

  private findJobDisabilityStatus(job: GupyJob): DisabilityStatuses {
    return job.disabilities ? DisabilityStatuses.PCD : DisabilityStatuses.nonPCD;
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

  private getJobEducationTerms(job: GupyJob): string[] {
    const jobDescription = this.removeAccents(job.description.toLowerCase());
    return educationRelatedTerms.filter((term) => jobDescription.includes(term.termForMatching)).map((term) => term.termForListing);
  }

  private getJobEducationalLevelTerms(job: GupyJob): string[] {
    const jobDescription = this.removeAccents(job.description.toLowerCase());
    return educationalLevelTerms.filter((term) => jobDescription.includes(term.termForMatching)).map((term) => term.termForListing);
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
