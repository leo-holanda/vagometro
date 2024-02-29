import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { Job } from 'src/app/job/job.types';
import { JobService } from 'src/app/job/job.service';
import { StatisticsService } from '../../statistics.service';
import { JobListComponent } from 'src/app/job/job-list/job-list.component';
import { PublicationChartComponent } from '../../charts/publication-chart/publication-chart.component';
import { JobPostingsComparisonComponent } from '../../comparisons/job-postings-comparison/job-postings-comparison.component';
import { InclusionTypes } from '../../../shared/keywords-matcher/inclusion.data';
import { trackByRankData } from 'src/app/shared/track-by-functions';
import { RankData, RankTypes } from '../../ranks/rank/rank.types';
import { RankComponent } from '../../ranks/rank/rank.component';

@Component({
  selector: 'vgm-inclusion-overview',
  standalone: true,
  imports: [
    CommonModule,
    PublicationChartComponent,
    JobListComponent,
    JobPostingsComparisonComponent,
    RankComponent,
  ],
  templateUrl: './inclusion-overview.component.html',
  styleUrls: ['./inclusion-overview.component.scss'],
})
export class InclusionOverviewComponent implements OnInit {
  inclusionRank$!: Observable<RankData[]>;
  selectedInclusionType!: InclusionTypes;
  jobsQuantity!: number;
  jobsByInclusionType$!: Observable<Job[]>;

  trackByRankData = trackByRankData;
  rankTypes = RankTypes;

  constructor(
    private statisticsService: StatisticsService,
    private jobService: JobService,
  ) {}

  ngOnInit(): void {
    this.inclusionRank$ = this.statisticsService.getInclusionRank();

    this.inclusionRank$.subscribe((inclusionRank) => {
      this.selectedInclusionType = inclusionRank[0].name as InclusionTypes;
      this.jobsByInclusionType$ = this.jobService.getJobsByInclusionType(
        this.selectedInclusionType,
      );
    });

    this.jobService.jobs$.subscribe((jobs) => {
      this.jobsQuantity = jobs?.length || 0;
    });
  }

  onInclusionTypeClick(inclusionType: string): void {
    this.selectedInclusionType = inclusionType as InclusionTypes;
    this.jobsByInclusionType$ = this.jobService.getJobsByInclusionType(this.selectedInclusionType);
  }
}
