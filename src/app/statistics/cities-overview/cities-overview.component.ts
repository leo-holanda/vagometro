import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrazilMapComponent } from '../maps/brazil-map/brazil-map.component';
import { JobService } from 'src/app/job/job.service';
import { StatisticsService } from '../statistics.service';
import { TypeRankComponent } from '../ranks/type-rank/type-rank.component';
import { Observable } from 'rxjs';
import { TypeData } from '../ranks/type-rank/type-rank.model';
import { translations } from '../ranks/type-rank/type-rank.translations';
import { KeywordData } from '../ranks/keywords-rank/keywords-rank.model';
import { CityData } from '../ranks/cities-rank/cities-rank.model';

@Component({
  selector: 'vgm-cities-overview',
  standalone: true,
  imports: [CommonModule, BrazilMapComponent],
  templateUrl: './cities-overview.component.html',
  styleUrls: ['./cities-overview.component.scss'],
})
export class CitiesOverviewComponent implements OnInit {
  typeRank$!: Observable<TypeData[]>;
  keywordsRank$!: Observable<KeywordData[]>;
  citiesRank$!: Observable<CityData[]>;

  selectedState: string = 'São Paulo';
  translations = translations;

  constructor(
    private jobService: JobService,
    private statisticsService: StatisticsService
  ) {}

  ngOnInit(): void {
    const jobsByState = this.jobService.getJobsByState(this.selectedState);

    this.typeRank$ = this.statisticsService.getTypeRank(jobsByState);
    this.keywordsRank$ = this.statisticsService.getKeywordsRank(jobsByState);
    this.citiesRank$ = this.statisticsService.getCitiesRank(jobsByState);
  }

  onStateClicked(state: string): void {
    this.selectedState = state;
    const jobsByState = this.jobService.getJobsByState(this.selectedState);

    this.typeRank$ = this.statisticsService.getTypeRank(jobsByState);
    this.keywordsRank$ = this.statisticsService.getKeywordsRank(jobsByState);
    this.citiesRank$ = this.statisticsService.getCitiesRank(jobsByState);
  }
}
