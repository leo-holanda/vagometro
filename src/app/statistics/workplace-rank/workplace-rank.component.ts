import { Component, OnInit } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { StatisticsService } from '../statistics.service';
import { WorkplaceData } from './workplace-rank.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'vgm-workplace-rank',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './workplace-rank.component.html',
  styleUrls: ['./workplace-rank.component.scss'],
})
export class WorkplaceRankComponent implements OnInit {
  workplaceRank!: Observable<WorkplaceData[]>;

  constructor(private statisticsService: StatisticsService) {}

  ngOnInit(): void {
    this.workplaceRank = this.statisticsService.getWorkplaceRank();
  }
}
