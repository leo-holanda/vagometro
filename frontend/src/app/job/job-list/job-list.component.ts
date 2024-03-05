import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, Subject, filter, takeUntil } from 'rxjs';
import { StateAbbreviationPipe } from 'src/app/shared/pipes/state-abbreviation.pipe';
import { FormsModule } from '@angular/forms';
import { trackByJobId } from 'src/app/shared/track-by-functions';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { Filter } from './job-list.types';
import { ContractTypes } from 'src/app/shared/keywords-matcher/contract-types.data';
import { WorkplaceTypes } from 'src/app/shared/keywords-matcher/workplace.data';
import { Job } from '../job.types';
import { ExperienceLevels } from 'src/app/shared/keywords-matcher/experience-levels.data';
import { InclusionTypes } from 'src/app/shared/keywords-matcher/inclusion.data';
import { RouterLink } from '@angular/router';
import { RepostingsTimespanPipe } from 'src/app/shared/pipes/repostings-timespan.pipe';

@Component({
  selector: 'vgm-job-list',
  standalone: true,
  imports: [
    CommonModule,
    StateAbbreviationPipe,
    FormsModule,
    ScrollingModule,
    RouterLink,
    RepostingsTimespanPipe,
  ],
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.scss'],
})
export class JobListComponent implements OnInit, OnDestroy, OnChanges {
  @Input() jobs$!: Observable<Job[] | undefined>;
  @Input() sortBy: keyof Filter | undefined;
  @Input() sortOrder: 'asc' | 'desc' = 'desc';

  pristineJobs: Job[] = [];
  filteredJobs: Job[] = [];
  repostingsFromSelectedJob: Job[] = [];

  contractTypes = ContractTypes;
  experienceLevels = ExperienceLevels;
  workplaceTypes = WorkplaceTypes;
  inclusionTypes = InclusionTypes;

  filters: Filter = {
    jobTitle: undefined,
    companyName: undefined,
    experienceLevel: undefined,
    workplaceTypes: undefined,
    jobLocation: undefined,
    jobContractType: undefined,
    publishedDate: undefined,
    inclusionType: undefined,
    matchPercentage: 0,
    repostings: 0,
  };

  today = new Date();
  inputMaxDate = new Date().toISOString().slice(0, 10);

  trackByJobId = trackByJobId;

  @ViewChild('repostingsList') duplcatesListModal: ElementRef | undefined;

  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.jobs$
      .pipe(
        filter((jobs): jobs is Job[] => jobs != undefined),
        takeUntil(this.destroy$),
      )
      .subscribe((jobs) => {
        this.pristineJobs = jobs;
        this.filteredJobs = jobs;
        this.sortJobs();
      });
  }

  ngOnChanges(): void {
    this.jobs$
      .pipe(
        filter((jobs): jobs is Job[] => jobs != undefined),
        takeUntil(this.destroy$),
      )
      .subscribe((jobs) => {
        this.pristineJobs = jobs;
        this.filteredJobs = jobs;
        this.sortJobs();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  filterJobs(): void {
    this.filteredJobs = [...this.pristineJobs];

    const jobTitleFilterValue = this.filters['jobTitle'];
    if (jobTitleFilterValue) {
      this.filteredJobs = this.filteredJobs.filter((job) =>
        job.title.toLowerCase().includes(jobTitleFilterValue.toLowerCase()),
      );
    }

    if (this.filters['companyName']) {
      const filterCompanyName = this.filters['companyName'].toLowerCase();
      this.filteredJobs = this.filteredJobs.filter((job) =>
        job.companyName.toLowerCase().includes(filterCompanyName),
      );
    }

    if (this.filters['experienceLevel']) {
      this.filteredJobs = this.filteredJobs.filter((job) =>
        job.experienceLevels.includes(this.filters['experienceLevel'] as ExperienceLevels),
      );
    }

    if (this.filters['workplaceTypes']) {
      this.filteredJobs = this.filteredJobs.filter((job) =>
        job.workplaceTypes.includes(this.filters['workplaceTypes'] as WorkplaceTypes),
      );
    }

    const jobLocationFilterValue = this.filters['jobLocation'];
    if (jobLocationFilterValue) {
      this.filteredJobs = this.filteredJobs.filter(
        (job) =>
          job.city.toLowerCase().includes(jobLocationFilterValue.toLowerCase()) ||
          job.state.toLowerCase().includes(jobLocationFilterValue.toLowerCase()),
      );
    }

    if (this.filters['jobContractType']) {
      this.filteredJobs = this.filteredJobs.filter((job) =>
        job.contractTypes.includes(this.filters['jobContractType'] as ContractTypes),
      );
    }

    if (this.filters['publishedDate']) {
      this.filteredJobs = this.filteredJobs.filter((job) => {
        const jobPublishedDate = job.publishedDate.toDateString();

        const filterPublishedDate = new Date(this.filters['publishedDate'] + ' EDT').toDateString();

        return jobPublishedDate == filterPublishedDate;
      });
    }

    if (this.filters['inclusionType']) {
      this.filteredJobs = this.filteredJobs.filter((job) =>
        job.inclusionTypes.includes(this.filters['inclusionType'] as InclusionTypes),
      );
    }

    const matchPercentageFilterValue = this.filters['matchPercentage'];
    if (matchPercentageFilterValue) {
      this.filteredJobs = this.filteredJobs.filter((job) => {
        if (job.matchPercentage == undefined) return true;
        return job.matchPercentage >= matchPercentageFilterValue;
      });
    }

    const repostingsFilterValue = this.filters['repostings'];
    if (repostingsFilterValue) {
      this.filteredJobs = this.filteredJobs.filter((job) => {
        if (job.repostings == undefined) return true;
        return job.repostings.length >= repostingsFilterValue;
      });
    }
  }

  sortJobs(): void {
    if (this.sortBy == undefined || this.sortOrder == undefined) return;

    this.filteredJobs.sort((a, b) => {
      let valueA = a[this.sortBy as keyof Job];
      let valueB = b[this.sortBy as keyof Job];

      if (valueA == undefined || valueB == undefined) return 0;

      if (typeof valueA == 'string' && typeof valueB == 'string') {
        valueA = valueA.toString().toLowerCase();
        valueB = valueB.toString().toLowerCase();
      }

      if (valueA instanceof Date && valueB instanceof Date) {
        valueA = new Date(valueA).getTime();
        valueB = new Date(valueB).getTime();
      }

      if (valueA == valueB) {
        if (this.sortOrder == 'asc') return a.publishedDate > b.publishedDate ? 1 : -1;
        return a.publishedDate < b.publishedDate ? 1 : -1;
      }

      if (this.sortOrder == 'asc') return valueA > valueB ? 1 : -1;
      return valueA < valueB ? 1 : -1;
    });

    this.filteredJobs = [...this.filteredJobs];
  }

  openRepostingsDialog(job: Job): void {
    this.repostingsFromSelectedJob = job.repostings;
    if (this.duplcatesListModal) this.duplcatesListModal.nativeElement.showModal();
  }
}
