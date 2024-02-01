import { Injectable } from '@angular/core';
import { Observable, last, map, shareReplay } from 'rxjs';
import { DynamoService } from 'src/app/dynamo/dynamo.service';
import { ContractTypes, Job, WorkplaceTypes } from 'src/app/job/job.types';
import { DisabilityStatuses } from 'src/app/statistics/ranks/disability-rank/disability-rank.model';
import {
  educationRelatedTerms,
  educationalLevelTerms,
} from 'src/app/statistics/ranks/education-rank/education-rank.data';
import {
  internLevelRelatedTypes,
  traineeLevelRelatedTypes,
  juniorLevelRelatedTypes,
  seniorLevelRelatedTerms,
  midLevelRelatedTerms,
  juniorLevelRelatedTerms,
  traineeLevelRelatedTerms,
  internLevelRelatedTerms,
  specialistLevelRelatedTerms,
} from 'src/app/statistics/ranks/experience-levels-rank/experience-levels-rank.data';
import { ExperienceLevels } from 'src/app/statistics/ranks/experience-levels-rank/experience-levels-rank.model';
import { keywords } from 'src/app/statistics/ranks/keywords-rank/keywords-rank.data';
import { languageRelatedTerms } from 'src/app/statistics/ranks/languages-rank/languages-rank.data';
import { GupyJob } from './gupy.types';
import { gupyContractTypeMap } from 'src/app/statistics/ranks/type-rank/type-rank.translations';

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
      shareReplay()
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
      languages: this.getJobLanguages(gupyJob),
    };
  }

  private findJobContractType(job: GupyJob): ContractTypes[] {
    return [gupyContractTypeMap[job.type]];
  }

  private findJobDisabilityStatus(job: GupyJob): DisabilityStatuses {
    return job.disabilities
      ? DisabilityStatuses.PCD
      : DisabilityStatuses.nonPCD;
  }

  private getJobWorkplaceType(gupyJob: GupyJob): WorkplaceTypes[] {
    if (gupyJob.workplaceType == 'remote') return [WorkplaceTypes.remote];
    if (gupyJob.workplaceType == 'on-site') return [WorkplaceTypes['on-site']];
    if (gupyJob.workplaceType == 'hybrid') return [WorkplaceTypes.hybrid];

    return [WorkplaceTypes.unknown];
  }

  private getJobLanguages(gupyJob: GupyJob): string[] {
    const jobDescription = this.removeAccents(
      gupyJob.description.toLowerCase()
    );
    return languageRelatedTerms
      .filter((term) => jobDescription.includes(term.termForMatching))
      .map((term) => term.termForListing);
  }

  private findExperienceLevel(gupyJob: GupyJob): ExperienceLevels[] {
    if (internLevelRelatedTypes.includes(gupyJob.type))
      return [ExperienceLevels.intern];

    if (traineeLevelRelatedTypes.includes(gupyJob.type))
      return [ExperienceLevels.trainee];

    if (juniorLevelRelatedTypes.includes(gupyJob.type))
      return [ExperienceLevels.junior];

    //TODO: Create function for cleaning string data
    const contentFromJobTitle = this.removeAccents(gupyJob.name)
      .replaceAll('/', ' ')
      .replaceAll(',', ' ')
      .replaceAll('(', ' ')
      .replaceAll(')', ' ')
      .replaceAll('-', ' ')
      .replaceAll('[', ' ')
      .replaceAll(']', ' ')
      .replaceAll(';', ' ');
    const experienceLevelInTitle =
      this.matchExperienceLevelTerms(contentFromJobTitle);
    if (experienceLevelInTitle) return [experienceLevelInTitle];

    const experienceLevelInDescription = this.matchExperienceLevelTerms(
      gupyJob.description
    );
    if (experienceLevelInDescription) return [experienceLevelInDescription];

    return [ExperienceLevels.unknown];
  }

  private matchExperienceLevelTerms(
    content: string
  ): ExperienceLevels | undefined {
    const splittedContent = content
      .split(' ')
      .map((word) => word.toLowerCase());

    const hasSpecialistLevelRelatedTerms = specialistLevelRelatedTerms.some(
      (term) => splittedContent.includes(term)
    );
    if (hasSpecialistLevelRelatedTerms) return ExperienceLevels.specialist;

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
      // The typeof check is necessary to prevent the keywords constructor being matched.
      if (keywords[substring] && typeof keywords[substring] === 'string')
        jobKeywords.push(keywords[substring]);
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
      if (keywords[substring] && typeof keywords[substring] === 'string')
        jobKeywords.push(keywords[substring]);
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
