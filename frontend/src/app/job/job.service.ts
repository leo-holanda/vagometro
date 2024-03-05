import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, filter, map } from 'rxjs';
import { InclusionTypes } from '../shared/keywords-matcher/inclusion.data';
import { ContractTypes } from '../shared/keywords-matcher/contract-types.data';
import { WorkplaceTypes } from '../shared/keywords-matcher/workplace.data';
import { Job, TimeWindows, monthsMap } from './job.types';
import { ExperienceLevels } from '../shared/keywords-matcher/experience-levels.data';
import { CertificationStatus } from '../shared/keywords-matcher/certification.data';
@Injectable({
  providedIn: 'root',
})
export class JobService {
  private pristineJobs: Job[] = [];
  private _jobs$ = new BehaviorSubject<Job[] | undefined>(undefined);
  jobs$ = this._jobs$.asObservable();

  private _currentTimeWindow$ = new BehaviorSubject<TimeWindows>(TimeWindows.all);
  currentTimeWindow$ = this._currentTimeWindow$.asObservable();

  private _oldestJobPublishedDate$ = new BehaviorSubject<Date | undefined>(undefined);
  oldestJobPublishedDate$ = this._oldestJobPublishedDate$.asObservable();

  setJobs(jobs: Job[] | undefined): void {
    if (jobs) {
      this.pristineJobs = [...jobs];
      this._jobs$.next(jobs);
      const oldestDate = this.findOldestJobDate(jobs);
      this._oldestJobPublishedDate$.next(oldestDate);
    }
  }

  getJobsByState(state: string): Observable<Job[]> {
    return this.jobs$.pipe(
      filter((jobs): jobs is Job[] => jobs != undefined),
      map((jobs) => {
        return jobs.filter((job) => job.state == state);
      }),
    );
  }

  getJobsByCity(city: string): Observable<Job[]> {
    return this.jobs$.pipe(
      filter((jobs): jobs is Job[] => jobs != undefined),
      map((jobs) => {
        return jobs.filter((job) => job.city == city);
      }),
    );
  }

  getJobsByWorkplace(workplace: string): Observable<Job[]> {
    return this.jobs$.pipe(
      filter((jobs): jobs is Job[] => jobs != undefined),
      map((jobs) => {
        return jobs.filter((job) => job.workplaceTypes.includes(workplace as WorkplaceTypes));
      }),
    );
  }

  getJobsByKeyword(keywordName: string): Observable<Job[]> {
    return this.jobs$.pipe(
      filter((jobs): jobs is Job[] => jobs != undefined),
      map((jobs) => {
        return jobs.filter((job) => job.keywords.find((keyword) => keyword.name == keywordName));
      }),
    );
  }

  filterJobsByKeywords(keywordsName: string[], jobs: Job[]): Job[] {
    return jobs.filter((job) =>
      job.keywords.find((keyword) => keywordsName.includes(keyword.name)),
    );
  }

  getJobsByCompany(companyName: string): Observable<Job[]> {
    return this.jobs$.pipe(
      filter((jobs): jobs is Job[] => jobs != undefined),
      map((jobs) => {
        return jobs.filter((job) => job.companyName == companyName);
      }),
    );
  }

  getJobsByContractType(contracType: ContractTypes): Observable<Job[]> {
    return this.jobs$.pipe(
      filter((jobs): jobs is Job[] => jobs != undefined),
      map((jobs) => {
        return jobs.filter((job) => job.contractTypes.includes(contracType));
      }),
    );
  }

  getJobsByExperienceLevel(experienceLevel: ExperienceLevels): Observable<Job[]> {
    return this.jobs$.pipe(
      filter((jobs): jobs is Job[] => jobs != undefined),
      map((jobs) => {
        return jobs.filter((job) => job.experienceLevels.includes(experienceLevel));
      }),
    );
  }

  filterJobsByTime(timeWindow: TimeWindows): void {
    this._currentTimeWindow$.next(timeWindow);
    const jobs = [...this.pristineJobs];
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
      case TimeWindows.yesterday:
        minDate.setDate(today.getDate() - 1);
        break;

      case TimeWindows.today:
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

    minDate.setHours(0);
    minDate.setMinutes(0);
    minDate.setSeconds(0);
    minDate.setMilliseconds(0);

    return minDate;
  }

  getJobsByInclusionType(inclusionType: InclusionTypes): Observable<Job[]> {
    return this.jobs$.pipe(
      filter((jobs): jobs is Job[] => jobs != undefined),
      map((jobs) => {
        return jobs.filter((job) => job.inclusionTypes.includes(inclusionType));
      }),
    );
  }

  getJobsByEducationTerms(educationTerm: string): Observable<Job[]> {
    return this.jobs$.pipe(
      filter((jobs): jobs is Job[] => jobs != undefined),
      map((jobs) => {
        return jobs.filter((job) => job.educationTerms.includes(educationTerm));
      }),
    );
  }

  getJobsByEducationalLevelTerms(educationalLevelTerm: string): Observable<Job[]> {
    return this.jobs$.pipe(
      filter((jobs): jobs is Job[] => jobs != undefined),
      map((jobs) => {
        return jobs.filter((job) => job.educationalLevelTerms.includes(educationalLevelTerm));
      }),
    );
  }

  getJobsByLanguage(language: string): Observable<Job[]> {
    return this.jobs$.pipe(
      filter((jobs): jobs is Job[] => jobs != undefined),
      map((jobs) => {
        if (language == 'Desconhecido') return jobs.filter((job) => job.languages.length == 0);
        return jobs.filter((job) => job.languages.includes(language));
      }),
    );
  }

  getJobsByMonth(month: string): Observable<Job[]> {
    return this.jobs$.pipe(
      filter((jobs): jobs is Job[] => jobs != undefined),
      map((jobs) => {
        return jobs.filter((job) => this.getJobMonth(job) == month);
      }),
    );
  }

  getJobsByCertificationStatus(certificationStatus: CertificationStatus): Observable<Job[]> {
    return this.jobs$.pipe(
      filter((jobs): jobs is Job[] => jobs != undefined),
      map((jobs) => {
        return jobs.filter((job) => job.certificationStatuses.includes(certificationStatus));
      }),
    );
  }

  getJobsByRepostingCount(repostingCount: number): Observable<Job[]> {
    return this.jobs$.pipe(
      filter((jobs): jobs is Job[] => jobs != undefined),
      map((jobs) => {
        return jobs.filter((job) => job.repostings.length == repostingCount);
      }),
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
    oldestDate.setHours(0);
    oldestDate.setMinutes(0);
    oldestDate.setSeconds(0);
    oldestDate.setMilliseconds(0);

    jobs.forEach((job) => {
      if (job.publishedDate < oldestDate) oldestDate = job.publishedDate;
    });

    // Deep cloning the oldest date is necessary to prevent the reference being used further.
    // Removing this deep clone will bring back the annoying monthly difference bug
    return new Date(oldestDate.getTime());
  }
}
