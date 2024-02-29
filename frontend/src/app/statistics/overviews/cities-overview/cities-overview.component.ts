import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobService } from 'src/app/job/job.service';
import { Observable } from 'rxjs';
import { Job } from 'src/app/job/job.types';
import { BrazilMapComponent } from '../../maps/brazil-map/brazil-map.component';
import { PublicationChartComponent } from '../../charts/publication-chart/publication-chart.component';
import { JobListComponent } from 'src/app/job/job-list/job-list.component';
import { StatisticsService } from '../../statistics.service';
import { StateAbbreviationPipe } from 'src/app/shared/pipes/state-abbreviation.pipe';
import { JobPostingsComparisonComponent } from '../../comparisons/job-postings-comparison/job-postings-comparison.component';
import { RankData, RankTypes } from '../../ranks/rank/rank.types';
import { trackByRankData } from 'src/app/shared/track-by-functions';
import { RankComponent } from '../../ranks/rank/rank.component';

@Component({
  selector: 'vgm-cities-overview',
  standalone: true,
  imports: [
    CommonModule,
    BrazilMapComponent,
    PublicationChartComponent,
    JobListComponent,
    StateAbbreviationPipe,
    JobPostingsComparisonComponent,
    RankComponent,
  ],
  templateUrl: './cities-overview.component.html',
  styleUrls: ['./cities-overview.component.scss'],
})
export class CitiesOverviewComponent implements OnInit {
  statesRank$!: Observable<RankData[]>;
  citiesRank$!: Observable<RankData[]>;

  jobsByState$!: Observable<Job[]>;
  jobsByCity$!: Observable<Job[]>;
  jobs$!: Observable<Job[]>;

  selectedState = 'São Paulo';
  selectedCity = 'São Paulo';

  jobsQuantity = 0;

  dataType: 'city' | 'state' | 'map' = 'city';
  trackByRankData = trackByRankData;
  rankTypes = RankTypes;

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
    });

    this.statesRank$.subscribe((statesRank) => {
      this.selectedState = statesRank[0].name;
      this.jobsByState$ = this.jobService.getJobsByState(this.selectedState);
    });

    this.statisticsService.getJobsCount().subscribe((count) => {
      this.jobsQuantity = count;
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
