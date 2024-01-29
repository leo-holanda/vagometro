import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  DisabilityData,
  DisabilityStatuses,
} from '../../ranks/disability-rank/disability-rank.model';
import { Observable } from 'rxjs';
import { Job } from 'src/app/job/job.types';
import { JobService } from 'src/app/job/job.service';
import { StatisticsService } from '../../statistics.service';
import { CompaniesRankComponent } from '../../ranks/companies-rank/companies-rank.component';
import { KeywordsRankComponent } from '../../ranks/keywords-rank/keywords-rank.component';
import { TypeRankComponent } from '../../ranks/type-rank/type-rank.component';
import { WorkplaceRankComponent } from '../../ranks/workplace-rank/workplace-rank.component';
import { JobListComponent } from 'src/app/job/job-list/job-list.component';
import { ExperienceLevelsRankComponent } from '../../ranks/experience-levels-rank/experience-levels-rank.component';
import { PublicationChartComponent } from '../../charts/publication-chart/publication-chart.component';
import { trackByDisabilityStatus } from 'src/app/shared/track-by-functions';
import { EducationRankComponent } from '../../ranks/education-rank/education-rank.component';
import { LanguagesRankComponent } from '../../ranks/languages-rank/languages-rank.component';
import { ComparisonOverviewComponent } from '../comparison-overview/comparison-overview.component';

@Component({
  selector: 'vgm-disability-statuses-overview',
  standalone: true,
  imports: [
    CommonModule,
    CompaniesRankComponent,
    KeywordsRankComponent,
    TypeRankComponent,
    WorkplaceRankComponent,
    ExperienceLevelsRankComponent,
    PublicationChartComponent,
    JobListComponent,
    EducationRankComponent,
    LanguagesRankComponent,
    ComparisonOverviewComponent,
  ],
  templateUrl: './disability-statuses-overview.component.html',
  styleUrls: ['./disability-statuses-overview.component.scss'],
})
export class DisabilityStatusesOverviewComponent {
  disabilityRank$!: Observable<DisabilityData[]>;
  jobsQuantity!: number;
  selectedDisabilityStatus = DisabilityStatuses.PCD;
  jobsByDisabilityStatus$!: Observable<Job[]>;

  trackByDisabilityStatus = trackByDisabilityStatus;

  constructor(
    private statisticsService: StatisticsService,
    private jobService: JobService
  ) {}

  ngOnInit(): void {
    this.jobsByDisabilityStatus$ = this.jobService.getJobsByDisabilityStatus(
      this.selectedDisabilityStatus
    );

    this.disabilityRank$ = this.statisticsService.getDisabilityStatusesRank();

    this.disabilityRank$.subscribe((disabilityRank) => {
      this.jobsQuantity = disabilityRank.reduce(
        (acc, keyword) => acc + keyword.count,
        0
      );
    });
  }

  onDisabilityStatusClick(disabilityStatus: DisabilityStatuses): void {
    this.selectedDisabilityStatus = disabilityStatus;

    this.jobsByDisabilityStatus$ = this.jobService.getJobsByDisabilityStatus(
      this.selectedDisabilityStatus
    );
  }
}
