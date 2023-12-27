import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobCountComponent } from './job-count/job-count.component';
import { CitiesRankComponent } from './cities-rank/cities-rank.component';
import { WorkplaceRankComponent } from './workplace-rank/workplace-rank.component';
import { TypeRankComponent } from './type-rank/type-rank.component';
import { CompaniesRankComponent } from './companies-rank/companies-rank.component';
import { PublicationChartComponent } from './charts/publication-chart/publication-chart.component';

@Component({
  selector: 'vgm-statistics',
  standalone: true,
  imports: [
    CommonModule,
    JobCountComponent,
    CitiesRankComponent,
    WorkplaceRankComponent,
    TypeRankComponent,
    CompaniesRankComponent,
    PublicationChartComponent,
  ],
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss'],
})
export class StatisticsComponent {}
