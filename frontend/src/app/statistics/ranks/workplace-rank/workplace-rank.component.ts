import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatisticsService } from '../../statistics.service';
import { WorkplaceData } from './workplace-rank.model';
import { Observable } from 'rxjs';
import { Job } from 'src/app/job/job.types';
import { trackByWorkplace } from 'src/app/shared/track-by-functions';
import { RankData } from '../rank/rank.types';

@Component({
  selector: 'vgm-workplace-rank',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './workplace-rank.component.html',
  styleUrls: ['./workplace-rank.component.scss'],
})
export class WorkplaceRankComponent implements OnInit, OnChanges {
  @Input() jobs$?: Observable<Job[]>;
  workplaceRank$!: Observable<RankData[]>;

  trackByWorkplace = trackByWorkplace;

  constructor(private statisticsService: StatisticsService) {}

  ngOnInit(): void {
    this.workplaceRank$ = this.statisticsService.getWorkplaceRank(this.jobs$);
  }

  ngOnChanges(): void {
    this.workplaceRank$ = this.statisticsService.getWorkplaceRank(this.jobs$);
  }
}
