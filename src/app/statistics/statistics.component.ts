import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobCountComponent } from './job-count/job-count.component';
import { CitiesRankComponent } from './cities-rank/cities-rank.component';
import { WorkplaceRankComponent } from './workplace-rank/workplace-rank.component';
import { TypeRankComponent } from './type-rank/type-rank.component';

@Component({
  selector: 'vgm-statistics',
  standalone: true,
  imports: [
    CommonModule,
    JobCountComponent,
    CitiesRankComponent,
    WorkplaceRankComponent,
    TypeRankComponent,
  ],
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss'],
})
export class StatisticsComponent {}
