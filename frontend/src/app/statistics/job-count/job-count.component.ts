import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, Observable, Subject, map, switchMap, takeUntil } from 'rxjs';
import { StatisticsService } from '../statistics.service';
import { JobService } from 'src/app/job/job.service';
import { TimeWindows } from 'src/app/job/job.types';
import { RouterModule } from '@angular/router';
import { ChartService } from '../charts/chart.service';
import {
  MovingAverageTypes,
  ShortTermSeriesData,
} from '../charts/publication-chart/publication-chart.model';
import { MovingAverageStatData, TrendStatuses } from './job-count.types';
import { SimpleLinearRegression } from 'ml-regression-simple-linear';

@Component({
  selector: 'vgm-job-count',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './job-count.component.html',
  styleUrls: ['./job-count.component.scss'],
})
export class JobCountComponent implements OnInit, OnDestroy {
  jobsCount$!: Observable<number>;
  oldestJobPublishedDate$!: Observable<Date | undefined>;

  currentTimeWindow$!: Observable<TimeWindows>;
  timeWindows = TimeWindows;

  movingAverageTypes = MovingAverageTypes;
  selectedMovingAverageType$ = new BehaviorSubject<MovingAverageTypes>(MovingAverageTypes.oneMonth);
  selectedMovingAverageData$!: Observable<MovingAverageStatData>;

  trendStatus$!: Observable<TrendStatuses>;
  trendStatuses = TrendStatuses;

  shouldShowMovingAverageComparison = true;

  private destroy$ = new Subject<void>();

  constructor(
    private statisticsService: StatisticsService,
    private jobService: JobService,
    private chartService: ChartService,
  ) {}

  ngOnInit(): void {
    this.currentTimeWindow$ = this.jobService.currentTimeWindow$;
    this.jobsCount$ = this.statisticsService.getJobsCount();
    this.oldestJobPublishedDate$ = this.jobService.oldestJobPublishedDate$;

    const movingAverageData = this.selectedMovingAverageType$.pipe(
      takeUntil(this.destroy$),
      switchMap(this.getMovingAverageSource),
    );

    movingAverageData.subscribe((movingAverageData) => {
      this.shouldShowMovingAverageComparison = movingAverageData.length > 2;
    });

    this.selectedMovingAverageData$ = movingAverageData.pipe(
      map((movingAverageData) => {
        const currentMovingAverage = movingAverageData.at(-1)?.value[1] || 0;
        const previousMovingAverage = movingAverageData.at(-2)?.value[1] || 0;

        const differenceBetweenMovingAverages =
          (currentMovingAverage - previousMovingAverage) / (previousMovingAverage || 1);

        return {
          value: currentMovingAverage,
          comparedValue: differenceBetweenMovingAverages,
        };
      }),
    );

    this.trendStatus$ = this.chartService.getDailyPostingsSeries().pipe(
      map((dailyPostings) => {
        const x: number[] = [];
        const y: number[] = [];

        dailyPostings.forEach((postingsPerDay) => {
          x.push(postingsPerDay.value[0].getTime());
          y.push(postingsPerDay.value[1]); //How many jobs were posted
        });

        const results = new SimpleLinearRegression(x, y);

        //TODO: Find a more robust way to define the percentage threshold for significant change
        //      Now it's 10% for everyone. It doesn't consider each data set dynamically
        const percentageThreshold = 10;

        const daysRange = Math.max(...x) - Math.min(...x);
        const postingsAverage = y.reduce((a, b) => a + b, 0) / y.length;

        const totalChange = results.slope * daysRange;
        const percentageChange = Math.abs((totalChange / postingsAverage) * 100);

        if (percentageChange < percentageThreshold) return TrendStatuses.STABLE;
        if (results.slope > 0) return TrendStatuses.INCREASING;
        return TrendStatuses.DECREASING;
      }),
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  setMovingAverageType(movingAverageType: MovingAverageTypes): void {
    this.selectedMovingAverageType$.next(movingAverageType);
  }

  private getMovingAverageSource = (
    movingAverageType: MovingAverageTypes,
  ): Observable<ShortTermSeriesData[]> => {
    let movingAverageSource$ = this.chartService.getWeeklyMovingAverage();

    if (movingAverageType == MovingAverageTypes.oneMonth)
      movingAverageSource$ = this.chartService.getMonthlyMovingAverage();
    else if (movingAverageType == MovingAverageTypes.oneYear)
      movingAverageSource$ = this.chartService.getYearlyMovingAverage();

    return movingAverageSource$;
  };
}
