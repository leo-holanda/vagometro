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
      map((series) => this.splitInWeeks(series)),
      map(this.mapToWeeklyMovingAverageSeries),
    );
  }

  getMonthlyMovingAverage(
    jobs$: Observable<Job[] | undefined> = this.jobService.jobs$,
  ): Observable<ShortTermSeriesData[]> {
    return this.getDailyPostingsSeries(jobs$).pipe(
      map((series) => this.splitByMonthLastDate(series)),
      map(this.mapToMonthlyMovingAverageSeries),
    );
  }

  //TODO: Implement tthe split by half year
  getHalfYearlyMovingAverage(
    jobs$: Observable<Job[] | undefined> = this.jobService.jobs$,
  ): Observable<ShortTermSeriesData[]> {
    return this.getDailyPostingsSeries(jobs$).pipe(
      map((series) => this.splitInGroups(series, 182)),
      map(this.mapToWeeklyMovingAverageSeries),
    );
  }

  getYearlyMovingAverage(
    jobs$: Observable<Job[] | undefined> = this.jobService.jobs$,
  ): Observable<ShortTermSeriesData[]> {
    return this.getDailyPostingsSeries(jobs$).pipe(
      map((series) => this.splitByYearLastDate(series)),
      map(this.mapToYearlyMovingAverageSeries),
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

  private splitInWeeks(series: ShortTermSeriesData[]): ShortTermSeriesData[][] {
    const firstDataEntryDate = new Date(series[0].value[0].getTime());
    const dayOfWeek = firstDataEntryDate.getDay();
    const differenceFromWeekFirstDay = 7 - dayOfWeek;
    const howManyDaysToSlice = differenceFromWeekFirstDay + 1;

    const weeks: ShortTermSeriesData[][] = [];
    if (howManyDaysToSlice > 0) weeks.push([{ value: [firstDataEntryDate, 0] }]);

    weeks.push(series.slice(0, howManyDaysToSlice));

    for (let i = howManyDaysToSlice; i < series.length; i += 7) {
      weeks.push(series.slice(i, i + 7));
    }

    return weeks;
  }

  private splitByMonthLastDate(series: ShortTermSeriesData[]): ShortTermSeriesData[] {
    const monthsMap = new Map<number, number>();

    series.forEach((singleSeries) => {
      const seriesDate = new Date(singleSeries.value[0]);
      seriesDate.setMonth(seriesDate.getMonth() + 1);
      seriesDate.setDate(0);

      const currentMonthCount = monthsMap.get(seriesDate.getTime()) || 0;
      monthsMap.set(seriesDate.getTime(), currentMonthCount + singleSeries.value[1]);
    });

    const seriesByMonthLastDate = Array.from(monthsMap.entries()).map(
      (monthsMapEntry): ShortTermSeriesData => {
        return {
          value: [new Date(monthsMapEntry[0]), monthsMapEntry[1]],
        };
      },
    );

    const seriesDate = new Date(series[0].value[0]);
    const lastDateOfFirstMonthInSeries = seriesByMonthLastDate[0].value[0];
    if (seriesDate != lastDateOfFirstMonthInSeries)
      seriesByMonthLastDate.unshift({
        value: [seriesDate, 0],
      });

    return seriesByMonthLastDate;
  }

  private splitByYearLastDate(series: ShortTermSeriesData[]): ShortTermSeriesData[] {
    const yearsMap = new Map<number, number>();

    series.forEach((singleSeries) => {
      const seriesDate = new Date(singleSeries.value[0]);
      seriesDate.setMonth(11);
      seriesDate.setDate(31);

      const currentYearCount = yearsMap.get(seriesDate.getTime()) || 0;
      yearsMap.set(seriesDate.getTime(), currentYearCount + singleSeries.value[1]);
    });

    const seriesByYearLastDate = Array.from(yearsMap.entries()).map(
      (yearsMapEntry): ShortTermSeriesData => {
        return {
          value: [new Date(yearsMapEntry[0]), yearsMapEntry[1]],
        };
      },
    );

    const seriesDate = new Date(series[0].value[0]);
    const lastDateOfFirstMonthInSeries = seriesByYearLastDate[0].value[0];
    if (seriesDate != lastDateOfFirstMonthInSeries)
      seriesByYearLastDate.unshift({
        value: [seriesDate, 0],
      });

    return seriesByYearLastDate;
  }

  private splitInGroups(series: ShortTermSeriesData[], groupSize: number): ShortTermSeriesData[][] {
    const result = [];

    for (let i = 0; i < series.length; i += groupSize) {
      result.push(series.slice(i, i + groupSize));
    }

    return result;
  }

  private getPostingsMovingAverage(postings: ShortTermSeriesData[]): ShortTermSeriesData {
    const weekEndDate = postings[postings.length - 1].value[0];
    const totalJobsPublished = postings.reduce((acc, item) => acc + item.value[1], 0);

    return {
      value: [weekEndDate, +(totalJobsPublished / postings.length).toFixed(2)],
    };
  }

  private mapToWeeklyMovingAverageSeries = (
    postingsInGroups: ShortTermSeriesData[][],
  ): ShortTermSeriesData[] => {
    const movingAverageSeries = postingsInGroups.map((postingsGroup) => {
      return this.getPostingsMovingAverage(postingsGroup);
    });

    return movingAverageSeries;
  };

  private mapToMonthlyMovingAverageSeries = (
    postingsByMonthLastDate: ShortTermSeriesData[],
  ): ShortTermSeriesData[] => {
    return postingsByMonthLastDate.map((postings) => {
      const postingsCount = postings.value[1];
      const totalDaysInMonth = postings.value[0].getDate();
      return {
        value: [postings.value[0], +(postingsCount / totalDaysInMonth).toFixed(2)],
      };
    });
  };

  private daysInYear(year: number) {
    const feb29 = new Date(year, 1, 29);
    return feb29.getMonth() === 1 ? 366 : 365;
  }

  private mapToYearlyMovingAverageSeries = (
    postingsByMonthLastDate: ShortTermSeriesData[],
  ): ShortTermSeriesData[] => {
    return postingsByMonthLastDate.map((postings) => {
      const postingsCount = postings.value[1];
      const totalDaysInMonth = this.daysInYear(postings.value[0].getFullYear());
      return {
        value: [postings.value[0], +(postingsCount / totalDaysInMonth).toFixed(2)],
      };
    });
  };
}
