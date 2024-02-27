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

@Component({
  selector: 'vgm-search-results',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    JobListComponent,
    ExperienceLevelsRankComponent,
    PublicationChartComponent,
    JobPostingsComparisonComponent,
    WorkplaceRankComponent,
    KeywordsRankComponent,
    CompaniesRankComponent,
    TypeRankComponent,
    InclusionRankComponent,
    CitiesRankComponent,
    EducationRankComponent,
    MonthsRankComponent,
    LanguagesRankComponent,
    CertificationsRankComponent,
  ],
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss'],
})
export class SearchResultsComponent {
  selectedDataType: 'jobs' | 'stats' = 'jobs';

  private searchData!: SearchData;

  jobs$: Observable<Job[]>;

  constructor(private jobService: JobService) {
    const data = localStorage.getItem('searchData');
    if (data) {
      this.searchData = JSON.parse(data);
      this.jobs$ = this.getJobsFromSearch();
    } else {
      this.jobs$ = new Observable();
    }
  }

  setDataType(dataType: 'jobs' | 'stats'): void {
    this.selectedDataType = dataType;
  }

  private setMatchPercentage(job: Job): Job {
    const searchDataKeywords = this.searchData.keywords.map((keyword) => keyword.name);

    const matchedKeywords = job.keywords.filter((keyword) =>
      searchDataKeywords.includes(keyword.name),
    );

    const matchedExperienceLevels = job.experienceLevels.filter((experienceLevel) =>
      this.searchData.experienceLevels.includes(experienceLevel),
    );

    const howManyItemsWereMatched = matchedKeywords.length + matchedExperienceLevels.length;
    const howManyItemsWereSelected =
      searchDataKeywords.length + this.searchData.experienceLevels.length;

    job.matchPercentage = (howManyItemsWereMatched / howManyItemsWereSelected) * 100;
    return job;
  }

  private sortJobs(jobs: Job[]): void {
    jobs.sort((a, b) => {
      if (a.matchPercentage && b.matchPercentage) {
        return a.matchPercentage > b.matchPercentage ? -1 : 1;
      }

      return 0;
    });
  }

  private getJobsFromSearch(): Observable<Job[]> {
    const keywords = this.searchData.keywords.map((keyword) => keyword.name);

    return this.jobService.jobs$.pipe(
      filter((jobs): jobs is Job[] => jobs != undefined),
      map((jobs) => this.jobService.filterJobsByKeywords(keywords, jobs)),
      map((jobs) => jobs.map((job) => this.setMatchPercentage(job))),
      tap((jobs) => this.sortJobs(jobs)),
    );
  }
}
