import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatisticsService } from '../../statistics.service';
import { CityData } from './cities-rank.model';
import { Observable, map } from 'rxjs';
import { RouterModule } from '@angular/router';
import { Job } from 'src/app/job/job.model';

@Component({
  selector: 'vgm-cities-rank',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cities-rank.component.html',
  styleUrls: ['./cities-rank.component.scss'],
})
export class CitiesRankComponent implements OnInit, OnChanges {
  @Input() jobs$?: Observable<Job[]>;
  citiesRank$!: Observable<CityData[]>;

  constructor(private statisticsService: StatisticsService) {}

  ngOnInit(): void {
    this.citiesRank$ = this.statisticsService.getCitiesRank(this.jobs$);
  }

  ngOnChanges(): void {
    this.citiesRank$ = this.statisticsService.getCitiesRank(this.jobs$);
  }
}
