import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatisticsService } from '../../statistics.service';
import { CityData } from './cities-rank.model';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'vgm-cities-rank',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cities-rank.component.html',
  styleUrls: ['./cities-rank.component.scss'],
})
export class CitiesRankComponent implements OnInit {
  citiesRank!: Observable<CityData[]>;

  constructor(private statisticsService: StatisticsService) {}

  ngOnInit(): void {
    this.citiesRank = this.statisticsService
      .getCitiesRank()
      .pipe(map((citiesRank) => citiesRank.slice(0, 5)));
  }
}
