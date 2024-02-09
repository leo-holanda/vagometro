import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, map } from 'rxjs';
import { Job } from 'src/app/job/job.types';
import { trackByMonth } from 'src/app/shared/track-by-functions';
import { StatisticsService } from '../../statistics.service';
import { MonthData } from './months-rank.types';

@Component({
  selector: 'vgm-months-rank',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './months-rank.component.html',
  styleUrls: ['./months-rank.component.scss'],
})
export class MonthsRankComponent implements OnInit, OnChanges {
  @Input() jobs$?: Observable<Job[]>;
  @Input() rankSize: number | undefined;

  monthsRank$!: Observable<MonthData[]>;

  trackByMonth = trackByMonth;

  constructor(private statisticsService: StatisticsService) {}

  ngOnInit(): void {
    this.monthsRank$ = this.statisticsService.getMonthsRank(this.jobs$);
    if (this.rankSize)
      this.monthsRank$ = this.monthsRank$.pipe(
        map((monthsRank) => monthsRank.slice(0, this.rankSize)),
      );
  }

  ngOnChanges(): void {
    this.monthsRank$ = this.statisticsService.getMonthsRank(this.jobs$);
    if (this.rankSize)
      this.monthsRank$ = this.monthsRank$.pipe(
        map((monthsRank) => monthsRank.slice(0, this.rankSize)),
      );
  }
}
