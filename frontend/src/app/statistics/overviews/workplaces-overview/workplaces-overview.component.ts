import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobService } from 'src/app/job/job.service';
import { CompaniesRankComponent } from '../../ranks/companies-rank/companies-rank.component';
import { Observable } from 'rxjs';
import { Job } from 'src/app/job/job.types';
import { KeywordsRankComponent } from '../../ranks/keywords-rank/keywords-rank.component';
import { TypeRankComponent } from '../../ranks/type-rank/type-rank.component';
import { StatisticsService } from '../../statistics.service';
import { WorkplaceData } from '../../ranks/workplace-rank/workplace-rank.model';
import { PublicationChartComponent } from '../../charts/publication-chart/publication-chart.component';
import { JobListComponent } from 'src/app/job/job-list/job-list.component';
import { ExperienceLevelsRankComponent } from '../../ranks/experience-levels-rank/experience-levels-rank.component';
import { trackByWorkplace } from 'src/app/shared/track-by-functions';
import { EducationRankComponent } from '../../ranks/education-rank/education-rank.component';
import { LanguagesRankComponent } from '../../ranks/languages-rank/languages-rank.component';
import { JobPostingsComparisonComponent } from '../../comparisons/job-postings-comparison/job-postings-comparison.component';

@Component({
  selector: 'vgm-workplaces-overview',
  standalone: true,
  imports: [
    CommonModule,
    CompaniesRankComponent,
    KeywordsRankComponent,
    TypeRankComponent,
    PublicationChartComponent,
    JobListComponent,
    ExperienceLevelsRankComponent,
    EducationRankComponent,
    LanguagesRankComponent,
    JobPostingsComparisonComponent,
  ],
  templateUrl: './workplaces-overview.component.html',
  styleUrls: ['./workplaces-overview.component.scss'],
})
export class WorkplacesOverviewComponent {
  selectedWorkplace = 'remoto';

  jobsByWorkplace$!: Observable<Job[]>;
  workplacesRank$: Observable<WorkplaceData[]>;
  jobsQuantity = 0;

  trackByWorkplace = trackByWorkplace;

  constructor(
    private jobService: JobService,
    private statisticsService: StatisticsService,
  ) {
    this.workplacesRank$ = this.statisticsService.getWorkplaceRank();

    this.workplacesRank$.subscribe((workplacesRank) => {
      this.selectedWorkplace = workplacesRank[0].type;
      this.jobsByWorkplace$ = this.jobService.getJobsByWorkplace(this.selectedWorkplace);
    });

    this.jobService.jobs$.subscribe((jobs) => {
      this.jobsQuantity = jobs?.length || 0;
    });
  }

  onWorkplaceClick(workplace: string): void {
    this.selectedWorkplace = workplace;
    this.jobsByWorkplace$ = this.jobService.getJobsByWorkplace(this.selectedWorkplace);
  }
}
