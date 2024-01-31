import { Injectable } from '@angular/core';
import { Observable, combineLatest, filter, map } from 'rxjs';
import { JobService } from 'src/app/job/job.service';
import { Job, TimeWindows } from 'src/app/job/job.types';
import { PublicationSeries } from './publication-chart/publication-chart.model';

@Injectable({
  providedIn: 'root',
})
export class ChartService {
  constructor(private jobService: JobService) {}

  getPublicationSeries(
    jobs$: Observable<Job[] | undefined> = this.jobService.jobs$
  ): Observable<PublicationSeries> {
    return combineLatest([jobs$, this.jobService.currentTimeWindow$]).pipe(
      filter(
        (params): params is [Job[], TimeWindows] =>
          params[0] != undefined && params[0].length > 0
      ),
      map(([jobs, currentTimeWindow]) => {
        let minDate = this.jobService.createDateByTimeWindow(currentTimeWindow);

        const publicationMap = new Map<string, number>();
        publicationMap.set(minDate.toDateString(), 0);

        const yesterdayDate = new Date();
        yesterdayDate.setDate(new Date().getDate() - 1);

        while (minDate.toDateString() != yesterdayDate.toDateString()) {
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
      })
    );
  }
}
