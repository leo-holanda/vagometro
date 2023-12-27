import { Injectable } from '@angular/core';
import { JobService } from '../job/job.service';
import { Observable, map } from 'rxjs';
import { CityData } from './cities-rank/cities-rank.model';

@Injectable({
  providedIn: 'root',
})
export class StatisticsService {
  constructor(private jobService: JobService) {}

  getCitiesRank(): Observable<CityData[]> {
    return this.jobService.jobs$.pipe(
      map((jobs) => {
        const citiesMap = new Map<string, number>();

        jobs.forEach((job) => {
          if (job.city == '') return;
          const currentCityCount = citiesMap.get(job.city) || 0;
          citiesMap.set(job.city, currentCityCount + 1);
        });

        const sortedEntries = Array.from(citiesMap.entries()).sort(
          (a, b) => b[1] - a[1]
        );

        const sortedObjects = sortedEntries.map(([key, value]) => ({
          name: key,
          count: value,
        }));

        return sortedObjects;
      })
    );
  }

  getJobsPublishedInCurrentMonthCount(): Observable<number> {
    const today = new Date();

    return this.jobService.jobs$.pipe(
      map((jobs) => {
        return jobs.filter((job) => {
          const jobPublishedDate = new Date(job.publishedDate);
          return this.haveSameMonth(jobPublishedDate, today);
        });
      }),
      map((jobs) => jobs.length)
    );
  }

  private haveSameMonth(date1: Date, date2: Date) {
    const month1 = date1.getMonth();
    const year1 = date1.getFullYear();

    const month2 = date2.getMonth();
    const year2 = date2.getFullYear();

    return month1 === month2 && year1 === year2;
  }
}
