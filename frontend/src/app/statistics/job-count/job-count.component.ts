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
import { MovingAverageStatData } from './job-count.types';
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

  regressionData$!: Observable<SimpleLinearRegression>;

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
      this.shouldShowMovingAverageComparison = movingAverageData.length > 3;
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

    this.regressionData$ = this.chartService.getDailyPostingsSeries().pipe(
      map((movingAverageData) => {
        const x: number[] = [];
        const y: number[] = [];

        movingAverageData.forEach((movingAverageItem) => {
          x.push(movingAverageItem.value[0].getTime());
          y.push(movingAverageItem.value[1]);
        });

        return new SimpleLinearRegression(x, y);
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
