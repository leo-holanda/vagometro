import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CertificationStatus } from 'src/app/shared/keywords-matcher/certification.data';
import { trackByRankData } from 'src/app/shared/track-by-functions';
import { Observable } from 'rxjs';
import { JobService } from 'src/app/job/job.service';
import { Job } from 'src/app/job/job.types';
import { StatisticsService } from '../../statistics.service';
import { PublicationChartComponent } from '../../charts/publication-chart/publication-chart.component';
import { JobPostingsComparisonComponent } from '../../comparisons/job-postings-comparison/job-postings-comparison.component';
import { JobListComponent } from 'src/app/job/job-list/job-list.component';
import { RankData, RankTypes } from '../../rank/rank.types';
import { RankComponent } from '../../rank/rank.component';
import { MatchesChartComponent } from '../../charts/matches-chart/matches-chart.component';

@Component({
  selector: 'vgm-certifications-overview',
  standalone: true,
  imports: [
    CommonModule,
    PublicationChartComponent,
    JobPostingsComparisonComponent,
    JobListComponent,
    RankComponent,
    MatchesChartComponent,
  ],
  templateUrl: './certifications-overview.component.html',
  styleUrls: ['./certifications-overview.component.scss'],
})
export class CertificationsOverviewComponent implements OnInit {
  certificationsRank$!: Observable<RankData[]>;
  jobsQuantity!: number;
  selectedCertificationStatus!: string;
  jobsByCertificationStatus$!: Observable<Job[]>;

  trackByRankData = trackByRankData;
  rankTypes = RankTypes;

  constructor(
    private statisticsService: StatisticsService,
    private jobService: JobService,
  ) {}

  ngOnInit(): void {
    this.certificationsRank$ = this.statisticsService.getCertificationsRank();

    this.certificationsRank$.subscribe((certificationsRank) => {
      this.selectedCertificationStatus = certificationsRank[0].name;
      this.jobsByCertificationStatus$ = this.jobService.getJobsByCertificationStatus(
        this.selectedCertificationStatus as CertificationStatus,
      );
    });

    this.jobService.jobs$.subscribe((jobs) => {
      this.jobsQuantity = jobs?.length || 0;
    });
  }

  onCertificationStatusClick(certificationStatus: string): void {
    this.selectedCertificationStatus = certificationStatus;
    this.jobsByCertificationStatus$ = this.jobService.getJobsByCertificationStatus(
      this.selectedCertificationStatus as CertificationStatus,
    );
  }
}
