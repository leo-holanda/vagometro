import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobService } from 'src/app/job/job.service';
import { Observable } from 'rxjs';
import { Job } from 'src/app/job/job.model';
import { BrazilMapComponent } from '../../maps/brazil-map/brazil-map.component';
import { CitiesRankComponent } from '../../ranks/cities-rank/cities-rank.component';
import { CityData } from '../../ranks/cities-rank/cities-rank.model';
import { CompaniesRankComponent } from '../../ranks/companies-rank/companies-rank.component';
import { KeywordsRankComponent } from '../../ranks/keywords-rank/keywords-rank.component';
import { KeywordData } from '../../ranks/keywords-rank/keywords-rank.model';
import { TypeRankComponent } from '../../ranks/type-rank/type-rank.component';
import { TypeData } from '../../ranks/type-rank/type-rank.model';
import { translations } from '../../ranks/type-rank/type-rank.translations';

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

  constructor(private jobService: JobService) {}

  ngOnInit(): void {
    this.jobsByState$ = this.jobService.getJobsByState(this.selectedState);
  }

  onStateClicked(state: string): void {
    this.selectedState = state;
    this.jobsByState$ = this.jobService.getJobsByState(this.selectedState);
  }
}
