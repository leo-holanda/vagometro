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
import { RepostingsDataTypes } from './repostings-overview.types';

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
  timeBetweenRepostingsRank$!: Observable<RankData[]>;

  jobsCount!: number;
  selectedRepostingCount!: number;
  selectedTimeBetweenReposting!: number;

  jobs$!: Observable<Job[]>;

  selectedDataType = RepostingsDataTypes.repostingsCount;
  repostingsDataTypes = RepostingsDataTypes;

  trackByRankData = trackByRankData;
  rankTypes = RankTypes;

  constructor(
    private statisticsService: StatisticsService,
    private jobService: JobService,
  ) {}

  ngOnInit(): void {
    this.repostingsRank$ = this.statisticsService.getRepostingsRank();
    this.timeBetweenRepostingsRank$ = this.statisticsService.getTimeBetweenRepostingsRank();

    this.repostingsRank$.subscribe((repostingsRank) => {
      this.selectedRepostingCount = +repostingsRank[0].name;
      this.jobs$ = this.jobService.getJobsByRepostingCount(+this.selectedRepostingCount);
    });

    this.timeBetweenRepostingsRank$.subscribe((timeBetweenRepostings) => {
      this.selectedTimeBetweenReposting = +timeBetweenRepostings[0].name;
    });

    this.statisticsService.getJobsCount().subscribe((jobsCount) => {
      this.jobsCount = jobsCount;
    });
  }

  onRepostingCountClick(repostingCount: number): void {
    this.selectedRepostingCount = repostingCount;
    this.jobs$ = this.jobService.getJobsByRepostingCount(+this.selectedRepostingCount);
  }

  onTimeBetweenRepostingsClick(timeBetweenRepostings: number): void {
    this.selectedTimeBetweenReposting = timeBetweenRepostings;
    this.jobs$ = this.jobService.getJobsByTimeBetweenRepostings(+this.selectedTimeBetweenReposting);
  }

  setDataType(dataType: RepostingsDataTypes): void {
    this.selectedDataType = dataType;

    if (this.selectedDataType == RepostingsDataTypes.repostingsCount) {
      this.jobs$ = this.jobService.getJobsByRepostingCount(+this.selectedRepostingCount);
    }

    if (this.selectedDataType == RepostingsDataTypes.timeInDaysBetweenRepostings) {
      this.jobs$ = this.jobService.getJobsByTimeBetweenRepostings(
        +this.selectedTimeBetweenReposting,
      );
    }
  }
}
