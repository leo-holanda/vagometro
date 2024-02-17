import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { EducationRankComponent } from '../../ranks/education-rank/education-rank.component';
import { LanguagesRankComponent } from '../../ranks/languages-rank/languages-rank.component';
import { JobPostingsComparisonComponent } from '../../comparisons/job-postings-comparison/job-postings-comparison.component';
import { InclusionData, InclusionTypes } from '../../../shared/keywords-matcher/inclusion.data';
import { trackByInclusionType } from 'src/app/shared/track-by-functions';

@Component({
  selector: 'vgm-inclusion-overview',
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
    JobPostingsComparisonComponent,
  ],
  templateUrl: './inclusion-overview.component.html',
  styleUrls: ['./inclusion-overview.component.scss'],
})
export class InclusionOverviewComponent implements OnInit {
  inclusionRank$!: Observable<InclusionData[]>;
  selectedInclusionType!: InclusionTypes;
  jobsQuantity!: number;
  jobsByInclusionType$!: Observable<Job[]>;

  trackByInclusionType = trackByInclusionType;

  constructor(
    private statisticsService: StatisticsService,
    private jobService: JobService,
  ) {}

  ngOnInit(): void {
    this.inclusionRank$ = this.statisticsService.getInclusionRank();

    this.inclusionRank$.subscribe((inclusionRank) => {
      this.selectedInclusionType = inclusionRank[0].name;
      this.jobsByInclusionType$ = this.jobService.getJobsByInclusionType(this.selectedInclusionType);
    });

    this.jobService.jobs$.subscribe((jobs) => {
      this.jobsQuantity = jobs?.length || 0;
    });
  }

  onInclusionTypeClick(inclusionType: InclusionTypes): void {
    this.selectedInclusionType = inclusionType;
    this.jobsByInclusionType$ = this.jobService.getJobsByInclusionType(this.selectedInclusionType);
  }
}
