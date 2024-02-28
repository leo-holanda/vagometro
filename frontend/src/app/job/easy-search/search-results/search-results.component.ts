import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchData } from '../easy-search.types';
import { JobListComponent } from '../../job-list/job-list.component';
import { Observable, filter, map, tap } from 'rxjs';
import { Job } from '../../job.types';
import { JobService } from '../../job.service';
import { ExperienceLevelsRankComponent } from 'src/app/statistics/ranks/experience-levels-rank/experience-levels-rank.component';
import { PublicationChartComponent } from 'src/app/statistics/charts/publication-chart/publication-chart.component';
import { JobPostingsComparisonComponent } from 'src/app/statistics/comparisons/job-postings-comparison/job-postings-comparison.component';
import { RouterModule } from '@angular/router';
import { WorkplaceRankComponent } from 'src/app/statistics/ranks/workplace-rank/workplace-rank.component';
import { KeywordsRankComponent } from 'src/app/statistics/ranks/keywords-rank/keywords-rank.component';
import { CompaniesRankComponent } from 'src/app/statistics/ranks/companies-rank/companies-rank.component';
import { TypeRankComponent } from 'src/app/statistics/ranks/type-rank/type-rank.component';
import { InclusionRankComponent } from 'src/app/statistics/ranks/inclusion-rank/inclusion-rank.component';
import { CitiesRankComponent } from 'src/app/statistics/ranks/cities-rank/cities-rank.component';
import { EducationRankComponent } from 'src/app/statistics/ranks/education-rank/education-rank.component';
import { MonthsRankComponent } from 'src/app/statistics/ranks/months-rank/months-rank.component';
import { LanguagesRankComponent } from 'src/app/statistics/ranks/languages-rank/languages-rank.component';
import { CertificationsRankComponent } from 'src/app/statistics/ranks/certifications-rank/certifications-rank.component';
import { RankComponent } from 'src/app/statistics/ranks/rank/rank.component';
import { RankTypes } from 'src/app/statistics/ranks/rank/rank.types';

@Component({
  selector: 'vgm-search-results',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    JobListComponent,
    PublicationChartComponent,
    JobPostingsComparisonComponent,
    RankComponent,
  ],
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss'],
})
export class SearchResultsComponent {
  selectedDataType: 'jobs' | 'stats' = 'jobs';

  jobs$: Observable<Job[]>;

  rankTypes = RankTypes;

  constructor(private jobService: JobService) {
    this.jobs$ = this.jobService.jobs$.pipe(filter((jobs): jobs is Job[] => jobs != undefined));
  }

  setDataType(dataType: 'jobs' | 'stats'): void {
    this.selectedDataType = dataType;
  }
}
