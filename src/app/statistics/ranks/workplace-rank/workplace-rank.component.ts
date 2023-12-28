import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { StatisticsService } from '../../statistics.service';
import { WorkplaceData } from './workplace-rank.model';
import { Observable } from 'rxjs';
import { Job } from 'src/app/job/job.model';

@Component({
  selector: 'vgm-workplace-rank',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './workplace-rank.component.html',
  styleUrls: ['./workplace-rank.component.scss'],
})
export class WorkplaceRankComponent implements OnInit, OnChanges {
  @Input() jobs$?: Observable<Job[]>;
  workplaceRank$!: Observable<WorkplaceData[]>;

  constructor(private statisticsService: StatisticsService) {}

  ngOnInit(): void {
    this.workplaceRank$ = this.statisticsService.getWorkplaceRank(this.jobs$);
  }

  ngOnChanges(): void {
    this.workplaceRank$ = this.statisticsService.getWorkplaceRank(this.jobs$);
  }
}
