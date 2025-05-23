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
  selectedJobSource?: JobSources;
  hasSelectedJobSource = false;
  hasSelectedJobCollection = false;
  jobSources = JobSources;

  currentYear = new Date().getFullYear()
  selectedSourceYear = this.currentYear;

  selectedJobCollectionInfo?: JobCollectionData = undefined;

  private gupyJobCollections!: JobCollectionsMap;
  private githubJobCollections!: JobCollectionsMap;
  private linkedInJobCollections!: JobCollectionsMap;

  @ViewChild('jobCollectionInfoModal') jobCollectionInfoModal: ElementRef | undefined;

  constructor(private jobSourcesService: JobSourcesService) {
    this.gupyJobCollections = this.getCollectionByJobSource(JobSources.gupy);
    this.githubJobCollections = this.getCollectionByJobSource(JobSources.github);
    this.linkedInJobCollections = this.getCollectionByJobSource(JobSources.linkedin);
    this.selectedJobCollections = this.gupyJobCollections;
  }

  toggleJobCollection(jobCollection: string): void {
    this.jobSourcesService.toggleJobCollection(jobCollection as JobCollections);
    this.hasSelectedJobCollection = true;
  }

  setJobSource(jobSource: JobSources): void {
    this.selectedJobSource = jobSource;
    this.hasSelectedJobSource = true;
    if (jobSource == JobSources.github) this.selectedJobCollections = this.githubJobCollections;
    else if (jobSource == JobSources.gupy) this.selectedJobCollections = this.gupyJobCollections;
    else this.selectedJobCollections = this.linkedInJobCollections;
  }

  onInfoButtonClick(jobCollection: JobCollectionData): void {
    this.selectedJobCollectionInfo = jobCollection;
    if (this.jobCollectionInfoModal) this.jobCollectionInfoModal.nativeElement.showModal();
  }
  
  decreaseSourceYear(): void {
    this.selectedSourceYear -= 1
  }

  increaseSourceYear(): void {
    this.selectedSourceYear += 1
  }

  private getCollectionByJobSource(jobSource: JobSources): JobCollectionsMap {
    const jobSources = Object.entries(jobCollectionsMap).filter(
      ([_, value]) => value.source == jobSource,
    );
    return Object.fromEntries(jobSources) as JobCollectionsMap;
  }
}
