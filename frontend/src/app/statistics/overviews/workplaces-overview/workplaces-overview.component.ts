import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobService } from 'src/app/job/job.service';
import { Observable } from 'rxjs';
import { Job } from 'src/app/job/job.types';
import { StatisticsService } from '../../statistics.service';
import { PublicationChartComponent } from '../../charts/publication-chart/publication-chart.component';
import { JobListComponent } from 'src/app/job/job-list/job-list.component';
import { trackByRankData } from 'src/app/shared/track-by-functions';
import { JobPostingsComparisonComponent } from '../../comparisons/job-postings-comparison/job-postings-comparison.component';
import { RankData, RankTypes } from '../../rank/rank.types';
import { RankComponent } from '../../rank/rank.component';
import { MatchesChartComponent } from '../../charts/matches-chart/matches-chart.component';
import { WorkplaceTypes } from 'src/app/shared/keywords-matcher/workplace.data';

@Component({
  selector: 'vgm-workplaces-overview',
  standalone: true,
  imports: [
    CommonModule,
    PublicationChartComponent,
    JobListComponent,
    JobPostingsComparisonComponent,
    RankComponent,
    MatchesChartComponent,
  ],
  templateUrl: './workplaces-overview.component.html',
  styleUrls: ['./workplaces-overview.component.scss'],
})
export class WorkplacesOverviewComponent {
  selectedWorkplace = 'remoto';

  jobsByWorkplace$!: Observable<Job[]>;
  workplacesRank$: Observable<RankData[]>;
  jobsQuantity = 0;

  trackByRankData = trackByRankData;
  rankTypes = RankTypes;

  constructor(
    private jobService: JobService,
    private statisticsService: StatisticsService,
  ) {
    this.workplacesRank$ = this.statisticsService.getWorkplaceRank();

    // TODO: Use generic type on Rank Data
    this.workplacesRank$.subscribe((workplacesRank) => {
      this.selectedWorkplace = workplacesRank[0].name;
      this.jobsByWorkplace$ = this.jobService.getJobsByWorkplace(
        this.selectedWorkplace as WorkplaceTypes,
      );
    });

    this.jobService.jobs$.subscribe((jobs) => {
      this.jobsQuantity = jobs?.length || 0;
    });
  }

  onWorkplaceClick(workplace: string): void {
    this.selectedWorkplace = workplace;
    this.jobsByWorkplace$ = this.jobService.getJobsByWorkplace(
      this.selectedWorkplace as WorkplaceTypes,
    );
  }
}
