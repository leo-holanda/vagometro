import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { JobService } from 'src/app/job/job.service';
import { Job } from 'src/app/job/job.types';
import { trackByRankData } from 'src/app/shared/track-by-functions';
import { StatisticsService } from '../../statistics.service';
import { PublicationChartComponent } from '../../charts/publication-chart/publication-chart.component';
import { JobListComponent } from 'src/app/job/job-list/job-list.component';
import { JobPostingsComparisonComponent } from '../../comparisons/job-postings-comparison/job-postings-comparison.component';
import { RankComponent } from '../../ranks/rank/rank.component';
import { RankData, RankTypes } from '../../ranks/rank/rank.types';

@Component({
  selector: 'vgm-months-overview',
  standalone: true,
  imports: [
    CommonModule,
    PublicationChartComponent,
    JobListComponent,
    JobPostingsComparisonComponent,
    RankComponent,
  ],
  templateUrl: './months-overview.component.html',
  styleUrls: ['./months-overview.component.scss'],
})
export class MonthsOverviewComponent {
  monthsRank$!: Observable<RankData[]>;
  jobsQuantity!: number;
  selectedMonth!: string;
  jobsByMonth$!: Observable<Job[]>;

  trackByRankData = trackByRankData;
  rankTypes = RankTypes;

  constructor(
    private statisticsService: StatisticsService,
    private jobService: JobService,
  ) {
    this.monthsRank$ = this.statisticsService.getMonthsRank();

    this.monthsRank$.subscribe((monthsRank) => {
      this.selectedMonth = monthsRank[0].name;
      this.jobsByMonth$ = this.jobService.getJobsByMonth(this.selectedMonth);
    });

    this.jobService.jobs$.subscribe((jobs) => {
      this.jobsQuantity = jobs?.length || 0;
    });
  }

  onMonthClick(month: string): void {
    this.selectedMonth = month;
    this.jobsByMonth$ = this.jobService.getJobsByMonth(this.selectedMonth);
  }
}
