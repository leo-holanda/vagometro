import { Injectable } from '@angular/core';
import { Observable, combineLatest, filter, map } from 'rxjs';
import { JobService } from 'src/app/job/job.service';
import { Job, TimeWindows, monthsMap } from 'src/app/job/job.types';
import {
  AnnualPostingsSeries,
  MonthlyPostingsSeries,
  DailyPostingsSeries,
  ShortTermSeriesData,
  LongTermSeriesData,
} from './publication-chart/publication-chart.model';

@Injectable({
  providedIn: 'root',
})
export class ChartService {
  constructor(private jobService: JobService) {}

  getDailyPostingsSeries(
    jobs$: Observable<Job[] | undefined> = this.jobService.jobs$,
  ): Observable<DailyPostingsSeries> {
    return combineLatest([jobs$, this.jobService.currentTimeWindow$]).pipe(
      filter(this.isJobsUndefined),
      map(this.getDailyAccumulatedJobPostings),
      map(this.mapToShortTermSeries),
    );
  }

  getMonthlyPostingsSeries(
    jobs$: Observable<Job[] | undefined> = this.jobService.jobs$,
  ): Observable<MonthlyPostingsSeries> {
    return combineLatest([jobs$, this.jobService.currentTimeWindow$]).pipe(
      filter(this.isJobsUndefined),
      map(this.getMonthlyAccumulatedJobPostings),
      map(this.mapToLongTermSeries),
    );
  }

  getAnnualPostingsSeries(
    jobs$: Observable<Job[] | undefined> = this.jobService.jobs$,
  ): Observable<AnnualPostingsSeries> {
    return combineLatest([jobs$, this.jobService.currentTimeWindow$]).pipe(
      filter(this.isJobsUndefined),
      map(this.getAnnualAccumulatedJobPostings),
      map(this.mapToLongTermSeries),
    );
  }

  private isJobsUndefined(
    params: [Job[] | undefined, TimeWindows],
  ): params is [Job[], TimeWindows] {
    return params[0] != undefined;
  }

  private getDateMonthAndYear(date: Date): string {
    const month = monthsMap[date.getMonth()];
    const year = date.getFullYear().toString();
    return `${month}/${year}`;
  }

  private getDateYear(date: Date): string {
    return date.getFullYear().toString();
  }

  private mapToShortTermSeries(postingsMap: Map<string, number>): ShortTermSeriesData[] {
    const mapEntries = Array.from(postingsMap.entries())
      .map((entries): ShortTermSeriesData => {
        return { value: [new Date(entries[0]), entries[1]] };
      })
      .sort((a, b) => {
        return a.value[0].getTime() - b.value[0].getTime();
      });

    return mapEntries;
  }

  private mapToLongTermSeries(postingsMap: Map<string, number>): LongTermSeriesData[] {
    const mapEntries = Array.from(postingsMap.entries()).map((entries): LongTermSeriesData => {
      return { value: [entries[0], entries[1]] };
    });

    return mapEntries;
  }

  private getDailyAccumulatedJobPostings = ([jobs, currentTimeWindow]: [Job[], TimeWindows]): Map<
    string,
    number
  > => {
    const minDate = this.jobService.createDateByTimeWindow(currentTimeWindow);

    const publicationMap = new Map<string, number>();
    publicationMap.set(minDate.toDateString(), 0);

    const today = new Date();
    while (minDate.toDateString() != today.toDateString()) {
      minDate.setDate(minDate.getDate() + 1);
      publicationMap.set(minDate.toDateString(), 0);
    }

    jobs.forEach((job) => {
      const publishedDate = job.publishedDate.toDateString();
      const currentDateCount = publicationMap.get(publishedDate) || 0;
      publicationMap.set(publishedDate, currentDateCount + 1);
    });

    return publicationMap;
  };

  private getMonthlyAccumulatedJobPostings = ([jobs, currentTimeWindow]: [Job[], TimeWindows]): Map<
    string,
    number
  > => {
    const minDate = this.jobService.createDateByTimeWindow(currentTimeWindow);

    const postingsMap = new Map<string, number>();
    postingsMap.set(this.getDateMonthAndYear(minDate), 0);

    const today = new Date();
    today.setDate(1);

    while (this.getDateMonthAndYear(minDate) != this.getDateMonthAndYear(today)) {
      minDate.setMonth(minDate.getMonth() + 1);
      postingsMap.set(this.getDateMonthAndYear(minDate), 0);
    }

    jobs.forEach((job) => {
      const jobPostingMonth = this.jobService.getJobMonthAndYear(job);
      const currentDateCount = postingsMap.get(jobPostingMonth) || 0;
      postingsMap.set(jobPostingMonth, currentDateCount + 1);
    });

    return postingsMap;
  };

  private getAnnualAccumulatedJobPostings = ([jobs, currentTimeWindow]: [Job[], TimeWindows]): Map<
    string,
    number
  > => {
    const minDate = this.jobService.createDateByTimeWindow(currentTimeWindow);

    const postingsMap = new Map<string, number>();
    postingsMap.set(this.getDateYear(minDate), 0);

    const today = new Date();
    today.setDate(1);
    today.setMonth(1);

    while (this.getDateYear(minDate) != this.getDateYear(today)) {
      minDate.setFullYear(minDate.getFullYear() + 1);
      postingsMap.set(this.getDateYear(minDate), 0);
    }

    jobs.forEach((job) => {
      const jobPostingYear = this.jobService.getJobYear(job);
      const currentDateCount = postingsMap.get(jobPostingYear) || 0;
      postingsMap.set(jobPostingYear, currentDateCount + 1);
    });

    return postingsMap;
  };
}
