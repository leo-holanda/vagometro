import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trackByLanguage } from 'src/app/shared/track-by-functions';
import { Observable } from 'rxjs';
import { Job } from 'src/app/job/job.types';
import { JobService } from 'src/app/job/job.service';
import { StatisticsService } from '../../statistics.service';
import { PublicationChartComponent } from '../../charts/publication-chart/publication-chart.component';
import { KeywordsRankComponent } from '../../ranks/keywords-rank/keywords-rank.component';
import { CompaniesRankComponent } from '../../ranks/companies-rank/companies-rank.component';
import { WorkplaceRankComponent } from '../../ranks/workplace-rank/workplace-rank.component';
import { ExperienceLevelsRankComponent } from '../../ranks/experience-levels-rank/experience-levels-rank.component';
import { EducationRankComponent } from '../../ranks/education-rank/education-rank.component';
import { JobListComponent } from 'src/app/job/job-list/job-list.component';
import { LanguageData } from '../../ranks/languages-rank/languages-rank.types';
import { JobPostingsComparisonComponent } from '../../comparisons/job-postings-comparison/job-postings-comparison.component';

@Component({
  selector: 'vgm-languages-overview',
  standalone: true,
  imports: [
    CommonModule,
    PublicationChartComponent,
    KeywordsRankComponent,
    CompaniesRankComponent,
    WorkplaceRankComponent,
    ExperienceLevelsRankComponent,
    EducationRankComponent,
    JobListComponent,
    JobPostingsComparisonComponent,
  ],
  templateUrl: './languages-overview.component.html',
  styleUrls: ['./languages-overview.component.scss'],
})
export class LanguagesOverviewComponent implements OnInit {
  languagesRank$!: Observable<LanguageData[]>;
  jobsQuantity!: number;
  selectedLanguage!: string;
  jobsByLanguage$!: Observable<Job[]>;

  trackByLanguage = trackByLanguage;

  constructor(
    private statisticsService: StatisticsService,
    private jobService: JobService,
  ) {}

  ngOnInit(): void {
    this.languagesRank$ = this.statisticsService.getLanguagesRank();

    this.languagesRank$.subscribe((languagesRank) => {
      this.selectedLanguage = languagesRank[0].name;

      this.jobsByLanguage$ = this.jobService.getJobsByLanguage(
        this.selectedLanguage,
      );
    });

    this.languagesRank$.subscribe((languagesRank) => {
      this.jobsQuantity = languagesRank.reduce(
        (acc, language) => acc + language.count,
        0,
      );
    });
  }

  onLanguageClick(language: string): void {
    this.selectedLanguage = language;
    this.jobsByLanguage$ = this.jobService.getJobsByLanguage(
      this.selectedLanguage,
    );
  }
}
