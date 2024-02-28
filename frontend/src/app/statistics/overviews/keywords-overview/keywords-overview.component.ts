import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatisticsService } from '../../statistics.service';
import { Observable, map } from 'rxjs';
import { JobService } from 'src/app/job/job.service';
import { Job } from 'src/app/job/job.types';
import { PublicationChartComponent } from '../../charts/publication-chart/publication-chart.component';
import { JobListComponent } from 'src/app/job/job-list/job-list.component';
import { trackByKeyword, trackByRankData } from 'src/app/shared/track-by-functions';
import { FormsModule } from '@angular/forms';
import { JobPostingsComparisonComponent } from '../../comparisons/job-postings-comparison/job-postings-comparison.component';
import { RankData, RankTypes } from '../../ranks/rank/rank.types';
import { RankComponent } from '../../ranks/rank/rank.component';

@Component({
  selector: 'vgm-keywords-overview',
  standalone: true,
  imports: [
    CommonModule,
    PublicationChartComponent,
    JobListComponent,
    FormsModule,
    JobPostingsComparisonComponent,
    RankComponent,
  ],
  templateUrl: './keywords-overview.component.html',
  styleUrls: ['./keywords-overview.component.scss'],
})
export class KeywordsOverviewComponent implements OnInit {
  keywordsRank$!: Observable<RankData[]>;
  jobsQuantity!: number;
  selectedKeyword = '';
  jobsByKeyword$!: Observable<Job[]>;

  filteredKeywords$!: Observable<RankData[]>;
  keywordSearchString = '';

  trackByRankData = trackByRankData;
  rankTypes = RankTypes;

  constructor(
    private statisticsService: StatisticsService,
    private jobService: JobService,
  ) {}

  ngOnInit(): void {
    this.jobsByKeyword$ = this.jobService.getJobsByKeyword(this.selectedKeyword);

    this.keywordsRank$ = this.statisticsService.getKeywordsRank();
    this.filteredKeywords$ = this.keywordsRank$;

    this.jobService.jobs$.subscribe((jobs) => {
      this.jobsQuantity = jobs?.length || 0;
    });
  }

  onKeywordClick(keyword: string): void {
    this.selectedKeyword = keyword;

    this.jobsByKeyword$ = this.jobService.getJobsByKeyword(this.selectedKeyword);

    this.keywordsRank$ = this.statisticsService.getKeywordsRank(this.jobsByKeyword$);
  }

  filterKeywords(): void {
    this.filteredKeywords$ = this.keywordsRank$.pipe(
      map((keywordsRank) =>
        keywordsRank.filter((keywordData) =>
          keywordData.name.toLowerCase().includes(this.keywordSearchString.toLowerCase()),
        ),
      ),
    );
  }

  resetSelectedKeyword(): void {
    this.keywordSearchString = '';
    this.selectedKeyword = '';
  }
}
