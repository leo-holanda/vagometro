import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { JobService } from 'src/app/job/job.service';
import { StatisticsService } from '../../statistics.service';
import { Job } from 'src/app/job/job.types';
import { PublicationChartComponent } from '../../charts/publication-chart/publication-chart.component';
import { JobListComponent } from 'src/app/job/job-list/job-list.component';
import { trackByRankData } from 'src/app/shared/track-by-functions';
import { JobPostingsComparisonComponent } from '../../comparisons/job-postings-comparison/job-postings-comparison.component';
import { ContractTypes } from 'src/app/shared/keywords-matcher/contract-types.data';
import { RankData, RankTypes } from '../../rank/rank.types';
import { RankComponent } from '../../rank/rank.component';

@Component({
  selector: 'vgm-types-overview',
  standalone: true,
  imports: [
    CommonModule,
    PublicationChartComponent,
    JobListComponent,
    JobPostingsComparisonComponent,
    RankComponent,
  ],
  templateUrl: './types-overview.component.html',
  styleUrls: ['./types-overview.component.scss'],
})
export class TypesOverviewComponent {
  typesRank$: Observable<RankData[]>;
  jobsQuantity!: number;
  selectedType!: string;
  jobsByType$!: Observable<Job[]>;

  trackByRankData = trackByRankData;
  rankTypes = RankTypes;

  constructor(
    private statisticsService: StatisticsService,
    private jobService: JobService,
  ) {
    this.typesRank$ = this.statisticsService.getTypesRank();

    this.typesRank$.subscribe((typesRank) => {
      this.selectedType = typesRank[0].name;
      this.jobsByType$ = this.jobService.getJobsByContractType(this.selectedType as ContractTypes);
    });

    this.jobService.jobs$.subscribe((jobs) => {
      this.jobsQuantity = jobs?.length || 0;
    });
  }

  onContractTypeClick(contractType: string): void {
    this.selectedType = contractType;
    this.jobsByType$ = this.jobService.getJobsByContractType(this.selectedType as ContractTypes);
  }
}
