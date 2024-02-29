import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trackByRankData } from 'src/app/shared/track-by-functions';
import { Observable } from 'rxjs';
import { Job } from 'src/app/job/job.types';
import { JobService } from 'src/app/job/job.service';
import { StatisticsService } from '../../statistics.service';
import { PublicationChartComponent } from '../../charts/publication-chart/publication-chart.component';
import { JobListComponent } from 'src/app/job/job-list/job-list.component';
import { JobPostingsComparisonComponent } from '../../comparisons/job-postings-comparison/job-postings-comparison.component';
import { RankComponent } from '../../rank/rank.component';
import { RankData, RankTypes } from '../../rank/rank.types';
import { MatchesChartComponent } from '../../charts/matches-chart/matches-chart.component';

@Component({
  selector: 'vgm-languages-overview',
  standalone: true,
  imports: [
    CommonModule,
    PublicationChartComponent,
    JobListComponent,
    JobPostingsComparisonComponent,
    RankComponent,
    MatchesChartComponent,
  ],
  templateUrl: './languages-overview.component.html',
  styleUrls: ['./languages-overview.component.scss'],
})
export class LanguagesOverviewComponent implements OnInit {
  languagesRank$!: Observable<RankData[]>;
  jobsQuantity!: number;
  selectedLanguage!: string;
  jobsByLanguage$!: Observable<Job[]>;

  trackByRankData = trackByRankData;
  rankTypes = RankTypes;

  constructor(
    private statisticsService: StatisticsService,
    private jobService: JobService,
  ) {}

  ngOnInit(): void {
    this.languagesRank$ = this.statisticsService.getLanguagesRank();

    this.languagesRank$.subscribe((languagesRank) => {
      this.selectedLanguage = languagesRank[0].name;
      this.jobsByLanguage$ = this.jobService.getJobsByLanguage(this.selectedLanguage);
    });

    this.jobService.jobs$.subscribe((jobs) => {
      this.jobsQuantity = jobs?.length || 0;
    });
  }

  onLanguageClick(language: string): void {
    this.selectedLanguage = language;
    this.jobsByLanguage$ = this.jobService.getJobsByLanguage(this.selectedLanguage);
  }
}
