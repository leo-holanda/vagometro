import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, map } from 'rxjs';
import { Job } from 'src/app/job/job.types';
import { StatisticsService } from '../../statistics.service';
import { InclusionData } from '../../../shared/keywords-matcher/inclusion.data';
import { trackByInclusionType } from 'src/app/shared/track-by-functions';
import { RankData } from '../rank/rank.types';

@Component({
  selector: 'vgm-inclusion-rank',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inclusion-rank.component.html',
  styleUrls: ['./inclusion-rank.component.scss'],
})
export class InclusionRankComponent implements OnInit, OnChanges {
  @Input() jobs$?: Observable<Job[]>;
  @Input() rankSize: number | undefined;

  inclusionRank$!: Observable<RankData[]>;

  trackByInclusionType = trackByInclusionType;

  constructor(private statisticsService: StatisticsService) {}

  ngOnInit(): void {
    this.inclusionRank$ = this.statisticsService.getInclusionRank(this.jobs$);

    if (this.rankSize)
      this.inclusionRank$ = this.inclusionRank$.pipe(
        map((inclusionRank) => inclusionRank.slice(0, this.rankSize)),
      );
  }

  ngOnChanges(): void {
    this.inclusionRank$ = this.statisticsService.getInclusionRank(this.jobs$);

    if (this.rankSize)
      this.inclusionRank$ = this.inclusionRank$.pipe(
        map((inclusionRank) => inclusionRank.slice(0, this.rankSize)),
      );
  }
}
