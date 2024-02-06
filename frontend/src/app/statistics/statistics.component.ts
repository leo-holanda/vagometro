import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobCountComponent } from './job-count/job-count.component';
import { CitiesRankComponent } from './ranks/cities-rank/cities-rank.component';
import { WorkplaceRankComponent } from './ranks/workplace-rank/workplace-rank.component';
import { TypeRankComponent } from './ranks/type-rank/type-rank.component';
import { CompaniesRankComponent } from './ranks/companies-rank/companies-rank.component';
import { PublicationChartComponent } from './charts/publication-chart/publication-chart.component';
import { KeywordsRankComponent } from './ranks/keywords-rank/keywords-rank.component';
import { RouterModule, RouterOutlet } from '@angular/router';
import { JobListComponent } from '../job/job-list/job-list.component';
import { JobService } from '../job/job.service';
import { Observable } from 'rxjs';
import { Job } from '../job/job.types';
import { ExperienceLevelsRankComponent } from './ranks/experience-levels-rank/experience-levels-rank.component';
import { DisabilityRankComponent } from './ranks/disability-rank/disability-rank.component';
import { EducationRankComponent } from './ranks/education-rank/education-rank.component';
import { LanguagesRankComponent } from './ranks/languages-rank/languages-rank.component';
import { MonthsRankComponent } from './ranks/months-rank/months-rank.component';
import { JobSourceSelectorComponent } from '../job-sources/job-source-selector/job-source-selector.component';
import { CountdownComponent } from '../shared/countdown/countdown.component';
import { HeaderComponent } from '../shared/header/header.component';

@Component({
  selector: 'vgm-statistics',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent,
    CountdownComponent,
    JobSourceSelectorComponent,
  ],
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss'],
})
export class StatisticsComponent {}
