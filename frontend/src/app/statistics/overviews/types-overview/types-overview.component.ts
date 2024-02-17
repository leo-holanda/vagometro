import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TypeData } from '../../ranks/type-rank/type-rank.model';
import { Observable } from 'rxjs';
import { JobService } from 'src/app/job/job.service';
import { StatisticsService } from '../../statistics.service';
import { Job } from 'src/app/job/job.types';
import { KeywordsRankComponent } from '../../ranks/keywords-rank/keywords-rank.component';
import { CompaniesRankComponent } from '../../ranks/companies-rank/companies-rank.component';
import { WorkplaceRankComponent } from '../../ranks/workplace-rank/workplace-rank.component';
import { PublicationChartComponent } from '../../charts/publication-chart/publication-chart.component';
import { JobListComponent } from 'src/app/job/job-list/job-list.component';
import { ExperienceLevelsRankComponent } from '../../ranks/experience-levels-rank/experience-levels-rank.component';
import { trackByType } from 'src/app/shared/track-by-functions';
import { EducationRankComponent } from '../../ranks/education-rank/education-rank.component';
import { LanguagesRankComponent } from '../../ranks/languages-rank/languages-rank.component';
import { JobPostingsComparisonComponent } from '../../comparisons/job-postings-comparison/job-postings-comparison.component';
import { ContractTypes } from 'src/app/shared/keywords-matcher/contract-types.data';

@Component({
  selector: 'vgm-types-overview',
  standalone: true,
  imports: [
    CommonModule,
    KeywordsRankComponent,
    CompaniesRankComponent,
    WorkplaceRankComponent,
    PublicationChartComponent,
    JobListComponent,
    ExperienceLevelsRankComponent,
    EducationRankComponent,
    LanguagesRankComponent,
    JobPostingsComparisonComponent,
  ],
  templateUrl: './types-overview.component.html',
  styleUrls: ['./types-overview.component.scss'],
})
export class TypesOverviewComponent {
  typesRank$: Observable<TypeData[]>;
  jobsQuantity!: number;
  selectedType!: ContractTypes;
  jobsByType$!: Observable<Job[]>;

  trackByType = trackByType;

  constructor(
    private statisticsService: StatisticsService,
    private jobService: JobService,
  ) {
    this.typesRank$ = this.statisticsService.getTypesRank();

    this.typesRank$.subscribe((typesRank) => {
      this.selectedType = typesRank[0].name;
      this.jobsByType$ = this.jobService.getJobsByContractType(this.selectedType);
    });

    this.jobService.jobs$.subscribe((jobs) => {
      this.jobsQuantity = jobs?.length || 0;
    });
  }

  onContractTypeClick(contractType: ContractTypes): void {
    this.selectedType = contractType;
    this.jobsByType$ = this.jobService.getJobsByContractType(this.selectedType);
  }
}
