import { Injectable } from '@angular/core';
import { DynamoService } from '../dynamo/dynamo.service';
import { Job, TimeWindows } from './job.types';
import { BehaviorSubject, Observable, filter, last, map } from 'rxjs';
import { ExperienceLevels } from '../statistics/ranks/experience-levels-rank/experience-levels-rank.model';
import {
  internLevelRelatedTerms,
  internLevelRelatedTypes,
  juniorLevelRelatedTerms,
  juniorLevelRelatedTypes,
  midLevelRelatedTerms,
  seniorLevelRelatedTerms,
  traineeLevelRelatedTerms,
  traineeLevelRelatedTypes,
} from '../statistics/ranks/experience-levels-rank/experience-levels-rank.data';
import { DisabilityStatuses } from '../statistics/ranks/disability-rank/disability-rank.model';
import { keywords } from '../statistics/ranks/keywords-rank/keywords-rank.data';
import {
  educationRelatedTerms,
  educationalLevelTerms,
} from '../statistics/ranks/education-rank/education-rank.data';
import { languageRelatedTerms } from '../statistics/ranks/languages-rank/languages-rank.data';

@Injectable({
  providedIn: 'root',
})
export class JobService {
  private originalJobs: Job[] = [];
  private _jobs$ = new BehaviorSubject<Job[] | undefined>(undefined);
  jobs$ = this._jobs$.asObservable();

  private _currentTimeWindow$ = new BehaviorSubject<TimeWindows>(
    TimeWindows.all
  );
  currentTimeWindow$ = this._currentTimeWindow$.asObservable();

  constructor() {}

  setJobs(jobs: Job[]): void {
    this._jobs$.next(jobs);
  }

  getJobsByState(state: string): Observable<Job[]> {
    return this.jobs$.pipe(
      filter((jobs): jobs is Job[] => jobs != undefined),
      map((jobs) => {
        return jobs.filter((job) => job.state == state);
      })
    );
  }

  getJobsByCity(city: string): Observable<Job[]> {
    return this.jobs$.pipe(
      filter((jobs): jobs is Job[] => jobs != undefined),
      map((jobs) => {
        return jobs.filter((job) => job.city == city);
      })
    );
  }

  getJobsByWorkplace(workplace: string): Observable<Job[]> {
    return this.jobs$.pipe(
      filter((jobs): jobs is Job[] => jobs != undefined),
      map((jobs) => {
        return jobs.filter((job) => job.workplaceType == workplace);
      })
    );
  }

  getJobsByKeyword(keyword: string): Observable<Job[]> {
    return this.jobs$.pipe(
      filter((jobs): jobs is Job[] => jobs != undefined),
      map((jobs) => {
        return jobs.filter((job) => job.keywords.includes(keyword));
      })
    );
  }

  getJobsByCompany(companyName: string): Observable<Job[]> {
    return this.jobs$.pipe(
      filter((jobs): jobs is Job[] => jobs != undefined),
      map((jobs) => {
        return jobs.filter((job) => job.companyName == companyName);
      })
    );
  }

  getJobsByType(typeName: string): Observable<Job[]> {
    return this.jobs$.pipe(
      filter((jobs): jobs is Job[] => jobs != undefined),
      map((jobs) => {
        return jobs.filter((job) => job.contractType == typeName);
      })
    );
  }

  getJobsByExperienceLevel(
    experienceLevel: ExperienceLevels
  ): Observable<Job[]> {
    return this.jobs$.pipe(
      filter((jobs): jobs is Job[] => jobs != undefined),
      map((jobs) => {
        return jobs.filter((job) => job.experienceLevel == experienceLevel);
      })
    );
  }

  filterJobsByTime(timeWindow: TimeWindows): void {
    this._currentTimeWindow$.next(timeWindow);
    let jobs = this.originalJobs;
    const minDate = this.createDateByTimeWindow(timeWindow);
    jobs = jobs.filter((job) => new Date(job.publishedDate) > minDate);
    this._jobs$.next(jobs);
  }

  createDateByTimeWindow(timeWindow: TimeWindows): Date {
    let minDate = new Date();
    const today = new Date();

    switch (timeWindow) {
      case TimeWindows.day:
        minDate.setDate(today.getDate() - 1);
        break;

      case TimeWindows.week:
        minDate.setDate(today.getDate() - 7);
        break;

      case TimeWindows.month:
        minDate.setDate(today.getDate() - 30);
        break;

      case TimeWindows['6months']:
        minDate.setDate(today.getDate() - 180);
        break;

      case TimeWindows.year:
        minDate.setDate(today.getDate() - 365);
        break;

      case TimeWindows.all:
        minDate = new Date('12/19/2023');
        break;
    }

    return minDate;
  }

  getJobsByDisabilityStatus(
    disabilityStatus: DisabilityStatuses
  ): Observable<Job[]> {
    return this.jobs$.pipe(
      filter((jobs): jobs is Job[] => jobs != undefined),
      map((jobs) => {
        const shouldFilterPCD = disabilityStatus == DisabilityStatuses.PCD;
        return jobs.filter((job) => job.isOpenToPCD == shouldFilterPCD);
      })
    );
  }

  getJobsByEducationTerms(educationTerm: string): Observable<Job[]> {
    return this.jobs$.pipe(
      filter((jobs): jobs is Job[] => jobs != undefined),
      map((jobs) => {
        if (educationTerm == 'Desconhecido')
          return jobs.filter((job) => job.educationTerms.length == 0);
        return jobs.filter((job) => job.educationTerms.includes(educationTerm));
      })
    );
  }

  getJobsByEducationalLevelTerms(
    educationalLevelTerm: string
  ): Observable<Job[]> {
    return this.jobs$.pipe(
      filter((jobs): jobs is Job[] => jobs != undefined),
      map((jobs) => {
        if (educationalLevelTerm == 'Desconhecido')
          return jobs.filter((job) => job.educationalLevelTerms.length == 0);
        return jobs.filter((job) =>
          job.educationalLevelTerms.includes(educationalLevelTerm)
        );
      })
    );
  }

  getJobsByLanguage(language: string): Observable<Job[]> {
    return this.jobs$.pipe(
      filter((jobs): jobs is Job[] => jobs != undefined),
      map((jobs) => {
        if (language == 'Desconhecido')
          return jobs.filter((job) => job.languages.length == 0);
        return jobs.filter((job) => job.languages.includes(language));
      })
    );
  }
}
