import { Injectable } from '@angular/core';
import { DynamoService } from '../dynamo/dynamo.service';
import { Job, TimeWindows } from './job.model';
import { BehaviorSubject, Observable, Subject, filter, first, map } from 'rxjs';
import { ExperienceLevels } from '../statistics/ranks/experience-levels-rank/experience-levels-rank.model';
import {
  juniorLevelRelatedTerms,
  juniorLevelRelatedTypes,
  midLevelRelatedTerms,
  seniorLevelRelatedTerms,
} from '../statistics/ranks/experience-levels-rank/experience-levels-rank.data';

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

  constructor(private dynamoService: DynamoService) {
    this.dynamoService
      .scanJobs()
      .pipe(
        first(),
        map((output) => output.Items as Job[])
      )
      .subscribe((jobs) => {
        this.originalJobs = jobs;
        this._jobs$.next(jobs);
      });
  }

  getJobsByState(state: string): Observable<Job[]> {
    return this.jobs$.pipe(
      filter((jobs): jobs is Job[] => jobs != undefined),
      map((jobs) => {
        return jobs.filter((job) => job.state == state);
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
        return jobs.filter((job) => this.jobHasKeyword(job, keyword));
      })
    );
  }

  getJobsByCompany(companyName: string): Observable<Job[]> {
    return this.jobs$.pipe(
      filter((jobs): jobs is Job[] => jobs != undefined),
      map((jobs) => {
        return jobs.filter((job) => job.careerPageName == companyName);
      })
    );
  }

  getJobsByType(typeName: string): Observable<Job[]> {
    return this.jobs$.pipe(
      filter((jobs): jobs is Job[] => jobs != undefined),
      map((jobs) => {
        return jobs.filter((job) => job.type == typeName);
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

  findExperienceLevel(job: Job): ExperienceLevels {
    if (juniorLevelRelatedTypes.includes(job.type))
      return ExperienceLevels.junior;

    const experienceLevelInTitle = this.matchExperienceLevelTerms(job.name);
    if (experienceLevelInTitle) return experienceLevelInTitle;

    const experienceLevelInDescription = this.matchExperienceLevelTerms(
      job.description
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

    const hasJuniorLevelRelatedTerms = juniorLevelRelatedTerms.some((term) =>
      splittedContent.includes(term)
    );
    if (hasJuniorLevelRelatedTerms) return ExperienceLevels.junior;

    const hasMidLevelRelatedTerms = midLevelRelatedTerms.some((term) =>
      splittedContent.includes(term)
    );
    if (hasMidLevelRelatedTerms) return ExperienceLevels.mid;

    const hasSeniorLevelRelatedTerms = seniorLevelRelatedTerms.some((term) =>
      splittedContent.includes(term)
    );
    if (hasSeniorLevelRelatedTerms) return ExperienceLevels.senior;

    return undefined;
  }

  private jobHasKeyword(job: Job, keyword: string): boolean {
    const splittedDescription = job.description.split(' ');
    return splittedDescription.some(
      (substring) =>
        substring.replace(',', '').toLowerCase() == keyword.toLowerCase()
    );
  }
}
