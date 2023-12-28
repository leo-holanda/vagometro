import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrazilMapComponent } from '../maps/brazil-map/brazil-map.component';
import { JobService } from 'src/app/job/job.service';
import { StatisticsService } from '../statistics.service';
import { TypeRankComponent } from '../ranks/type-rank/type-rank.component';
import { Observable } from 'rxjs';
import { TypeData } from '../ranks/type-rank/type-rank.model';
import { translations } from '../ranks/type-rank/type-rank.translations';

@Component({
  selector: 'vgm-cities-overview',
  standalone: true,
  imports: [CommonModule, BrazilMapComponent],
  templateUrl: './cities-overview.component.html',
  styleUrls: ['./cities-overview.component.scss'],
})
export class CitiesOverviewComponent implements OnInit {
  selectedState: string = 'São Paulo';
  typeRank$!: Observable<TypeData[]>;
  translations = translations;

  constructor(
    private jobService: JobService,
    private statisticsService: StatisticsService
  ) {}

  ngOnInit(): void {
    this.typeRank$ = this.statisticsService.getTypeRank(
      this.jobService.getJobsByState(this.selectedState)
    );
  }

  onStateClicked(state: string): void {
    this.selectedState = state;
    this.typeRank$ = this.statisticsService.getTypeRank(
      this.jobService.getJobsByState(this.selectedState)
    );
  }
}
