import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobService } from '../job.service';
import { Observable, filter, map, of } from 'rxjs';
import { Job } from '../job.model';
import { translations } from 'src/app/statistics/ranks/type-rank/type-rank.translations';
import { StateAbbreviationPipe } from 'src/app/shared/pipes/state-abbreviation.pipe';
import { ExperienceLevels } from 'src/app/statistics/ranks/experience-levels-rank/experience-levels-rank.model';
import { FormsModule } from '@angular/forms';
import { stringToBooleanMap } from './job-list.types';

@Component({
  selector: 'vgm-job-list',
  standalone: true,
  imports: [CommonModule, StateAbbreviationPipe, FormsModule],
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.scss'],
})
export class JobListComponent implements OnInit {
  @Input() jobs$: Observable<Job[] | undefined> = of([]);
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

  today = new Date();

  private stringToBooleanMap: stringToBooleanMap = {
    true: true,
    false: false,
  };

  ngOnInit(): void {
    this.jobs$.subscribe((jobs) => {
      this.jobs = jobs;
      this.filteredJobs = jobs;
    });
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
}
