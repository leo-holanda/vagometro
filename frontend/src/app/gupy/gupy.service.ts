import { Injectable } from '@angular/core';
import { DynamoService } from '../dynamo/dynamo.service';
import { GupyJob } from './gupy.types';
import { Observable, last, map, share } from 'rxjs';
import { Job, WorkplaceTypes } from '../job/job.types';
import { ExperienceLevels } from '../statistics/ranks/experience-levels-rank/experience-levels-rank.model';
import {
  internLevelRelatedTypes,
  traineeLevelRelatedTypes,
  juniorLevelRelatedTypes,
  internLevelRelatedTerms,
  juniorLevelRelatedTerms,
  midLevelRelatedTerms,
  seniorLevelRelatedTerms,
  traineeLevelRelatedTerms,
} from '../statistics/ranks/experience-levels-rank/experience-levels-rank.data';
import {
  educationRelatedTerms,
  educationalLevelTerms,
} from '../statistics/ranks/education-rank/education-rank.data';
import { keywords } from '../statistics/ranks/keywords-rank/keywords-rank.data';
import { languageRelatedTerms } from '../statistics/ranks/languages-rank/languages-rank.data';
import { DisabilityStatuses } from '../statistics/ranks/disability-rank/disability-rank.model';

@Injectable({
  providedIn: 'root',
})
export class GupyService {
  jobs$: Observable<Job[]>;

  constructor(private dynamoService: DynamoService) {
    this.jobs$ = this.getJobsObservable();
  }

  private getJobsObservable(): Observable<Job[]> {
    return this.dynamoService.scanJobs().pipe(
      last(),
      map((output) =>
        output.map((response) => response.Items as GupyJob[]).flat()
      ),
      map((jobs) => {
        return jobs
          .map((job) => this.mapToJob(job))
          .sort((a, b) => (a.publishedDate > b.publishedDate ? -1 : 1));
      }),
      share()
    );
  }

  private mapToJob(gupyJob: GupyJob): Job {
    return {
      companyUrl: gupyJob.careerPageUrl,
      jobUrl: gupyJob.jobUrl,
      workplaceType: this.getJobWorkplaceType(gupyJob),
      country: gupyJob.country,
      title: gupyJob.name,
      state: gupyJob.state,
      city: gupyJob.city,
      disabilityStatus: this.findJobDisabilityStatus(gupyJob),
      companyName: gupyJob.careerPageName,
      description: gupyJob.description,
      id: gupyJob.id,
      publishedDate: gupyJob.publishedDate,
      contractType: gupyJob.type,
      experienceLevel: this.findExperienceLevel(gupyJob),
      keywords: this.getJobKeywords(gupyJob),
      educationTerms: this.getJobEducationTerms(gupyJob),
      educationalLevelTerms: this.getJobEducationalLevelTerms(gupyJob),
      languages: this.getJobLanguages(gupyJob),
    };
  }

  private findJobDisabilityStatus(job: GupyJob): DisabilityStatuses {
    return job.disabilities
      ? DisabilityStatuses.PCD
      : DisabilityStatuses.nonPCD;
  }

  private getJobWorkplaceType(gupyJob: GupyJob): WorkplaceTypes {
    if (gupyJob.workplaceType == 'remote') return WorkplaceTypes.remote;
    if (gupyJob.workplaceType == 'on-site') return WorkplaceTypes['on-site'];
    if (gupyJob.workplaceType == 'hybrid') return WorkplaceTypes.hybrid;

    return WorkplaceTypes.unknown;
  }

  private getJobLanguages(gupyJob: GupyJob): string[] {
    const jobDescription = this.removeAccents(
      gupyJob.description.toLowerCase()
    );
    return languageRelatedTerms
      .filter((term) => jobDescription.includes(term.termForMatching))
      .map((term) => term.termForListing);
  }

  private findExperienceLevel(gupyJob: GupyJob): ExperienceLevels {
    if (internLevelRelatedTypes.includes(gupyJob.type))
      return ExperienceLevels.intern;

    if (traineeLevelRelatedTypes.includes(gupyJob.type))
      return ExperienceLevels.trainee;

    if (juniorLevelRelatedTypes.includes(gupyJob.type))
      return ExperienceLevels.junior;

    const experienceLevelInTitle = this.matchExperienceLevelTerms(gupyJob.name);
    if (experienceLevelInTitle) return experienceLevelInTitle;

    const experienceLevelInDescription = this.matchExperienceLevelTerms(
      gupyJob.description
    );
    if (experienceLevelInDescription) return experienceLevelInDescription;

    return ExperienceLevels.unknown;
  }

  private matchExperienceLevelTerms(
    content: string
  ): ExperienceLevels | undefined {
    const splittedContent = content
      .split(' ')
      .map((word) => word.toLowerCase());

    const hasSeniorLevelRelatedTerms = seniorLevelRelatedTerms.some((term) =>
      splittedContent.includes(term)
    );
    if (hasSeniorLevelRelatedTerms) return ExperienceLevels.senior;

    const hasMidLevelRelatedTerms = midLevelRelatedTerms.some((term) =>
      splittedContent.includes(term)
    );
    if (hasMidLevelRelatedTerms) return ExperienceLevels.mid;

    const hasJuniorLevelRelatedTerms = juniorLevelRelatedTerms.some((term) =>
      splittedContent.includes(term)
    );
    if (hasJuniorLevelRelatedTerms) return ExperienceLevels.junior;

    const hasTraineeLevelRelatedTerms = traineeLevelRelatedTerms.some((term) =>
      splittedContent.includes(term)
    );
    if (hasTraineeLevelRelatedTerms) return ExperienceLevels.intern;

    const hasInternLevelRelatedTerms = internLevelRelatedTerms.some((term) =>
      splittedContent.includes(term)
    );
    if (hasInternLevelRelatedTerms) return ExperienceLevels.intern;

    return undefined;
  }

  private getJobKeywords(job: GupyJob): string[] {
    const jobKeywords: string[] = [];

    //TODO: Consider replace replaceAll with Regex
    const splittedTitle = job.name
      .replaceAll('/', ' ')
      .replaceAll(',', ' ')
      .replaceAll('(', ' ')
      .replaceAll(')', ' ')
      .replaceAll(';', ' ')
      .split(' ')
      .map((substring) => substring.toLowerCase());

    splittedTitle.forEach((substring: string) => {
      if (keywords[substring]) jobKeywords.push(keywords[substring]);
    });

    const splittedDescription = job.description
      .replaceAll('/', ' ')
      .replaceAll(',', ' ')
      .replaceAll('(', ' ')
      .replaceAll(')', ' ')
      .replaceAll(';', ' ')
      .split(' ')
      .map((substring) => substring.toLowerCase());

    splittedDescription.forEach((substring: string) => {
      if (keywords[substring]) jobKeywords.push(keywords[substring]);
    });

    return this.getUniqueStrings(jobKeywords);
  }

  private getJobEducationTerms(job: GupyJob): string[] {
    const jobDescription = this.removeAccents(job.description.toLowerCase());
    return educationRelatedTerms
      .filter((term) => jobDescription.includes(term.termForMatching))
      .map((term) => term.termForListing);
  }

  private getJobEducationalLevelTerms(job: GupyJob): string[] {
    const jobDescription = this.removeAccents(job.description.toLowerCase());
    return educationalLevelTerms
      .filter((term) => jobDescription.includes(term.termForMatching))
      .map((term) => term.termForListing);
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
