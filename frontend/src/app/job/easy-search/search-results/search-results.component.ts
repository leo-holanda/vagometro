import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobListComponent } from '../../job-list/job-list.component';
import { Observable, filter, map } from 'rxjs';
import { Job } from '../../job.types';
import { JobService } from '../../job.service';
import { PublicationChartComponent } from 'src/app/statistics/charts/publication-chart/publication-chart.component';
import { JobPostingsComparisonComponent } from 'src/app/statistics/comparisons/job-postings-comparison/job-postings-comparison.component';
import { RouterModule } from '@angular/router';
import { RankComponent } from 'src/app/statistics/rank/rank.component';
import { RankTypes } from 'src/app/statistics/rank/rank.types';
import { MatchesChartComponent } from 'src/app/statistics/charts/matches-chart/matches-chart.component';
import { EasySearchService } from '../easy-search.service';

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
    MatchesChartComponent,
  ],
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss'],
})
export class SearchResultsComponent implements OnInit {
  selectedDataType: 'jobs' | 'stats' = 'jobs';

  jobs$!: Observable<Job[]>;

  rankTypes = RankTypes;

  constructor(
    private jobService: JobService,
    private easySearchService: EasySearchService,
  ) {}

  ngOnInit(): void {
    this.jobs$ = this.jobService.jobs$.pipe(
      filter((jobs): jobs is Job[] => jobs != undefined),
      map(this.filterJobsBySearchData),
    );
  }

  setDataType(dataType: 'jobs' | 'stats'): void {
    this.selectedDataType = dataType;
  }

  //TODO: Move this to jobService
  private filterJobsBySearchData = (jobs: Job[]): Job[] => {
    const searchData = this.easySearchService.getSearchData();
    if (!searchData) return jobs;

    return jobs.filter((job) => {
      if (searchData.experienceLevels.length > 0) {
        const hasExperienceLevel = job.experienceLevels.some((experienceLevel) =>
          searchData.experienceLevels.includes(experienceLevel),
        );
        if (!hasExperienceLevel) return false;
      }

      if (searchData.workplaceTypes.length > 0) {
        const hasWorkPlaceType = job.workplaceTypes.some((workplaceType) =>
          searchData.workplaceTypes.includes(workplaceType),
        );
        if (!hasWorkPlaceType) return false;
      }

      if (searchData.keywords.length > 0) {
        const hasKeywords = job.keywords.some((keyword) => {
          const keywordsName = searchData.keywords.map((keyword) => keyword.name);
          return keywordsName.includes(keyword.name);
        });
        if (!hasKeywords) return false;
      }

      if (searchData.contractTypes.length > 0) {
        const hasContractTypes = job.contractTypes.some((contractType) =>
          searchData.contractTypes.includes(contractType),
        );
        if (!hasContractTypes) return false;
      }

      if (searchData.inclusionTypes.length > 0) {
        const hasInclusionTypes = job.inclusionTypes.some((inclusionType) =>
          searchData.inclusionTypes.includes(inclusionType),
        );
        if (!hasInclusionTypes) return false;
      }

      return true;
    });
  };
}
