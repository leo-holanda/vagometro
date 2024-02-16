import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CertificationStatus, CertificationsData } from 'src/app/shared/keywords-matcher/certification.data';
import { trackByCertificationStatus } from 'src/app/shared/track-by-functions';
import { Observable } from 'rxjs';
import { JobService } from 'src/app/job/job.service';
import { Job } from 'src/app/job/job.types';
import { StatisticsService } from '../../statistics.service';
import { PublicationChartComponent } from '../../charts/publication-chart/publication-chart.component';
import { JobPostingsComparisonComponent } from '../../comparisons/job-postings-comparison/job-postings-comparison.component';
import { KeywordsRankComponent } from '../../ranks/keywords-rank/keywords-rank.component';
import { WorkplaceRankComponent } from '../../ranks/workplace-rank/workplace-rank.component';
import { ExperienceLevelsRankComponent } from '../../ranks/experience-levels-rank/experience-levels-rank.component';
import { TypeRankComponent } from '../../ranks/type-rank/type-rank.component';
import { EducationRankComponent } from '../../ranks/education-rank/education-rank.component';
import { LanguagesRankComponent } from '../../ranks/languages-rank/languages-rank.component';
import { JobListComponent } from 'src/app/job/job-list/job-list.component';

@Component({
  selector: 'vgm-certifications-overview',
  standalone: true,
  imports: [
    CommonModule,
    PublicationChartComponent,
    JobPostingsComparisonComponent,
    KeywordsRankComponent,
    WorkplaceRankComponent,
    ExperienceLevelsRankComponent,
    TypeRankComponent,
    EducationRankComponent,
    LanguagesRankComponent,
    JobListComponent,
  ],
  templateUrl: './certifications-overview.component.html',
  styleUrls: ['./certifications-overview.component.scss'],
})
export class CertificationsOverviewComponent implements OnInit {
  certificationsRank$!: Observable<CertificationsData[]>;
  certificationsQuantity!: number;
  selectedCertificationStatus!: CertificationStatus;
  jobsByCertificationStatus$!: Observable<Job[]>;

  trackByCertificationStatus = trackByCertificationStatus;

  constructor(
    private statisticsService: StatisticsService,
    private jobService: JobService,
  ) {}

  ngOnInit(): void {
    this.certificationsRank$ = this.statisticsService.getCertificationsRank();

    this.certificationsRank$.subscribe((certificationsRank) => {
      this.selectedCertificationStatus = certificationsRank[0].status;

      this.jobsByCertificationStatus$ = this.jobService.getJobsByCertificationStatus(this.selectedCertificationStatus);
    });

    this.certificationsRank$.subscribe((certificationsRank) => {
      this.certificationsQuantity = certificationsRank.reduce((acc, company) => acc + company.count, 0);
    });
  }

  onCertificationStatusClick(certificationStatus: CertificationStatus): void {
    this.selectedCertificationStatus = certificationStatus;
    this.jobsByCertificationStatus$ = this.jobService.getJobsByCertificationStatus(this.selectedCertificationStatus);
  }
}
