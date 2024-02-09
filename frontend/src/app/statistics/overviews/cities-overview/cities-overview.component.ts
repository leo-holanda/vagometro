import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobService } from 'src/app/job/job.service';
import { Observable } from 'rxjs';
import { Job } from 'src/app/job/job.types';
import { BrazilMapComponent } from '../../maps/brazil-map/brazil-map.component';
import { CitiesRankComponent } from '../../ranks/cities-rank/cities-rank.component';
import { CityData, StateData } from '../../ranks/cities-rank/cities-rank.model';
import { CompaniesRankComponent } from '../../ranks/companies-rank/companies-rank.component';
import { KeywordsRankComponent } from '../../ranks/keywords-rank/keywords-rank.component';
import { KeywordData } from '../../ranks/keywords-rank/keywords-rank.model';
import { TypeRankComponent } from '../../ranks/type-rank/type-rank.component';
import { TypeData } from '../../ranks/type-rank/type-rank.model';
import { PublicationChartComponent } from '../../charts/publication-chart/publication-chart.component';
import { JobListComponent } from 'src/app/job/job-list/job-list.component';
import { ExperienceLevelsRankComponent } from '../../ranks/experience-levels-rank/experience-levels-rank.component';
import { trackByCity, trackByState } from 'src/app/shared/track-by-functions';
import { StatisticsService } from '../../statistics.service';
import { StateAbbreviationPipe } from 'src/app/shared/pipes/state-abbreviation.pipe';
import { EducationRankComponent } from '../../ranks/education-rank/education-rank.component';
import { LanguagesRankComponent } from '../../ranks/languages-rank/languages-rank.component';
import { JobPostingsComparisonComponent } from '../../comparisons/job-postings-comparison/job-postings-comparison.component';

@Component({
  selector: 'vgm-cities-overview',
  standalone: true,
  imports: [
    CommonModule,
    BrazilMapComponent,
    KeywordsRankComponent,
    CitiesRankComponent,
    CompaniesRankComponent,
    TypeRankComponent,
    PublicationChartComponent,
    JobListComponent,
    ExperienceLevelsRankComponent,
    StateAbbreviationPipe,
    EducationRankComponent,
    LanguagesRankComponent,
    JobPostingsComparisonComponent,
  ],
  templateUrl: './cities-overview.component.html',
  styleUrls: ['./cities-overview.component.scss'],
})
export class CitiesOverviewComponent implements OnInit {
  typeRank$!: Observable<TypeData[]>;
  keywordsRank$!: Observable<KeywordData[]>;

  statesRank$!: Observable<StateData[]>;
  citiesRank$!: Observable<CityData[]>;

  jobsByState$!: Observable<Job[]>;
  jobsByCity$!: Observable<Job[]>;
  jobs$!: Observable<Job[]>;

  selectedState = 'São Paulo';
  selectedCity = 'São Paulo';

  citiesQuantity = 0;
  statesQuantity = 0;

  dataType: 'city' | 'state' | 'map' = 'city';
  trackByCity = trackByCity;
  trackByState = trackByState;

  dataTypeTranslations = {
    city: 'cidade',
    state: 'estado',
    map: 'estado',
  };

  constructor(
    private jobService: JobService,
    private statisticsService: StatisticsService,
  ) {}

  ngOnInit(): void {
    this.citiesRank$ = this.statisticsService.getCitiesRank();
    this.statesRank$ = this.statisticsService.getStatesRank();

    this.citiesRank$.subscribe((citiesRank) => {
      this.selectedCity = citiesRank[0].name;
      this.jobsByCity$ = this.jobService.getJobsByCity(this.selectedCity);
      this.citiesQuantity = citiesRank.reduce((acc, cityData) => acc + cityData.count, 0);
    });

    this.statesRank$.subscribe((statesRank) => {
      this.selectedState = statesRank[0].name;
      this.jobsByState$ = this.jobService.getJobsByState(this.selectedState);
      this.statesQuantity = statesRank.reduce((acc, stateData) => acc + stateData.count, 0);
    });
  }

  onStateClicked(state: string): void {
    this.selectedState = state;
    this.jobsByState$ = this.jobService.getJobsByState(this.selectedState);
  }

  onCityClicked(city: string): void {
    this.selectedCity = city;
    this.jobsByCity$ = this.jobService.getJobsByCity(this.selectedCity);
  }

  changeDataType(dataType: 'city' | 'state' | 'map'): void {
    this.dataType = dataType;

    if (this.dataType == 'city') {
      this.jobs$ = this.jobsByCity$;
    }

    if (dataType == 'map' || dataType == 'state') {
      this.jobs$ = this.jobsByState$;
    }
  }
}
