import { Injectable } from '@angular/core';
import { Observable, map, shareReplay } from 'rxjs';
import { AtlasService } from 'src/app/atlas/atlas.service';
import { ContractTypes, Job, WorkplaceTypes } from 'src/app/job/job.types';
import { LinkedInJob } from './linked-in.types';
import { DisabilityStatuses } from 'src/app/statistics/ranks/disability-rank/disability-rank.model';
import { ExperienceLevels } from 'src/app/statistics/ranks/experience-levels-rank/experience-levels-rank.model';

@Injectable({
  providedIn: 'root',
})
export class LinkedInService {
  devJobs$: Observable<Job[]>;

  constructor(private atlasService: AtlasService) {
    this.devJobs$ = this.getDevJobsObservable();
  }

  private getDevJobsObservable(): Observable<Job[]> {
    return this.atlasService.getLinkedInDevJobs().pipe(
      map((jobs) => {
        return jobs
          .map((job) => this.mapToJob(job))
          .sort((a, b) => (a.publishedDate > b.publishedDate ? -1 : 1));
      }),
      shareReplay()
    );
  }

  private mapToJob(job: LinkedInJob): Job {
    return {
      companyUrl: job.company_url,
      jobUrl: job.url,
      workplaceTypes: this.getJobWorkplaceType(job),
      country: 'Brasil',
      title: job.title,
      state: this.findJobState(),
      city: this.findJobCity(),
      disabilityStatus: DisabilityStatuses.unknown,
      companyName: job.company,
      description: job.description,
      id: job.id,
      publishedDate: new Date(job.date),
      contractTypes: this.findJobContractTypes(job),
      experienceLevels: this.findExperienceLevels(job),
      keywords: this.findJobKeywords(job),
      educationTerms: this.getJobEducationTerms(job),
      educationalLevelTerms: this.getJobEducationalLevelTerms(job),
      languages: this.getJobLanguages(job),
    };
  }

  getJobWorkplaceType(job: LinkedInJob): WorkplaceTypes[] {
    throw new Error('Method not implemented.');
  }

  findJobState(): string {
    throw new Error('Method not implemented.');
  }

  findJobCity(): string {
    throw new Error('Method not implemented.');
  }

  findJobContractTypes(job: LinkedInJob): ContractTypes[] {
    throw new Error('Method not implemented.');
  }

  findExperienceLevels(job: LinkedInJob): ExperienceLevels[] {
    throw new Error('Method not implemented.');
  }

  findJobKeywords(job: LinkedInJob): string[] {
    throw new Error('Method not implemented.');
  }

  getJobEducationTerms(job: LinkedInJob): string[] {
    throw new Error('Method not implemented.');
  }

  getJobEducationalLevelTerms(job: LinkedInJob): string[] {
    throw new Error('Method not implemented.');
  }

  getJobLanguages(job: LinkedInJob): string[] {
    throw new Error('Method not implemented.');
  }
}
