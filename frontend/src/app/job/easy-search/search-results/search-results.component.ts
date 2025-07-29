import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobListComponent } from '../../job-list/job-list.component';
import { BehaviorSubject, Observable, Subject, combineLatest, filter, map, startWith } from 'rxjs';
import { Job, JobLists } from '../../job.types';
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
import { ScrollingModule } from '@angular/cdk/scrolling';
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

  filteredJobs$!: Observable<Job[]>;
  selectedJob!: Job;
  jobIndex = 0;
  isJobsListEmpty = false;
  jobsCount = 0;
  markedJobsCount = 0;

  rankTypes = RankTypes;
  sortedTechnologies: TechnologyData[] = [];
  today = new Date();

  searchData: SearchData | undefined;

  selectedJobList$ = new BehaviorSubject<JobLists>(JobLists.TO_DECIDE);
  jobLists = JobLists;

  jobInterationStatusChanged$ = new Subject<void>();

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
    const jobs$ = this.jobService.jobs$.pipe(
      filter((jobs): jobs is Job[] => jobs != undefined),
      map(this.easySearchService.filterJobsBySearchData),
      map(this.easySearchService.sortByMatchPercentage),
    );

    jobs$.subscribe((jobs) => {
      // When the observable emits, the first job of the list is selected by default.
      this.jobIndex = 0;
      this.jobsCount = jobs.length;
    });

    this.filteredJobs$ = combineLatest([
      jobs$,
      this.selectedJobList$,
      this.jobInterationStatusChanged$.pipe(startWith(null)),
    ]).pipe(
      map(([jobs, selectedJobList]) =>
        this.easySearchService.filterJobsByListType(jobs, selectedJobList),
      ),
    );

    this.filteredJobs$.subscribe((jobs) => {
      this.isJobsListEmpty = jobs.length === 0;
      const index = Math.min(this.jobIndex, jobs.length - 1);
      this.selectJob(jobs[index], index);
    });

    combineLatest([jobs$, this.jobInterationStatusChanged$.pipe(startWith(null))]).subscribe(
      ([jobs, _]) => {
        const jobsToDecide = this.easySearchService.filterJobsByListType(jobs, JobLists.TO_DECIDE);
        this.markedJobsCount = this.jobsCount - jobsToDecide.length;
      },
    );
  }

  selectJob(job: Job, index: number): void {
    this.sortedTechnologies = [...job.keywords].sort((a, b) =>
      a.matchesSearchParameters ? -1 : 1,
    );
    this.selectedJob = job;
    this.jobIndex = index;
    this.setJobAsViewed();
  }

  setDataType(dataType: 'jobs' | 'stats'): void {
    this.selectedDataType = dataType;
  }

  setJobAsApplied(): void {
    this.selectedJob.interactionStatus.applied = true;
    this.selectedJob.interactionStatus.discarded = false;
    this.jobInterationStatusChanged$.next();
  }

  setJobAsAccessed(): void {
    this.selectedJob.interactionStatus.accessed = true;
  }

  setJobAsViewed(): void {
    this.selectedJob.interactionStatus.viewed = true;
  }

  setJobAsDiscarded(): void {
    this.selectedJob.interactionStatus.discarded = true;
    this.selectedJob.interactionStatus.applied = false;
    this.jobInterationStatusChanged$.next();
  }

  setJobsListType(type: JobLists): void {
    this.jobIndex = 0;
    this.selectedJobList$.next(type);
  }
}
