import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RankData, RankTypes } from '../../rank/rank.types';
import { Observable } from 'rxjs';
import { JobService } from 'src/app/job/job.service';
import { Job } from 'src/app/job/job.types';
import { trackByRankData } from 'src/app/shared/track-by-functions';
import { StatisticsService } from '../../statistics.service';
import { PublicationChartComponent } from '../../charts/publication-chart/publication-chart.component';
import { JobPostingsComparisonComponent } from '../../comparisons/job-postings-comparison/job-postings-comparison.component';
import { MatchesChartComponent } from '../../charts/matches-chart/matches-chart.component';
import { RankComponent } from '../../rank/rank.component';
import { JobListComponent } from 'src/app/job/job-list/job-list.component';

@Component({
  selector: 'vgm-repostings-overview',
  standalone: true,
  imports: [
    CommonModule,
    PublicationChartComponent,
    JobPostingsComparisonComponent,
    MatchesChartComponent,
    RankComponent,
    JobListComponent,
  ],
  templateUrl: './repostings-overview.component.html',
  styleUrls: ['./repostings-overview.component.scss'],
})
export class RepostingsOverviewComponent implements OnInit {
  repostingsRank$!: Observable<RankData[]>;
  jobsQuantity!: number;
  selectedRepostingCount!: number;
  jobsByRepostingCount$!: Observable<Job[]>;

  trackByRankData = trackByRankData;
  rankTypes = RankTypes;

  constructor(
    private statisticsService: StatisticsService,
    private jobService: JobService,
  ) {}

  ngOnInit(): void {
    this.repostingsRank$ = this.statisticsService.getRepostingsRank();

    this.repostingsRank$.subscribe((repostingsRank) => {
      this.selectedRepostingCount = +repostingsRank[0].name;
      this.jobsByRepostingCount$ = this.jobService.getJobsByRepostingCount(
        +this.selectedRepostingCount,
      );
    });

    this.jobService.jobs$.subscribe((jobs) => {
      this.jobsQuantity = jobs?.length || 0;
    });
  }

  onRepostingCountClick(repostingCount: number): void {
    this.selectedRepostingCount = repostingCount;
    this.jobsByRepostingCount$ = this.jobService.getJobsByRepostingCount(
      +this.selectedRepostingCount,
    );
  }
}
