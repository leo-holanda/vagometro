import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatisticsService } from '../../statistics.service';
import { TypeData } from './type-rank.model';
import { Observable, map } from 'rxjs';
import { Job } from 'src/app/job/job.types';
import { trackByType } from 'src/app/shared/track-by-functions';

@Component({
  selector: 'vgm-type-rank',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './type-rank.component.html',
  styleUrls: ['./type-rank.component.scss'],
})
export class TypeRankComponent implements OnChanges {
  @Input() jobs$?: Observable<Job[]>;
  @Input() rankSize: number | undefined;

  typesRank$: Observable<TypeData[]>;

  trackByType = trackByType;

  constructor(private statisticsService: StatisticsService) {
    this.typesRank$ = this.statisticsService.getTypesRank(this.jobs$);

    if (this.rankSize)
      this.typesRank$ = this.typesRank$.pipe(
        map((typesRank) => typesRank.slice(0, this.rankSize))
      );
  }

  ngOnChanges(): void {
    this.typesRank$ = this.statisticsService.getTypesRank(this.jobs$);

    if (this.rankSize)
      this.typesRank$ = this.typesRank$.pipe(
        map((typesRank) => typesRank.slice(0, this.rankSize))
      );
  }
}
