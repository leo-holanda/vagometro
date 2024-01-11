import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatisticsService } from '../../statistics.service';
import { Observable, first, map, reduce, take } from 'rxjs';
import { KeywordData } from '../../ranks/keywords-rank/keywords-rank.model';
import { JobService } from 'src/app/job/job.service';
import { Job } from 'src/app/job/job.model';
import { CompaniesRankComponent } from '../../ranks/companies-rank/companies-rank.component';
import { WorkplaceRankComponent } from '../../ranks/workplace-rank/workplace-rank.component';
import { TypeRankComponent } from '../../ranks/type-rank/type-rank.component';
import { PublicationChartComponent } from '../../charts/publication-chart/publication-chart.component';
import { JobListComponent } from 'src/app/job/job-list/job-list.component';
import { ExperienceLevelsRankComponent } from '../../ranks/experience-levels-rank/experience-levels-rank.component';
import { trackByKeyword } from 'src/app/shared/track-by-functions';

@Component({
  selector: 'vgm-keywords-overview',
  standalone: true,
  imports: [
    CommonModule,
    CompaniesRankComponent,
    WorkplaceRankComponent,
    TypeRankComponent,
    PublicationChartComponent,
    JobListComponent,
    ExperienceLevelsRankComponent,
  ],
  templateUrl: './keywords-overview.component.html',
  styleUrls: ['./keywords-overview.component.scss'],
})
export class KeywordsOverviewComponent implements OnInit {
  keywordsRank$!: Observable<KeywordData[]>;
  keywordsQuantity!: number;
  selectedKeyword: string = '';
  jobsByKeyword$!: Observable<Job[]>;

  trackByKeyword = trackByKeyword;

  constructor(
    private statisticsService: StatisticsService,
    private jobService: JobService
  ) {}

  ngOnInit(): void {
    this.jobsByKeyword$ = this.jobService.getJobsByKeyword(
      this.selectedKeyword
    );

    this.keywordsRank$ = this.statisticsService.getKeywordsRank();

    this.keywordsRank$.subscribe((keywordsRank) => {
      this.keywordsQuantity = keywordsRank.reduce(
        (acc, keyword) => acc + keyword.count,
        0
      );
    });
  }

  onKeywordClick(keyword: string): void {
    this.selectedKeyword = keyword;

    this.jobsByKeyword$ = this.jobService.getJobsByKeyword(
      this.selectedKeyword
    );

    this.keywordsRank$ = this.statisticsService.getKeywordsRank(
      this.jobsByKeyword$
    );
  }
}
