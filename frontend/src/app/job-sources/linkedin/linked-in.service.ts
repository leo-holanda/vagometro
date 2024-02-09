import { Injectable } from '@angular/core';
import { Observable, map, shareReplay } from 'rxjs';
import { AtlasService } from 'src/app/atlas/atlas.service';
import {
  ContractTypes,
  Job,
  WorkplaceTypes,
  contractTypeRelatedTerms,
  workplaceTypeRelatedTerms,
} from 'src/app/job/job.types';
import {
  LinkedInJob,
  linkedInEmploymentTypesMap,
  linkedInSeniorityLevelsMap,
} from './linked-in.types';
import { DisabilityStatuses } from 'src/app/statistics/ranks/disability-rank/disability-rank.model';
import { ExperienceLevels } from 'src/app/statistics/ranks/experience-levels-rank/experience-levels-rank.model';
import { keywords } from 'src/app/statistics/ranks/keywords-rank/keywords-rank.data';
import {
  educationRelatedTerms,
  educationalLevelTerms,
} from 'src/app/statistics/ranks/education-rank/education-rank.data';
import { languageRelatedTerms } from 'src/app/statistics/ranks/languages-rank/languages-rank.data';
import {
  specialistLevelRelatedTerms,
  seniorLevelRelatedTerms,
  midLevelRelatedTerms,
  juniorLevelRelatedTerms,
  traineeLevelRelatedTerms,
  internLevelRelatedTerms,
} from 'src/app/statistics/ranks/experience-levels-rank/experience-levels-rank.data';
import { MapDataService } from 'src/app/statistics/maps/map-data.service';

@Injectable({
  providedIn: 'root',
})
export class LinkedInService {
  devJobs$: Observable<Job[]>;
  private statesNames: string[];

  constructor(
    private atlasService: AtlasService,
    private mapData: MapDataService
  ) {
    this.devJobs$ = this.getDevJobsObservable();
    //TODO: Fix this function name
    this.statesNames = this.mapData
      .getCitiesNames()
      .map((stateName) => this.removeAccents(stateName).toLowerCase());
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
    // Why can't I just do replaceAll in the object below?
    const sanitizedJobDescription = job.description.replaceAll('\n', ' ');
    job.description = sanitizedJobDescription;

    const educationTerms = this.getJobEducationTerms(job);
    const educationalLevelTerms = this.getJobEducationalLevelTerms(
      job,
      educationTerms
    );

    return {
      companyUrl: job.company_url,
      jobUrl: job.url,
      country: 'Brasil',
      title: job.title,
      disabilityStatus: DisabilityStatuses.unknown,
      companyName: job.company_name,
      description: sanitizedJobDescription,
      id: job.id,
      city: this.findJobCity(job),
      contractTypes: this.findJobContractTypes(job),
      educationTerms: educationTerms,
      educationalLevelTerms: educationalLevelTerms,
      experienceLevels: this.findExperienceLevels(job),
      keywords: this.findJobKeywords(job),
      languages: this.getJobLanguages(job),
      publishedDate: new Date(job.created_at),
      state: this.findJobState(job),
      workplaceTypes: this.getJobWorkplaceType(job),
    };
  }

  private getJobWorkplaceType(job: LinkedInJob): WorkplaceTypes[] {
    const matchedWorkplaceTypes: WorkplaceTypes[] = [];

    Object.keys(workplaceTypeRelatedTerms).forEach((term) => {
      const titleHasTerm = this.removeAccents(job.title)
        .toLowerCase()
        .includes(term);

      if (titleHasTerm)
        matchedWorkplaceTypes.push(workplaceTypeRelatedTerms[term]);

      const descriptionHasTerm = this.removeAccents(job.description)
        .toLowerCase()
        .includes(term);

      if (descriptionHasTerm)
        matchedWorkplaceTypes.push(workplaceTypeRelatedTerms[term]);
    });

    if (matchedWorkplaceTypes.length == 0) return [WorkplaceTypes.unknown];
    return this.getUniqueStrings(matchedWorkplaceTypes) as WorkplaceTypes[];
  }

  private findJobState(job: LinkedInJob): string {
    /*
      Expected job.location
      - "Maceió, Alagoas, Brazil"
      - "Alagoas, Brazil"
      - "Maceió, Alagoas"
      - "Greater Alagoas Area"
      - "Brazil"
    */

    const splittedLocation = job.location.split(',');
    if (splittedLocation.length == 3) {
      return splittedLocation[1].trim();
    }

    if (splittedLocation.length == 2) {
      const possibleStateName = this.removeAccents(
        splittedLocation[0]
      ).toLowerCase();
      const possibleStateName2 = this.removeAccents(
        splittedLocation[1]
      ).toLowerCase();
      if (this.statesNames.includes(possibleStateName))
        return splittedLocation[0];
      if (this.statesNames.includes(possibleStateName2))
        return splittedLocation[1];
    }

    if (splittedLocation.length == 0) {
      const matchedLocation = this.statesNames.find(
        (cityName) => cityName == job.location
      );
      if (matchedLocation) return matchedLocation;
    }

    return 'Desconhecido';
  }

  private findJobCity(job: LinkedInJob): string {
    const splittedLocation = job.location.split(',');
    if (splittedLocation.length == 3) {
      return splittedLocation[0].trim();
    }

    if (splittedLocation.length == 2) {
      const possibleCityName = this.removeAccents(
        splittedLocation[0]
      ).toLowerCase();
      if (!this.statesNames.includes(possibleCityName))
        return splittedLocation[0];
    }

    return 'Desconhecido';
  }

