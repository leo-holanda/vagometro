import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, filter, map } from 'rxjs';
import { DisabilityStatuses } from '../statistics/ranks/disability-rank/disability-rank.model';
import { ExperienceLevels } from '../statistics/ranks/experience-levels-rank/experience-levels-rank.model';
import { Job, TimeWindows, WorkplaceTypes, monthsMap } from './job.types';

@Injectable({
  providedIn: 'root',
})
export class JobService {
  private pristineJobs: Job[] = [];
  private _jobs$ = new BehaviorSubject<Job[] | undefined>(undefined);
  jobs$ = this._jobs$.asObservable();

  private _currentTimeWindow$ = new BehaviorSubject<TimeWindows>(
    TimeWindows.all
  );
  currentTimeWindow$ = this._currentTimeWindow$.asObservable();

  private _oldestJobPublishedDate$ = new BehaviorSubject<Date | undefined>(
    undefined
  );
  oldestJobPublishedDate$ = this._oldestJobPublishedDate$.asObservable();

  constructor() {}

  setPristineJobs(jobs: Job[]): void {
    this.pristineJobs = jobs;
  }

  setJobs(jobs: Job[]): void {
    this._jobs$.next(jobs);
    const oldestDate = this.findOldestJobDate(jobs);
    this._oldestJobPublishedDate$.next(oldestDate);
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
        return jobs.filter((job) =>
          job.workplaceTypes.includes(workplace as WorkplaceTypes)
        );
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
        return jobs.filter((job) =>
          job.experienceLevels.includes(experienceLevel)
        );
      })
    );
  }

  filterJobsByTime(timeWindow: TimeWindows): void {
    this._currentTimeWindow$.next(timeWindow);
    let jobs = [...this.pristineJobs];
    if (jobs.length > 0) {
      const minDate = this.createDateByTimeWindow(timeWindow);
      const filteredJobs = jobs.filter((job) => job.publishedDate >= minDate);
      this._jobs$.next(filteredJobs);
      const oldestDate = this.findOldestJobDate(filteredJobs);
      this._oldestJobPublishedDate$.next(oldestDate);
    }
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
        minDate = this.findOldestJobDate(this.pristineJobs);
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
        return jobs.filter((job) => job.disabilityStatus == disabilityStatus);
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

  getJobsByMonth(month: string): Observable<Job[]> {
    return this.jobs$.pipe(
      filter((jobs): jobs is Job[] => jobs != undefined),
      map((jobs) => {
        return jobs.filter((job) => this.getJobMonth(job) == month);
      })
    );
  }

  getJobMonth(job: Job): string {
    return monthsMap[job.publishedDate.getMonth()];
  }

  getJobYear(job: Job): string {
    return job.publishedDate.getFullYear().toString();
  }

  getJobMonthAndYear(job: Job): string {
    return `${this.getJobMonth(job)}/${this.getJobYear(job)}`;
  }

  private findOldestJobDate(jobs: Job[]): Date {
    let oldestDate = new Date();

    jobs.forEach((job) => {
      if (job.publishedDate < oldestDate) oldestDate = job.publishedDate;
    });

    // Deep cloning the oldest date is necessary to prevent the reference being used further.
    // Removing this deep clone will bring back the annoying monthly difference bug
    return new Date(oldestDate.getTime());
  }
}
