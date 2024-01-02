import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobCountComponent } from './job-count/job-count.component';
import { CitiesRankComponent } from './ranks/cities-rank/cities-rank.component';
import { WorkplaceRankComponent } from './ranks/workplace-rank/workplace-rank.component';
import { TypeRankComponent } from './ranks/type-rank/type-rank.component';
import { CompaniesRankComponent } from './ranks/companies-rank/companies-rank.component';
import { PublicationChartComponent } from './charts/publication-chart/publication-chart.component';
import { KeywordsRankComponent } from './ranks/keywords-rank/keywords-rank.component';
import { RouterModule } from '@angular/router';
import { JobListComponent } from '../job/job-list/job-list.component';
import { JobService } from '../job/job.service';
import { Observable } from 'rxjs';
import { Job } from '../job/job.model';
import { ExperienceLevelsRankComponent } from './ranks/experience-levels-rank/experience-levels-rank.component';

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
    KeywordsRankComponent,
    RouterModule,
    JobListComponent,
    ExperienceLevelsRankComponent,
  ],
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss'],
})
export class StatisticsComponent {
  jobs$!: Observable<Job[] | undefined>;

  constructor(private jobService: JobService) {
    this.jobs$ = jobService.jobs$;
  }
}
