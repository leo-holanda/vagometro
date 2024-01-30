import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, map } from 'rxjs';
import { StatisticsService } from '../statistics.service';
import { JobService } from 'src/app/job/job.service';
import { TimeWindows } from 'src/app/job/job.types';
import { RouterModule } from '@angular/router';
import { ComparisonData } from '../ranks/months-rank/months-rank.types';

@Component({
  selector: 'vgm-job-count',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './job-count.component.html',
  styleUrls: ['./job-count.component.scss'],
})
export class JobCountComponent {
  jobsCount$: Observable<number>;
  oldestJobPublishedDate$: Observable<Date | undefined>;

  currentTimeWindow$!: Observable<TimeWindows>;
  timeWindows = TimeWindows;

  lastMonthDifference$: Observable<ComparisonData>;
  lastYearDifference$: Observable<ComparisonData>;

  constructor(
    private statisticsService: StatisticsService,
    private jobService: JobService
  ) {
    this.currentTimeWindow$ = this.jobService.currentTimeWindow$;
    this.jobsCount$ = this.statisticsService.getJobsCount();
    this.oldestJobPublishedDate$ = this.jobService.oldestJobPublishedDate$;

    this.lastMonthDifference$ = this.statisticsService
      .getMonthlyComparison()
      .pipe(map((monthlyData) => monthlyData[0]));
    this.lastYearDifference$ = this.statisticsService
      .getAnnualComparison()
      .pipe(map((annualData) => annualData[0]));
  }
}
