import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { StatisticsService } from '../statistics.service';
import { JobService } from 'src/app/job/job.service';
import { TimeWindows } from 'src/app/job/job.types';
import { RouterModule } from '@angular/router';
import { ChartService } from '../charts/chart.service';

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

  weeklyMovingAverage!: number;
  weeklyMovingAverageComparison!: number;

  monthlyMovingAverage!: number;
  monthlyMovingAverageComparison!: number;

  yearsCount = 0;
  yearlyMovingAverage!: number;
  yearlyMovingAverageComparison!: number;

  constructor(
    private statisticsService: StatisticsService,
    private jobService: JobService,
    private chartService: ChartService,
  ) {}

  ngOnInit(): void {
    this.currentTimeWindow$ = this.jobService.currentTimeWindow$;
    this.jobsCount$ = this.statisticsService.getJobsCount();
    this.oldestJobPublishedDate$ = this.jobService.oldestJobPublishedDate$;

    this.chartService.getWeeklyMovingAverage().subscribe((weeklyMovingAverage) => {
      this.weeklyMovingAverage = weeklyMovingAverage.at(-1)?.value[1] || 0;
      this.weeklyMovingAverageComparison =
        ((weeklyMovingAverage.at(-1)?.value[1] || 0) -
          (weeklyMovingAverage.at(-2)?.value[1] || 0)) /
        (weeklyMovingAverage.at(-2)?.value[1] || 1);
    });

    this.chartService.getMonthlyMovingAverage().subscribe((monthlyMovingAverage) => {
      this.monthlyMovingAverage = monthlyMovingAverage.at(-1)?.value[1] || 0;
      this.monthlyMovingAverageComparison =
        ((monthlyMovingAverage.at(-1)?.value[1] || 0) -
          (monthlyMovingAverage.at(-2)?.value[1] || 0)) /
        (monthlyMovingAverage.at(-2)?.value[1] || 1);
    });

    this.chartService.getYearlyMovingAverage().subscribe((yearlyMovingAverage) => {
      this.yearsCount = yearlyMovingAverage.length;
      this.yearlyMovingAverage = yearlyMovingAverage.at(-1)?.value[1] || 0;
      this.yearlyMovingAverageComparison =
        ((yearlyMovingAverage.at(-1)?.value[1] || 0) -
          (yearlyMovingAverage.at(-2)?.value[1] || 0)) /
        (yearlyMovingAverage.at(-2)?.value[1] || 1);
    });
  }
}
