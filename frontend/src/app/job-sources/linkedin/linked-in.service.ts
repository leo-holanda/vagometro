import { Injectable } from '@angular/core';
import { Observable, map, shareReplay } from 'rxjs';
import { AtlasService } from 'src/app/atlas/atlas.service';
import { LinkedInJob, linkedInEmploymentTypesMap } from './linked-in.types';
import { MapDataService } from 'src/app/statistics/maps/map-data.service';
import { ExperienceLevels } from 'src/app/shared/keywords-matcher/experience-levels.data';
import { Job } from 'src/app/job/job.types';
import { ContractTypes } from 'src/app/shared/keywords-matcher/contract-types.data';
import { WorkplaceTypes } from 'src/app/shared/keywords-matcher/workplace.data';
import {
  matchContractTypes,
  matchEducationalTerms,
  matchExperienceLevel,
  matchInclusionTypes,
  matchKeywords,
  matchLanguages,
  matchWorkplaceTypes,
} from 'src/app/shared/keywords-matcher/keywords-matcher';
import { EducationalData } from 'src/app/shared/keywords-matcher/education.data';
import { InclusionTypes } from 'src/app/shared/keywords-matcher/inclusion.data';

@Injectable({
  providedIn: 'root',
})
export class LinkedInService {
  devJobs$: Observable<Job[]>;
  private statesNames: string[];

  constructor(
    private atlasService: AtlasService,
    private mapData: MapDataService,
  ) {
    this.devJobs$ = this.getDevJobsObservable();
    //TODO: Fix this function name
    this.statesNames = this.mapData.getCitiesNames().map((stateName) => this.removeAccents(stateName).toLowerCase());
  }

  private getDevJobsObservable(): Observable<Job[]> {
    return this.atlasService.getLinkedInDevJobs().pipe(
      map((jobs) => {
        return jobs.map((job) => this.mapToJob(job)).sort((a, b) => (a.publishedDate > b.publishedDate ? -1 : 1));
      }),
      shareReplay(),
    );
  }

  private mapToJob(job: LinkedInJob): Job {
    // Why can't I just do replaceAll in the object below?
    const sanitizedJobDescription = job.description.replaceAll('\n', ' ');
    job.description = sanitizedJobDescription;

    const { coursesNames, educationalLevels } = this.findEducationalData(job);

    return {
      companyName: job.company_name,
      companyUrl: job.company_url,
      country: 'Brasil',
      description: sanitizedJobDescription,
      educationalLevelTerms: educationalLevels,
      educationTerms: coursesNames,
      id: job.id,
      jobUrl: job.url,
      publishedDate: new Date(job.created_at),
      title: job.title,
      city: this.findJobCity(job),
      contractTypes: this.findJobContractTypes(job),
      experienceLevels: this.findExperienceLevels(job),
      inclusionTypes: this.findInclusionTypes(job),
      keywords: this.findJobKeywords(job),
      languages: this.findJobLanguages(job),
      state: this.findJobState(job),
      workplaceTypes: this.getJobWorkplaceType(job),
    };
  }

  private findInclusionTypes(job: LinkedInJob): InclusionTypes[] {
    return matchInclusionTypes({ title: job.title, description: job.description });
  }

  private getJobWorkplaceType(job: LinkedInJob): WorkplaceTypes[] {
    return matchWorkplaceTypes({ title: job.title, description: job.description });
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
      const possibleStateName = this.removeAccents(splittedLocation[0]).toLowerCase();
      const possibleStateName2 = this.removeAccents(splittedLocation[1]).toLowerCase();
      if (this.statesNames.includes(possibleStateName)) return splittedLocation[0];
      if (this.statesNames.includes(possibleStateName2)) return splittedLocation[1];
    }

    if (splittedLocation.length == 0) {
      const matchedLocation = this.statesNames.find((cityName) => cityName == job.location);
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
      const possibleCityName = this.removeAccents(splittedLocation[0]).toLowerCase();
      if (!this.statesNames.includes(possibleCityName)) return splittedLocation[0];
    }

    return 'Desconhecido';
  }

  private findJobContractTypes(job: LinkedInJob): ContractTypes[] {
    const matchedContractTypes = matchContractTypes({ title: job.title, description: job.description });

    if (matchedContractTypes.length == 0 && job.employment_type) {
      matchedContractTypes.push(linkedInEmploymentTypesMap[job.employment_type] || ContractTypes.unknown);
      return matchedContractTypes;
    }

    return matchedContractTypes;
  }

  private findExperienceLevels(job: LinkedInJob): ExperienceLevels[] {
    return matchExperienceLevel({ title: job.title, description: job.description });
  }

  private findJobKeywords(job: LinkedInJob): string[] {
    return matchKeywords({ title: job.title, description: job.description });
  }

  private findEducationalData(job: LinkedInJob): EducationalData {
    return matchEducationalTerms(job.description);
  }

  private findJobLanguages(job: LinkedInJob): string[] {
    return matchLanguages(job.description);
  }

  //TODO: Move this function to a utils module
  private removeAccents(string: string) {
    //TODO: Understand how it works
    return string.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }
}
