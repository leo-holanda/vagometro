import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobListComponent } from '../../job-list/job-list.component';
import { Observable, Subject, combineLatest, filter, map, tap } from 'rxjs';
import { Job } from '../../job.types';
import { JobService } from '../../job.service';
import { PublicationChartComponent } from 'src/app/statistics/charts/publication-chart/publication-chart.component';
import { JobPostingsComparisonComponent } from 'src/app/statistics/comparisons/job-postings-comparison/job-postings-comparison.component';
import { RouterModule } from '@angular/router';
import { RankComponent } from 'src/app/statistics/rank/rank.component';
import { RankTypes } from 'src/app/statistics/rank/rank.types';
import { MatchesChartComponent } from 'src/app/statistics/charts/matches-chart/matches-chart.component';
import { EasySearchService } from '../easy-search.service';
import { WindowResolutionObserverService } from 'src/app/shared/window-resolution-observer.service';
import { StateAbbreviationPipe } from 'src/app/shared/pipes/state-abbreviation.pipe';
import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling';
import { trackByJobId } from 'src/app/shared/track-by-functions';
import { TimeAgoPipe } from 'src/app/shared/pipes/time-ago.pipe';
import { TechnologyData } from 'src/app/shared/keywords-matcher/technologies.data';
import { SearchData } from '../easy-search.types';

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
    StateAbbreviationPipe,
    ScrollingModule,
    TimeAgoPipe,
  ],
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss'],
})
export class SearchResultsComponent implements OnInit {
  matchesMobileBreakpoint$: Observable<boolean>;
  selectedDataType: 'jobs' | 'stats' = 'jobs';

  jobs$!: Observable<Job[]>;
  selectedJob!: Job;

  rankTypes = RankTypes;
  searchedKeywords: string[] = [];
  sortedKeywords: TechnologyData[] = [];
  today = new Date();

  searchData: SearchData | undefined;

  trackByJobId = trackByJobId;

  constructor(
    private jobService: JobService,
    private easySearchService: EasySearchService,
    private windowResolutionObserver: WindowResolutionObserverService,
  ) {
    this.matchesMobileBreakpoint$ = this.windowResolutionObserver.matchesMobileBreakpoint();
    this.searchData = this.easySearchService.getSearchData();
  }

  ngOnInit(): void {
    this.jobs$ = this.jobService.jobs$.pipe(
      filter((jobs): jobs is Job[] => jobs != undefined),
      map(this.filterJobsBySearchData),
    );

    this.jobs$.subscribe((jobs) => {
      this.selectJob(jobs[0]);
    });
  }

  selectJob(job: Job): void {
    this.selectedJob = job;
    this.sortedKeywords = [...job.keywords].sort((a, b) => (a.matchesSearchParameters ? -1 : 1));
  }

  setDataType(dataType: 'jobs' | 'stats'): void {
    this.selectedDataType = dataType;
  }

  setJobAsApplied(): void {
    this.selectedJob.interactionStatus.applied = true;
  }

  setJobAsViewed(): void {
    this.selectedJob.interactionStatus.viewed = true;
  }

  setJobAsDiscarded(): void {
    this.selectedJob.interactionStatus.discarded = true;
  }

  //TODO: Move this to jobService
  private filterJobsBySearchData = (jobs: Job[]): Job[] => {
    const searchData = this.easySearchService.getSearchData();
    this.searchedKeywords = searchData?.technologies.map((keyword) => keyword.name) || [];
    if (!searchData) return jobs;

    return jobs.filter((job) => {
      if (searchData.experienceLevels.length > 0) {
        const hasExperienceLevel = job.experienceLevels.some((experienceLevel) =>
          searchData.experienceLevels.includes(experienceLevel.name),
        );
        if (!hasExperienceLevel) return false;
      }

      if (searchData.workplaceTypes.length > 0) {
        const hasWorkPlaceType = job.workplaceTypes.some((workplaceType) =>
          searchData.workplaceTypes.includes(workplaceType.type),
        );
        if (!hasWorkPlaceType) return false;
      }

      if (searchData.technologies.length > 0) {
        const hasKeywords = job.keywords.some((keyword) => {
          const keywordsName = searchData.technologies.map((keyword) => keyword.name);
          return keywordsName.includes(keyword.name);
        });
        if (!hasKeywords) return false;
      }

      if (searchData.contractTypes.length > 0) {
        const hasContractTypes = job.contractTypes.some((contractType) =>
          searchData.contractTypes.includes(contractType.type),
        );
        if (!hasContractTypes) return false;
      }

      if (searchData.inclusionTypes.length > 0) {
        const hasInclusionTypes = job.inclusionTypes.some((inclusionType) =>
          searchData.inclusionTypes.includes(inclusionType.type),
        );
        if (!hasInclusionTypes) return false;
      }

      return true;
    });
  };
}
