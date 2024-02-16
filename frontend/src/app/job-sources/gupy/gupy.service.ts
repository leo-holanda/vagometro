import { Injectable } from '@angular/core';
import { Observable, map, shareReplay } from 'rxjs';
import { GupyJob, gupyContractTypeMap } from './gupy.types';
import { AtlasService } from 'src/app/atlas/atlas.service';
import { internLevelRelatedTypes, traineeLevelRelatedTypes, juniorLevelRelatedTypes, ExperienceLevels } from 'src/app/shared/keywords-matcher/experience-levels.data';
import { Job } from 'src/app/job/job.types';
import { ContractTypes } from 'src/app/shared/keywords-matcher/contract-types.data';
import { EducationalData } from 'src/app/shared/keywords-matcher/education.data';
import { WorkplaceTypes } from 'src/app/shared/keywords-matcher/workplace.data';
import {
  matchCertificationStatus,
  matchEducationalTerms,
  matchExperienceLevel,
  matchInclusionTypes,
  matchKeywords,
  matchLanguages,
} from 'src/app/shared/keywords-matcher/keywords-matcher';
import { InclusionTypes } from 'src/app/shared/keywords-matcher/inclusion.data';
import { CertificationStatus } from 'src/app/shared/keywords-matcher/certification.data';

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
      companyName: job.careerPageName,
      companyUrl: job.careerPageUrl,
      description: job.description,
      educationalLevelTerms: educationalLevels,
      educationTerms: coursesNames,
      id: job.id,
      jobUrl: job.jobUrl,
      publishedDate: new Date(job.publishedDate),
      title: job.name,
      country: job.country || 'Desconhecido',
      state: job.state || 'Desconhecido',
      city: job.city || 'Desconhecido',
      contractTypes: this.findJobContractType(job),
      experienceLevels: this.findExperienceLevel(job),
      inclusionTypes: this.findJobInclusionTypes(job),
      keywords: this.getJobKeywords(job),
      languages: this.findJobLanguages(job),
      workplaceTypes: this.getJobWorkplaceType(job),
      certificationStatuses: this.findCertificationStatuses(job),
    };
  }

  private findCertificationStatuses(job: GupyJob): CertificationStatus[] {
    return matchCertificationStatus({ description: job.description });
  }

  private findJobContractType(job: GupyJob): ContractTypes[] {
    return [gupyContractTypeMap[job.type]];
  }

  private findJobInclusionTypes(job: GupyJob): InclusionTypes[] {
    let matchedInclusionTypes = matchInclusionTypes({ title: job.name, description: job.description });

    if (job.disabilities) {
      if (matchedInclusionTypes.includes(InclusionTypes.unknown)) {
        matchedInclusionTypes = [InclusionTypes.alsoForPCD];
      } else {
        matchedInclusionTypes.push(InclusionTypes.alsoForPCD);
      }
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
    return matchLanguages({ description: job.description });
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
}
