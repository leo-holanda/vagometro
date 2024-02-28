import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { Job } from 'src/app/job/job.types';
import { JobService } from 'src/app/job/job.service';
import { StatisticsService } from '../../statistics.service';
import { PublicationChartComponent } from '../../charts/publication-chart/publication-chart.component';
import { JobListComponent } from 'src/app/job/job-list/job-list.component';
import { trackByCompany } from 'src/app/shared/track-by-functions';
import { JobPostingsComparisonComponent } from '../../comparisons/job-postings-comparison/job-postings-comparison.component';
import { RankComponent } from '../../ranks/rank/rank.component';
import { RankData, RankTypes } from '../../ranks/rank/rank.types';

@Component({
  selector: 'vgm-companies-overview',
  standalone: true,
  imports: [
    CommonModule,
    PublicationChartComponent,
    JobListComponent,
    JobPostingsComparisonComponent,
    RankComponent,
  ],
  templateUrl: './companies-overview.component.html',
  styleUrls: ['./companies-overview.component.scss'],
})
export class CompaniesOverviewComponent implements OnInit {
  companiesRank$!: Observable<RankData[]>;
  jobsQuantity!: number;
  selectedCompany!: string;
  jobsByCompany$!: Observable<Job[]>;

  trackByCompany = trackByCompany;
  rankTypes = RankTypes;

  constructor(
    private statisticsService: StatisticsService,
    private jobService: JobService,
  ) {}

  ngOnInit(): void {
    this.companiesRank$ = this.statisticsService.getCompanyRank();

    this.companiesRank$.subscribe((companiesRank) => {
      this.selectedCompany = companiesRank[0].name;
      this.jobsByCompany$ = this.jobService.getJobsByCompany(this.selectedCompany);
    });

    this.jobService.jobs$.subscribe((jobs) => {
      this.jobsQuantity = jobs?.length || 0;
    });
  }

  onCompanyClick(companyName: string): void {
    this.selectedCompany = companyName;

    this.jobsByCompany$ = this.jobService.getJobsByCompany(this.selectedCompany);
  }
}
