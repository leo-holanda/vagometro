import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyData } from '../../ranks/companies-rank/companies-rank.model';
import { Observable } from 'rxjs';
import { Job } from 'src/app/job/job.model';
import { JobService } from 'src/app/job/job.service';
import { StatisticsService } from '../../statistics.service';
import { WorkplaceRankComponent } from '../../ranks/workplace-rank/workplace-rank.component';
import { KeywordsRankComponent } from '../../ranks/keywords-rank/keywords-rank.component';
import { TypeRankComponent } from '../../ranks/type-rank/type-rank.component';
import { PublicationChartComponent } from '../../charts/publication-chart/publication-chart.component';
import { JobListComponent } from 'src/app/job/job-list/job-list.component';

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
  ],
  templateUrl: './companies-overview.component.html',
  styleUrls: ['./companies-overview.component.scss'],
})
export class CompaniesOverviewComponent implements OnInit {
  companiesRank$!: Observable<CompanyData[]>;
  companiesQuantity!: number;
  selectedCompany!: string;
  jobsByCompany$!: Observable<Job[]>;

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
