import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatisticsService } from '../../statistics.service';
import { Observable, first, map, reduce, take } from 'rxjs';
import { KeywordData } from '../../ranks/keywords-rank/keywords-rank.model';
import { JobService } from 'src/app/job/job.service';
import { Job } from 'src/app/job/job.types';
import { CompaniesRankComponent } from '../../ranks/companies-rank/companies-rank.component';
import { WorkplaceRankComponent } from '../../ranks/workplace-rank/workplace-rank.component';
import { TypeRankComponent } from '../../ranks/type-rank/type-rank.component';
import { PublicationChartComponent } from '../../charts/publication-chart/publication-chart.component';
import { JobListComponent } from 'src/app/job/job-list/job-list.component';
import { ExperienceLevelsRankComponent } from '../../ranks/experience-levels-rank/experience-levels-rank.component';
import { trackByKeyword } from 'src/app/shared/track-by-functions';
import { FormsModule } from '@angular/forms';
import { EducationRankComponent } from '../../ranks/education-rank/education-rank.component';
import { LanguagesRankComponent } from '../../ranks/languages-rank/languages-rank.component';

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
    FormsModule,
    EducationRankComponent,
    LanguagesRankComponent,
  ],
  templateUrl: './keywords-overview.component.html',
  styleUrls: ['./keywords-overview.component.scss'],
})
export class KeywordsOverviewComponent implements OnInit {
  keywordsRank$!: Observable<KeywordData[]>;
  keywordsQuantity!: number;
  selectedKeyword: string = '';
  jobsByKeyword$!: Observable<Job[]>;

  filteredKeywords$!: Observable<KeywordData[]>;
  keywordSearchString = '';

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
    this.filteredKeywords$ = this.keywordsRank$;

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

  filterKeywords(): void {
    this.filteredKeywords$ = this.keywordsRank$.pipe(
      map((keywordsRank) =>
        keywordsRank.filter((keywordData) =>
          keywordData.word
            .toLowerCase()
            .includes(this.keywordSearchString.toLowerCase())
        )
      )
    );
  }

  resetSelectedKeyword(): void {
    this.keywordSearchString = '';
    this.selectedKeyword = '';
  }
}
