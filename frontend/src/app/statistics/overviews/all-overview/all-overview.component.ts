import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { JobListComponent } from 'src/app/job/job-list/job-list.component';
import { PublicationChartComponent } from '../../charts/publication-chart/publication-chart.component';
import { JobCountComponent } from '../../job-count/job-count.component';
import { CitiesRankComponent } from '../../ranks/cities-rank/cities-rank.component';
import { CompaniesRankComponent } from '../../ranks/companies-rank/companies-rank.component';
import { DisabilityRankComponent } from '../../ranks/disability-rank/disability-rank.component';
import { EducationRankComponent } from '../../ranks/education-rank/education-rank.component';
import { ExperienceLevelsRankComponent } from '../../ranks/experience-levels-rank/experience-levels-rank.component';
import { KeywordsRankComponent } from '../../ranks/keywords-rank/keywords-rank.component';
import { LanguagesRankComponent } from '../../ranks/languages-rank/languages-rank.component';
import { MonthsRankComponent } from '../../ranks/months-rank/months-rank.component';
import { TypeRankComponent } from '../../ranks/type-rank/type-rank.component';
import { WorkplaceRankComponent } from '../../ranks/workplace-rank/workplace-rank.component';
import { Observable } from 'rxjs';
import { JobService } from 'src/app/job/job.service';
import { Job } from 'src/app/job/job.types';

@Component({
  selector: 'vgm-all-overview',
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
    DisabilityRankComponent,
    EducationRankComponent,
    LanguagesRankComponent,
    MonthsRankComponent,
  ],
  templateUrl: './all-overview.component.html',
  styleUrls: ['./all-overview.component.scss'],
})
export class AllOverviewComponent {
  jobs$!: Observable<Job[] | undefined>;

  constructor(private jobService: JobService) {
    this.jobs$ = jobService.jobs$;
  }
}
