import { Injectable } from '@angular/core';
import { Observable, combineLatest, filter, map } from 'rxjs';
import { JobService } from 'src/app/job/job.service';
import { Job, TimeWindows, monthsMap } from 'src/app/job/job.types';
import { AnnualPostingsSeries, MonthlyPostingsSeries, DailyPostingsSeries } from './publication-chart/publication-chart.model';

@Injectable({
  providedIn: 'root',
})
export class ChartService {
  constructor(private jobService: JobService) {}

  getDailyPostingsSeries(jobs$: Observable<Job[] | undefined> = this.jobService.jobs$): Observable<DailyPostingsSeries> {
    return combineLatest([jobs$, this.jobService.currentTimeWindow$]).pipe(
      filter((params): params is [Job[], TimeWindows] => params[0] != undefined),
      map(([jobs, currentTimeWindow]) => {
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

        const mapEntries = Array.from(publicationMap.entries())
          .map((entries): [Date, number] => {
            return [new Date(entries[0]), entries[1]];
          })
          .sort((a, b) => {
            return a[0].getTime() - b[0].getTime();
          });

        return mapEntries;
      }),
    );
  }

  getMonthlyPostingsSeries(jobs$: Observable<Job[] | undefined> = this.jobService.jobs$): Observable<MonthlyPostingsSeries> {
    return combineLatest([jobs$, this.jobService.currentTimeWindow$]).pipe(
      filter((params): params is [Job[], TimeWindows] => params[0] != undefined),
      map(([jobs, currentTimeWindow]) => {
        const minDate = this.jobService.createDateByTimeWindow(currentTimeWindow);
        /* 
          Without setting the date to the first day
          it's possible that a jump occurs between one month and another
          which can result in a infinite loop below
        */
        minDate.setDate(0);

        const postingsMap = new Map<string, number>();
        postingsMap.set(this.getDateMonthAndYear(minDate), 0);

        const today = new Date();
        today.setDate(0);

        while (this.getDateMonthAndYear(minDate) != this.getDateMonthAndYear(today)) {
          minDate.setMonth(minDate.getMonth() + 1);
          postingsMap.set(this.getDateMonthAndYear(minDate), 0);
        }

        jobs.forEach((job) => {
          const jobPostingMonth = this.jobService.getJobMonthAndYear(job);
          const currentDateCount = postingsMap.get(jobPostingMonth) || 0;
          postingsMap.set(jobPostingMonth, currentDateCount + 1);
        });

        const mapEntries = Array.from(postingsMap.entries());

        return mapEntries;
      }),
    );
  }

  getAnnualPostingsSeries(jobs$: Observable<Job[] | undefined> = this.jobService.jobs$): Observable<AnnualPostingsSeries> {
    return combineLatest([jobs$, this.jobService.currentTimeWindow$]).pipe(
      filter((params): params is [Job[], TimeWindows] => params[0] != undefined),
      map(([jobs, currentTimeWindow]) => {
        const minDate = this.jobService.createDateByTimeWindow(currentTimeWindow);
        //Same thing as the comment above
        minDate.setDate(0);
        minDate.setMonth(0);

        const postingsMap = new Map<string, number>();
        postingsMap.set(this.getDateYear(minDate), 0);

        const today = new Date();
        today.setDate(0);
        today.setMonth(0);

        while (this.getDateYear(minDate) != this.getDateYear(today)) {
          minDate.setFullYear(minDate.getFullYear() + 1);
          postingsMap.set(this.getDateYear(minDate), 0);
        }

        jobs.forEach((job) => {
          const jobPostingYear = this.jobService.getJobYear(job);
          const currentDateCount = postingsMap.get(jobPostingYear) || 0;
          postingsMap.set(jobPostingYear, currentDateCount + 1);
        });

        const mapEntries = Array.from(postingsMap.entries());

        return mapEntries;
      }),
    );
  }

  private getDateMonthAndYear(date: Date): string {
    const month = monthsMap[date.getMonth()];
    const year = date.getFullYear().toString();
    return `${month}/${year}`;
  }

  private getDateYear(date: Date): string {
    return date.getFullYear().toString();
  }
}
