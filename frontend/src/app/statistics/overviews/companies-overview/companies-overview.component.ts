import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyData } from '../../ranks/companies-rank/companies-rank.model';
import { Observable } from 'rxjs';
import { Job } from 'src/app/job/job.types';
import { JobService } from 'src/app/job/job.service';
import { StatisticsService } from '../../statistics.service';
import { WorkplaceRankComponent } from '../../ranks/workplace-rank/workplace-rank.component';
import { KeywordsRankComponent } from '../../ranks/keywords-rank/keywords-rank.component';
import { TypeRankComponent } from '../../ranks/type-rank/type-rank.component';
import { PublicationChartComponent } from '../../charts/publication-chart/publication-chart.component';
import { JobListComponent } from 'src/app/job/job-list/job-list.component';
import { ExperienceLevelsRankComponent } from '../../ranks/experience-levels-rank/experience-levels-rank.component';
import { trackByCompany } from 'src/app/shared/track-by-functions';
import { EducationRankComponent } from '../../ranks/education-rank/education-rank.component';
import { LanguagesRankComponent } from '../../ranks/languages-rank/languages-rank.component';
import { JobPostingsComparisonComponent } from '../../comparisons/job-postings-comparison/job-postings-comparison.component';

@Component({
  selector: 'vgm-companies-overview',
  standalone: true,
  imports: [
    CommonModule,
    WorkplaceRankComponent,
    KeywordsRankComponent,
    TypeRankComponent,
    PublicationChartComponent,
    JobListComponent,
    ExperienceLevelsRankComponent,
    EducationRankComponent,
    LanguagesRankComponent,
    JobPostingsComparisonComponent,
  ],
  templateUrl: './companies-overview.component.html',
  styleUrls: ['./companies-overview.component.scss'],
})
export class CompaniesOverviewComponent implements OnInit {
  companiesRank$!: Observable<CompanyData[]>;
  companiesQuantity!: number;
  selectedCompany!: string;
  jobsByCompany$!: Observable<Job[]>;

  trackByCompany = trackByCompany;

  constructor(
    private statisticsService: StatisticsService,
    private jobService: JobService
  ) {}

  ngOnInit(): void {
    this.companiesRank$ = this.statisticsService.getCompanyRank();

    this.companiesRank$.subscribe((companiesRank) => {
      this.selectedCompany = companiesRank[0].name;

      this.jobsByCompany$ = this.jobService.getJobsByCompany(
        this.selectedCompany
      );
    });

    this.companiesRank$.subscribe((companiesRank) => {
      this.companiesQuantity = companiesRank.reduce(
        (acc, company) => acc + company.count,
        0
      );
    });
  }

  onCompanyClick(companyName: string): void {
    this.selectedCompany = companyName;

    this.jobsByCompany$ = this.jobService.getJobsByCompany(
      this.selectedCompany
    );
  }
}
