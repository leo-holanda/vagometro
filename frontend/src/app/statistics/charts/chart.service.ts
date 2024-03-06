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
  MatchData,
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

  getMatchesData(
    jobs$: Observable<Job[] | undefined> = this.jobService.jobs$,
  ): Observable<MatchData[]> {
    return jobs$.pipe(
      filter((jobs): jobs is Job[] => jobs != undefined),
      map(this.getAccumulatedMatchLevels),
      map(this.mapToMatchesData),
    );
  }

  getWeeklyMovingAverage(
    jobs$: Observable<Job[] | undefined> = this.jobService.jobs$,
  ): Observable<ShortTermSeriesData[]> {
    return this.getDailyPostingsSeries(jobs$).pipe(
      map((series) => this.splitInGroups(series, 7)),
      map(this.mapToMovingAverageSeries),
    );
  }

  getMonthlyMovingAverage(
    jobs$: Observable<Job[] | undefined> = this.jobService.jobs$,
  ): Observable<ShortTermSeriesData[]> {
    return this.getDailyPostingsSeries(jobs$).pipe(
      map((series) => this.splitInGroups(series, 30)),
      map(this.mapToMovingAverageSeries),
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

  private getAccumulatedMatchLevels(jobs: Job[]): Map<string, number> {
    const matchesMap = new Map<string, number>();

    jobs.forEach((job) => {
      if (job.matchPercentage == undefined) return;
      const matchPercentage = job.matchPercentage.toFixed(0).toString() + '%';
      const currentPercentageCount = matchesMap.get(matchPercentage) || 0;
      matchesMap.set(matchPercentage, currentPercentageCount + 1);
    });

    return matchesMap;
  }

  private getPercentageValueFromMatchData(matchData: [string, number]): number {
    return +matchData[0].slice(0, -1);
  }

  private getMatchDataBarColor(matchData: [string, number]): string {
    const percentageValue = this.getPercentageValueFromMatchData(matchData);
    //TODO: Use colors from theme
    if (percentageValue >= 30 && percentageValue < 60) return '#F8BE29';
    if (percentageValue >= 60 && percentageValue < 90) return '#66D0B9';
    if (percentageValue >= 90) return '#58AB6F';
    return '#E94C5C';
  }

  private mapToMatchesData = (matchesMap: Map<string, number>): MatchData[] => {
    const mapEntries = Array.from(matchesMap.entries());

    return mapEntries
      .sort((a, b) =>
        this.getPercentageValueFromMatchData(a) > this.getPercentageValueFromMatchData(b) ? 1 : -1,
      )
      .map((entry) => {
        return {
          value: entry,
          itemStyle: {
            color: this.getMatchDataBarColor(entry),
          },
        };
      });
  };

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

  private splitInGroups(series: ShortTermSeriesData[], groupSize: number): ShortTermSeriesData[][] {
    const result = [];

    for (let i = 0; i < series.length; i += groupSize) {
      result.push(series.slice(i, i + groupSize));
    }

    return result;
  }

  private getMovingAverage(postings: ShortTermSeriesData[]): ShortTermSeriesData {
    const startDate = postings[0].value[0];
    const totalJobsPublished = postings.reduce((acc, item) => acc + item.value[1], 0);

    return {
      value: [startDate, +(totalJobsPublished / postings.length).toFixed(2)],
    };
  }

  private mapToMovingAverageSeries = (
    postingsInGroups: ShortTermSeriesData[][],
  ): ShortTermSeriesData[] => {
    const movingAverageSeries = postingsInGroups.map((postingsGroup) => {
      return this.getMovingAverage(postingsGroup);
    });

    const lastGroup = postingsInGroups[postingsInGroups.length - 1];
    if (lastGroup.length == 1) return movingAverageSeries;

    const lastDayFromLastGroup = [lastGroup[lastGroup.length - 1]];
    movingAverageSeries.push(this.getMovingAverage(lastDayFromLastGroup));

    return movingAverageSeries;
  };
}
