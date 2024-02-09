import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, Subject, filter, takeUntil } from 'rxjs';
import { ContractTypes, Job, WorkplaceTypes } from '../job.types';
import { StateAbbreviationPipe } from 'src/app/shared/pipes/state-abbreviation.pipe';
import { ExperienceLevels } from 'src/app/statistics/ranks/experience-levels-rank/experience-levels-rank.model';
import { FormsModule } from '@angular/forms';
import { trackByJobId } from 'src/app/shared/track-by-functions';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { DisabilityStatuses } from 'src/app/statistics/ranks/disability-rank/disability-rank.model';
import { Filter } from './job-list.types';

@Component({
  selector: 'vgm-job-list',
  standalone: true,
  imports: [CommonModule, StateAbbreviationPipe, FormsModule, ScrollingModule],
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.scss'],
})
export class JobListComponent implements OnInit, OnDestroy, OnChanges {
  @Input() jobs$!: Observable<Job[] | undefined>;
  pristineJobs: Job[] = [];
  filteredJobs: Job[] = [];

  contractTypes = ContractTypes;
  experienceLevels = ExperienceLevels;
  workplaceTypes = WorkplaceTypes;
  disabilityStatuses = DisabilityStatuses;

  filters: Filter = {
    jobTitle: undefined,
    companyName: undefined,
    experienceLevel: undefined,
    workplaceType: undefined,
    jobLocation: undefined,
    jobContractType: undefined,
    publishedDate: undefined,
    disabilityStatus: undefined,
  };

  inputMaxDate = new Date().toISOString().slice(0, 10);

  dataToSort: keyof Job | undefined;
  sortOrder: 'asc' | 'desc' = 'desc';
  trackByJobId = trackByJobId;

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
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  filterJobs(): void {
    this.filteredJobs = [...this.pristineJobs];
    console.log(this.filters);
    if (this.filters['jobTitle']) {
      console.log('title');
      this.filteredJobs = this.filteredJobs.filter((job) =>
        job.title
          .toLowerCase()
          .includes(this.filters['jobTitle']!.toLowerCase()),
      );
    }

    if (this.filters['companyName']) {
      console.log('companyName');

      const filterCompanyName = this.filters['companyName'].toLowerCase();
      this.filteredJobs = this.filteredJobs.filter((job) =>
        job.companyName.toLowerCase().includes(filterCompanyName),
      );
    }

    if (this.filters['experienceLevel']) {
      console.log('experienceLevel');
      this.filteredJobs = this.filteredJobs.filter((job) =>
        job.experienceLevels.includes(
          this.filters['experienceLevel']! as ExperienceLevels,
        ),
      );
    }

    if (this.filters['workplaceType']) {
      console.log('workplaceType');
      this.filteredJobs = this.filteredJobs.filter((job) =>
        job.workplaceTypes.includes(
          this.filters['workplaceType'] as WorkplaceTypes,
        ),
      );
    }

    if (this.filters['jobLocation']) {
      this.filteredJobs = this.filteredJobs.filter(
        (job) =>
          job.city
            .toLowerCase()
            .includes(this.filters['jobLocation']!.toLowerCase()) ||
          job.state
            .toLowerCase()
            .includes(this.filters['jobLocation']!.toLowerCase()),
      );
    }

    if (this.filters['jobContractType']) {
      console.log('jobContractType');
      this.filteredJobs = this.filteredJobs.filter((job) =>
        job.contractTypes.includes(
          this.filters['jobContractType']! as ContractTypes,
        ),
      );
    }

    if (this.filters['publishedDate']) {
      console.log('publishedDate');

      this.filteredJobs = this.filteredJobs.filter((job) => {
        const jobPublishedDate = job.publishedDate.toDateString();

        const filterPublishedDate = new Date(
          this.filters['publishedDate'] + ' EDT',
        ).toDateString();

        return jobPublishedDate == filterPublishedDate;
      });
    }

    if (this.filters['disabilityStatus']) {
      console.log('disabilityStatus');
      this.filteredJobs = this.filteredJobs.filter(
        (job) => job.disabilityStatus == this.filters['disabilityStatus'],
      );
    }
  }

  sortJobs(): void {
    if (this.dataToSort == undefined || this.sortOrder == undefined) return;

    this.filteredJobs.sort((a, b) => {
      let valueA = a[this.dataToSort!];
      let valueB = b[this.dataToSort!];

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

    this.filteredJobs = [...this.filteredJobs];
  }
}
