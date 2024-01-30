import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, Subject, filter, takeUntil } from 'rxjs';
import { Job, WorkplaceTypes } from '../job.types';
import { gupyContractTypeMap } from 'src/app/statistics/ranks/type-rank/type-rank.translations';
import { StateAbbreviationPipe } from 'src/app/shared/pipes/state-abbreviation.pipe';
import { ExperienceLevels } from 'src/app/statistics/ranks/experience-levels-rank/experience-levels-rank.model';
import { FormsModule } from '@angular/forms';
import { stringToBooleanMap } from './job-list.types';
import { trackByJobId } from 'src/app/shared/track-by-functions';
import { ScrollingModule } from '@angular/cdk/scrolling';

@Component({
  selector: 'vgm-job-list',
  standalone: true,
  imports: [CommonModule, StateAbbreviationPipe, FormsModule, ScrollingModule],
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.scss'],
})
export class JobListComponent implements OnInit, OnDestroy, OnChanges {
  @Input() jobs$!: Observable<Job[] | undefined>;
  jobs: Job[] | undefined = undefined;
  filteredJobs: Job[] | undefined = undefined;

  gupyContractTypeMap = gupyContractTypeMap;
  experienceLevels = ExperienceLevels;

  filters = {
    jobTitle: '',
    companyName: '',
    experienceLevel: '',
    workplaceType: '',
    jobLocation: '',
    jobType: '',
    publishedDate: '',
    acceptsDisabledPersons: 'undefined',
  };

  sortIconShowMap = {
    jobTitle: false,
    companyName: false,
    experienceLevel: false,
    workplaceType: false,
    jobLocation: false,
    jobType: false,
    publishedDate: false,
    acceptsDisabledPersons: false,
  };

  inputMaxDate = new Date().toISOString().slice(0, 10);
  sortOrder: 'asc' | 'desc' = 'desc';
  trackByJobId = trackByJobId;

  private stringToBooleanMap: stringToBooleanMap = {
    true: true,
    false: false,
  };

  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.jobs$
      .pipe(
        filter((jobs) => jobs != undefined),
        takeUntil(this.destroy$)
      )
      .subscribe((jobs) => {
        this.jobs = jobs;
        this.filteredJobs = jobs;
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.jobs$
      .pipe(
        filter((jobs) => jobs != undefined),
        takeUntil(this.destroy$)
      )
      .subscribe((jobs) => {
        this.jobs = jobs;
        this.filteredJobs = jobs;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  filterJobs(): void {
    if (this.jobs) {
      this.filteredJobs = [...this.jobs];

      if (this.filters.jobTitle) {
        this.filteredJobs = this.filteredJobs.filter((job) =>
          job.title.toLowerCase().includes(this.filters.jobTitle.toLowerCase())
        );
      }

      if (this.filters.companyName) {
        const filterCompanyName = this.filters.companyName.toLowerCase();
        this.filteredJobs = this.filteredJobs.filter((job) =>
          job.companyName.toLowerCase().includes(filterCompanyName)
        );
      }

      if (this.filters.experienceLevel) {
        this.filteredJobs = this.filteredJobs.filter((job) =>
          job.experienceLevels.includes(
            this.filters.experienceLevel as ExperienceLevels
          )
        );
      }

      if (this.filters.workplaceType) {
        this.filteredJobs = this.filteredJobs.filter((job) =>
          job.workplaceTypes.includes(
            this.filters.workplaceType as WorkplaceTypes
          )
        );
      }

      if (this.filters.jobLocation) {
        this.filteredJobs = this.filteredJobs.filter(
          (job) =>
            job.city
              .toLowerCase()
              .includes(this.filters.jobLocation.toLowerCase()) ||
            job.state
              .toLowerCase()
              .includes(this.filters.jobLocation.toLowerCase())
        );
      }

      if (this.filters.jobType) {
        this.filteredJobs = this.filteredJobs.filter(
          (job) => job.contractType == this.filters.jobType
        );
      }

      if (this.filters.publishedDate != '') {
        this.filteredJobs = this.filteredJobs.filter((job) => {
          const jobPublishedDate = new Date(job.publishedDate).toDateString();

          const filterPublishedDate = new Date(
            this.filters.publishedDate + ' EDT'
          ).toDateString();

          return jobPublishedDate == filterPublishedDate;
        });
      }

      //TODO: Fix disability filter
    }
  }

  sortJobs(field: keyof Job): void {
    this.sortOrder = this.sortOrder == 'asc' ? 'desc' : 'asc';
    this.filteredJobs = this.filteredJobs?.sort((a, b) => {
      let valueA = a[field];
      let valueB = b[field];
      if (valueA == undefined || valueB == undefined) return 0;

      if (typeof valueA == 'string' && typeof valueB == 'string') {
        valueA = valueA.toString().toLowerCase();
        valueB = valueB.toString().toLowerCase();
      }

      if (valueA instanceof Date && valueB instanceof Date) {
        valueA = new Date(valueA).getTime();
        valueB = new Date(valueB).getTime();
      }

      if (valueA == valueB) return 0;
      if (this.sortOrder == 'asc') return valueA > valueB ? 1 : -1;
      return valueA < valueB ? 1 : -1;
    });
  }
}
