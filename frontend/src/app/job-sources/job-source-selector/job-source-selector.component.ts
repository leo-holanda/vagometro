import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobSourcesService } from '../job-sources.service';
import {
  JobCollectionData,
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
  selectedJobCollections!: JobCollectionsMap;

  jobCollectionsMap = jobCollectionsMap;
  selectedJobSource = JobSources.gupy;
  jobSources = JobSources;

  selectedJobCollectionInfo?: JobCollectionData = undefined;

  private gupyJobCollections!: JobCollectionsMap;
  private githubJobCollections!: JobCollectionsMap;
  private linkedInJobCollections!: JobCollectionsMap;

  @ViewChild('jobCollectionInfoModal') jobCollectionInfoModal:
    | ElementRef
    | undefined;

  constructor(private jobSourcesService: JobSourcesService) {
    this.gupyJobCollections = this.getCollectionByJobSource(JobSources.gupy);
    this.githubJobCollections = this.getCollectionByJobSource(
      JobSources.github
    );
    this.linkedInJobCollections = this.getCollectionByJobSource(
      JobSources.linkedin
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
    if (jobSource == JobSources.gupy)
      this.selectedJobCollections = this.gupyJobCollections;
    else this.selectedJobCollections = this.linkedInJobCollections;
  }

  onInfoButtonClick(jobCollection: JobCollectionData): void {
    this.selectedJobCollectionInfo = jobCollection;
    if (this.jobCollectionInfoModal)
      this.jobCollectionInfoModal.nativeElement.showModal();
  }

  private getCollectionByJobSource(jobSource: JobSources): JobCollectionsMap {
    const jobSources = Object.entries(jobCollectionsMap).filter(
      ([key, value]) => value.source == jobSource
    );
    return Object.fromEntries(jobSources) as JobCollectionsMap;
  }
}
