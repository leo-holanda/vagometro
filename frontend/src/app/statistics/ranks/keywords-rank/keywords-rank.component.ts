import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, map } from 'rxjs';
import { KeywordStatsData } from './keywords-rank.model';
import { StatisticsService } from '../../statistics.service';
import { Job } from 'src/app/job/job.types';
import { trackByKeyword } from 'src/app/shared/track-by-functions';

@Component({
  selector: 'vgm-keywords-rank',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './keywords-rank.component.html',
  styleUrls: ['./keywords-rank.component.scss'],
})
export class KeywordsRankComponent implements OnInit, OnChanges {
  @Input() jobs$?: Observable<Job[]>;
  @Input() rankSize: number | undefined;

  keywordsRank$!: Observable<KeywordStatsData[]>;

  trackByKeyword = trackByKeyword;

  constructor(private statisticsService: StatisticsService) {}

  ngOnInit(): void {
    this.keywordsRank$ = this.statisticsService.getKeywordsRank(this.jobs$);

    if (this.rankSize)
      this.keywordsRank$ = this.keywordsRank$.pipe(
        map((keywordsRank) => keywordsRank.slice(0, this.rankSize)),
      );
  }

  ngOnChanges(): void {
    this.keywordsRank$ = this.statisticsService.getKeywordsRank(this.jobs$);

    if (this.rankSize)
      this.keywordsRank$ = this.keywordsRank$.pipe(
        map((keywordsRank) => keywordsRank.slice(0, this.rankSize)),
      );
  }
}