  private findJobContractTypes(job: LinkedInJob): ContractTypes[] {
    const matchedContractTypes: ContractTypes[] = [];

    // Is sanitized the correct name for this?
    const sanitizedJobTitle = this.removeAccents(job.title).toLowerCase();
    const sanitizedJobDescription = this.removeAccents(
      job.description
    ).toLowerCase();

    Object.keys(contractTypeRelatedTerms).forEach((term) => {
      const titleHasTerm = sanitizedJobTitle.includes(term);
      if (titleHasTerm)
        matchedContractTypes.push(contractTypeRelatedTerms[term]);

      const descriptionHasTerm = sanitizedJobDescription.includes(term);
      if (descriptionHasTerm)
        matchedContractTypes.push(contractTypeRelatedTerms[term]);
    });

    if (matchedContractTypes.length == 0 && job.employment_type) {
      matchedContractTypes.push(
        linkedInEmploymentTypesMap[job.employment_type] || ContractTypes.unknown
      );
      return matchedContractTypes;
    }

    if (matchedContractTypes.length == 0) return [ContractTypes.unknown];
    return this.getUniqueStrings(matchedContractTypes) as ContractTypes[];
  }

  private findExperienceLevels(job: LinkedInJob): ExperienceLevels[] {
    const jobExperienceLevels: ExperienceLevels[] = [];

    const termsMatchedWithTitle = this.matchExperienceLevelTerms(
      job.title.split(' ')
    );
    jobExperienceLevels.push(...termsMatchedWithTitle);

    const termsMatchedWithDescription = this.matchExperienceLevelTerms(
      job.description.split(' ')
    );
    jobExperienceLevels.push(...termsMatchedWithDescription);

    if (jobExperienceLevels.length == 0 && job.seniority_level) {
      jobExperienceLevels.push(
        linkedInSeniorityLevelsMap[job.seniority_level] ||
          ExperienceLevels.unknown
      );
      return jobExperienceLevels;
    }

    if (jobExperienceLevels.length == 0) return [ExperienceLevels.unknown];
    return this.getUniqueStrings(jobExperienceLevels) as ExperienceLevels[];
  }

  private matchExperienceLevelTerms(content: string[]): ExperienceLevels[] {
    const sanitizedContent = content.map((contentItem) =>
      this.removeAccents(contentItem).toLowerCase()
    );

    const matchedExperienceLevels = [];

    const hasSpecialistLevelRelatedTerms = specialistLevelRelatedTerms.some(
      (term) => sanitizedContent.includes(term)
    );
    if (hasSpecialistLevelRelatedTerms)
      matchedExperienceLevels.push(ExperienceLevels.specialist);

    const hasSeniorLevelRelatedTerms = seniorLevelRelatedTerms.some((term) =>
      sanitizedContent.includes(term)
    );
    if (hasSeniorLevelRelatedTerms)
      matchedExperienceLevels.push(ExperienceLevels.senior);

    const hasMidLevelRelatedTerms = midLevelRelatedTerms.some((term) =>
      sanitizedContent.includes(term)
    );
    if (hasMidLevelRelatedTerms)
      matchedExperienceLevels.push(ExperienceLevels.mid);

    const hasJuniorLevelRelatedTerms = juniorLevelRelatedTerms.some((term) =>
      sanitizedContent.includes(term)
    );
    if (hasJuniorLevelRelatedTerms)
      matchedExperienceLevels.push(ExperienceLevels.junior);

    const hasTraineeLevelRelatedTerms = traineeLevelRelatedTerms.some((term) =>
      sanitizedContent.includes(term)
    );
    if (hasTraineeLevelRelatedTerms)
      matchedExperienceLevels.push(ExperienceLevels.intern);

    const hasInternLevelRelatedTerms = internLevelRelatedTerms.some((term) =>
      sanitizedContent.includes(term)
    );
    if (hasInternLevelRelatedTerms)
      matchedExperienceLevels.push(ExperienceLevels.intern);

    return matchedExperienceLevels;
  }

  private findJobKeywords(job: LinkedInJob): string[] {
    const jobKeywords: string[] = [];

    //TODO: Apparently there are some jobs without title or body. Investigate this.
    //TODO: Consider replace replaceAll with Regex
    if (job.title) {
      const splittedTitle = job.title
        .replaceAll('/', ' ')
        .replaceAll('\\', ' ')
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
    }

    if (job.description) {
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
    }

    return this.getUniqueStrings(jobKeywords);
  }

  private getJobEducationTerms(job: LinkedInJob): string[] {
    if (job.description) {
      const jobDescription = this.removeAccents(job.description).toLowerCase();

      return educationRelatedTerms
        .filter((term) => jobDescription.includes(term.termForMatching))
        .map((term) => term.termForListing);
    }

    return [];
  }

  private getJobEducationalLevelTerms(
    job: LinkedInJob,
    educationTerms: string[]
  ): string[] {
    if (job.description) {
      const jobDescription = this.removeAccents(job.description).toLowerCase();

      const matchedTerms = educationalLevelTerms
        .filter((term) => jobDescription.includes(term.termForMatching))
        .map((term) => term.termForListing);

      if (educationTerms.length > 0) matchedTerms.push('Graduação');

      return this.getUniqueStrings(matchedTerms);
    }

    return [];
  }

  private getJobLanguages(job: LinkedInJob): string[] {
    if (job.description) {
      const jobDescription = this.removeAccents(job.description).toLowerCase();

      return languageRelatedTerms
        .filter((term) => jobDescription.includes(term.termForMatching))
        .map((term) => term.termForListing);
    }

    return [];
  }

  //TODO: Move this function to a utils module
  private removeAccents(string: string) {
    //TODO: Understand how it works
    return string.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  //TODO: Move this function to a utils module
  private getUniqueStrings(strings: string[]): string[] {
    const uniqueSet = new Set(strings);
    const uniqueArray = Array.from(uniqueSet);
    return uniqueArray;
  }
}
