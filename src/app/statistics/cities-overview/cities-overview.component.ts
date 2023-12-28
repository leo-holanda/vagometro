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
import { KeywordsRankComponent } from '../ranks/keywords-rank/keywords-rank.component';
import { Job } from 'src/app/job/job.model';
import { CitiesRankComponent } from '../ranks/cities-rank/cities-rank.component';

@Component({
  selector: 'vgm-cities-overview',
  standalone: true,
  imports: [
    CommonModule,
    BrazilMapComponent,
    KeywordsRankComponent,
    CitiesRankComponent,
  ],
  templateUrl: './cities-overview.component.html',
  styleUrls: ['./cities-overview.component.scss'],
})
export class CitiesOverviewComponent implements OnInit {
  typeRank$!: Observable<TypeData[]>;
  keywordsRank$!: Observable<KeywordData[]>;
  citiesRank$!: Observable<CityData[]>;
  jobsByState$!: Observable<Job[]>;

  selectedState: string = 'São Paulo';
  translations = translations;

  constructor(
    private jobService: JobService,
    private statisticsService: StatisticsService
  ) {}

  ngOnInit(): void {
    this.jobsByState$ = this.jobService.getJobsByState(this.selectedState);
    this.typeRank$ = this.statisticsService.getTypeRank(this.jobsByState$);
    this.citiesRank$ = this.statisticsService.getCitiesRank(this.jobsByState$);
  }

  onStateClicked(state: string): void {
    this.selectedState = state;
    this.jobsByState$ = this.jobService.getJobsByState(this.selectedState);

    this.typeRank$ = this.statisticsService.getTypeRank(this.jobsByState$);
    this.citiesRank$ = this.statisticsService.getCitiesRank(this.jobsByState$);
  }
}
