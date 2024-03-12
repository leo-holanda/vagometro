import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, map } from 'rxjs';
import { StatisticsService } from '../statistics.service';
import { JobService } from 'src/app/job/job.service';
import { TimeWindows } from 'src/app/job/job.types';
import { RouterModule } from '@angular/router';
import { ChartService } from '../charts/chart.service';
import { MovingAverageTypes } from '../charts/publication-chart/publication-chart.model';
import { MovingAverageStatData } from './job-count.types';

@Component({
  selector: 'vgm-job-count',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './job-count.component.html',
  styleUrls: ['./job-count.component.scss'],
})
export class JobCountComponent implements OnInit {
  jobsCount$!: Observable<number>;
  oldestJobPublishedDate$!: Observable<Date | undefined>;

  currentTimeWindow$!: Observable<TimeWindows>;
  timeWindows = TimeWindows;

  movingAverageTypes = MovingAverageTypes;
  selectedMovingAverageType = MovingAverageTypes.oneMonth;

  selectedMovingAverageData$!: Observable<MovingAverageStatData>;

  constructor(
    private statisticsService: StatisticsService,
    private jobService: JobService,
    private chartService: ChartService,
  ) {}

  ngOnInit(): void {
    this.currentTimeWindow$ = this.jobService.currentTimeWindow$;
    this.jobsCount$ = this.statisticsService.getJobsCount();
    this.oldestJobPublishedDate$ = this.jobService.oldestJobPublishedDate$;
    this.setMovingAverageType(MovingAverageTypes.oneMonth);
  }

  setMovingAverageType(movingAverageType: MovingAverageTypes): void {
    this.selectedMovingAverageType = movingAverageType;

    let movingAverageSource$ = this.chartService.getWeeklyMovingAverage();
    if (this.selectedMovingAverageType == MovingAverageTypes.oneMonth)
      movingAverageSource$ = this.chartService.getMonthlyMovingAverage();
    if (this.selectedMovingAverageType == MovingAverageTypes.oneYear)
      movingAverageSource$ = this.chartService.getYearlyMovingAverage();

    this.selectedMovingAverageData$ = movingAverageSource$.pipe(
      map((movingAverageData) => {
        const value = movingAverageData.at(-1)?.value[1] || 0;
        const comparedValue =
          ((movingAverageData.at(-1)?.value[1] || 0) - (movingAverageData.at(-2)?.value[1] || 0)) /
          (movingAverageData.at(-2)?.value[1] || 1);

        return {
          value,
          comparedValue,
        };
      }),
    );
  }
}
