import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DisabilityData } from './disability-rank.model';
import { Observable, map } from 'rxjs';
import { Job } from 'src/app/job/job.model';
import { StatisticsService } from '../../statistics.service';

@Component({
  selector: 'vgm-disability-rank',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './disability-rank.component.html',
  styleUrls: ['./disability-rank.component.scss'],
})
export class DisabilityRankComponent {
  @Input() jobs$?: Observable<Job[]>;
  @Input() rankSize: number | undefined;

  disabilityRank$!: Observable<DisabilityData[]>;

  constructor(private statisticsService: StatisticsService) {}

  ngOnInit(): void {
    this.disabilityRank$ = this.statisticsService.getDisabilityStatusesRank(
      this.jobs$
    );

    if (this.rankSize)
      this.disabilityRank$ = this.disabilityRank$.pipe(
        map((disabilityRank) => disabilityRank.slice(0, this.rankSize))
      );
  }

  ngOnChanges(): void {
    this.disabilityRank$ = this.statisticsService.getDisabilityStatusesRank(
      this.jobs$
    );

    if (this.rankSize)
      this.disabilityRank$ = this.disabilityRank$.pipe(
        map((disabilityRank) => disabilityRank.slice(0, this.rankSize))
      );
  }
}
