import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobSourcesService } from '../job-sources.service';
import {
  JobCollections,
  JobCollectionsMap,
  JobSources,
  jobCollectionsMap,
} from '../job-sources.types';

@Component({
  selector: 'vgm-job-source-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './job-source-selector.component.html',
  styleUrls: ['./job-source-selector.component.scss'],
})
export class JobSourceSelectorComponent {
  private gupyJobCollections!: JobCollectionsMap;
  private githubJobCollections!: JobCollectionsMap;
  selectedJobCollections!: JobCollectionsMap;

  jobCollectionsMap = jobCollectionsMap;
  selectedJobSource = JobSources.gupy;
  jobSources = JobSources;

  constructor(private jobSourcesService: JobSourcesService) {
    this.gupyJobCollections = this.getCollectionByJobSource(JobSources.gupy);
    this.githubJobCollections = this.getCollectionByJobSource(
      JobSources.github
    );
    this.selectedJobCollections = this.gupyJobCollections;
  }

  toggleJobCollection(jobCollection: string): void {
    this.jobSourcesService.toggleJobCollection(jobCollection as JobCollections);
  }

  setJobSource(jobSource: JobSources): void {
    this.selectedJobSource = jobSource;
    if (jobSource == JobSources.github)
      this.selectedJobCollections = this.githubJobCollections;
    else this.selectedJobCollections = this.gupyJobCollections;
  }

  private getCollectionByJobSource(jobSource: JobSources): JobCollectionsMap {
    const jobSources = Object.entries(jobCollectionsMap).filter(
      ([key, value]) => value.source == jobSource
    );
    return Object.fromEntries(jobSources) as JobCollectionsMap;
  }
}
