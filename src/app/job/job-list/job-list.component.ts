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
import { Job } from '../job.model';
import { translations } from 'src/app/statistics/ranks/type-rank/type-rank.translations';
import { StateAbbreviationPipe } from 'src/app/shared/pipes/state-abbreviation.pipe';
import { ExperienceLevels } from 'src/app/statistics/ranks/experience-levels-rank/experience-levels-rank.model';
import { FormsModule } from '@angular/forms';
import { stringToBooleanMap } from './job-list.types';
import { trackByJobId } from 'src/app/shared/track-by-functions';

@Component({
  selector: 'vgm-job-list',
  standalone: true,
  imports: [CommonModule, StateAbbreviationPipe, FormsModule],
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.scss'],
})
export class JobListComponent implements OnInit, OnDestroy, OnChanges {
  @Input() jobs$!: Observable<Job[] | undefined>;
  jobs: Job[] | undefined = undefined;
  filteredJobs: Job[] | undefined = undefined;

  typeTranslations = translations;
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
        this.sortJobs('publishedDate');
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
        this.sortJobs('publishedDate');
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
          job.name.toLowerCase().includes(this.filters.jobTitle.toLowerCase())
        );
      }

      if (this.filters.companyName) {
        const filterCompanyName = this.filters.companyName.toLowerCase();
        this.filteredJobs = this.filteredJobs.filter((job) =>
          job.careerPageName.toLowerCase().includes(filterCompanyName)
        );
      }

      if (this.filters.experienceLevel) {
        this.filteredJobs = this.filteredJobs.filter(
          (job) => job.experienceLevel == this.filters.experienceLevel
        );
      }

      if (this.filters.workplaceType) {
        this.filteredJobs = this.filteredJobs.filter(
          (job) => job.workplaceType == this.filters.workplaceType
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
          (job) => job.type == this.filters.jobType
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

      if (this.filters.acceptsDisabledPersons != 'undefined') {
        this.filteredJobs = this.filteredJobs.filter((job) => {
          return (
            job.disabilities ==
            this.stringToBooleanMap[this.filters.acceptsDisabledPersons]
          );
        });
      }
    }
  }

  sortJobs(field: keyof Job): void {
    this.sortOrder = this.sortOrder == 'asc' ? 'desc' : 'asc';
    this.filteredJobs = this.filteredJobs?.sort((a, b) => {
      let valueA = a[field];
      let valueB = b[field];

      if (typeof valueA == 'string' && typeof valueB == 'string') {
        valueA = valueA.toString().toLowerCase();
        valueB = valueB.toString().toLowerCase();
      }

      if (valueA instanceof Date && valueB instanceof Date) {
        valueA = new Date(valueA).getTime();
        valueB = new Date(valueB).getTime();
      }

      if (a[field] == b[field]) return 0;
      if (this.sortOrder == 'asc') return a[field] > b[field] ? 1 : -1;
      return a[field] < b[field] ? 1 : -1;
    });
  }
}
