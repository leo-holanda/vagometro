import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobListComponent } from '../../job-list/job-list.component';
import {
  BehaviorSubject,
  Observable,
  Subject,
  combineLatest,
  filter,
  map,
  startWith,
  takeUntil,
} from 'rxjs';
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
export class SearchResultsComponent implements OnInit, OnDestroy {
  @ViewChild('repostingsList') repostingsListModal: ElementRef | undefined;

  matchesMobileBreakpoint$: Observable<boolean>;
  selectedDataType: 'jobs' | 'stats' = 'jobs';
  rankTypes = RankTypes;

  allJobs$!: Observable<Job[]>;
  filteredJobs$!: Observable<Job[]>;
  jobInterationStatusChanged$ = new Subject<void>();
  selectedJobList$ = new BehaviorSubject<JobLists>(JobLists.TO_DECIDE);
  selectedJob!: Job;
  jobIndex = 0;
  isJobsListEmpty = false;
  jobsCount = 0;
  markedJobsCount = 0;
  jobLists = JobLists;
  repostingsFromSelectedJob: Job[] = [];

  sortedTechnologies: TechnologyData[] = [];
  today = new Date();
  searchData: SearchData | undefined;

  trackByJobId = trackByJobId;

  private destroy$ = new Subject<void>();

  constructor(
    private jobService: JobService,
    private easySearchService: EasySearchService,
    private windowResolutionObserver: WindowResolutionObserverService,
  ) {
    this.matchesMobileBreakpoint$ = this.windowResolutionObserver.matchesMobileBreakpoint();
    this.searchData = this.easySearchService.getSearchData();
  }

  ngOnInit(): void {
    this.allJobs$ = this.jobService.jobs$.pipe(
      filter((jobs): jobs is Job[] => jobs != undefined),
      map(this.easySearchService.filterJobsBySearchData),
      map(this.easySearchService.setJobsInteractionStatus),
      map(this.easySearchService.sortJobs),
      takeUntil(this.destroy$),
    );

    this.allJobs$.subscribe((jobs) => {
      // When the observable emits, the first job of the list is selected by default.
      this.jobIndex = 0;
      this.jobsCount = jobs.length;
    });

    this.filteredJobs$ = combineLatest([
      this.allJobs$,
      this.selectedJobList$,
      this.jobInterationStatusChanged$.pipe(startWith(null)),
    ]).pipe(
      map(([jobs, selectedJobList]) => {
        this.easySearchService.saveMarkedJobsOnLocalStorage(jobs);
        return this.easySearchService.filterJobsByListType(jobs, selectedJobList);
      }),
      takeUntil(this.destroy$),
    );

    this.filteredJobs$.subscribe((jobs) => {
      this.isJobsListEmpty = jobs.length === 0;
      const index = Math.min(this.jobIndex, jobs.length - 1);
      this.selectJob(jobs[index], index);
    });

    combineLatest([this.allJobs$, this.jobInterationStatusChanged$.pipe(startWith(null))])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([jobs, _]) => {
        const jobsToDecide = this.easySearchService.filterJobsByListType(jobs, JobLists.TO_DECIDE);
        this.markedJobsCount = this.jobsCount - jobsToDecide.length;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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
    if (this.selectedJob.interactionStatus.discarded)
      this.easySearchService.removeFromMarkedJobs(this.selectedJob.id, JobLists.DISCARDED);

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
    if (this.selectedJob.interactionStatus.applied)
      this.easySearchService.removeFromMarkedJobs(this.selectedJob.id, JobLists.APPLIED);

    this.selectedJob.interactionStatus.discarded = true;
    this.selectedJob.interactionStatus.applied = false;
    this.jobInterationStatusChanged$.next();
  }

  setJobsListType(type: JobLists): void {
    this.jobIndex = 0;
    this.selectedJobList$.next(type);
  }

  openRepostingsDialog(job: Job): void {
    this.repostingsFromSelectedJob = job.repostings;
    if (this.repostingsListModal) this.repostingsListModal.nativeElement.showModal();
  }
}
