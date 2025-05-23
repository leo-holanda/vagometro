import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobSourcesService } from '../job-sources.service';
import {
  JobCollectionData,
  JobCollections,
  JobCollectionsMap,
  JobSources,
  Quarters,
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
  jobSources = JobSources;
  quarters = Quarters;

  hasSelectedJobSource = false;

  selectedJobCollection?: JobCollections;
  hasSelectedJobCollection = false;

  selectedQuarter?: Quarters;
  hasSelectedQuarter = false;

  currentYear = new Date().getFullYear()
  selectedYear = this.currentYear;

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

  setJobCollection(jobCollection: string): void {
    this.selectedJobCollection = jobCollection as JobCollections
    this.hasSelectedJobCollection = true;
  }

  setJobSource(jobSource: JobSources): void {
    this.hasSelectedJobSource = true;
    if (jobSource == JobSources.github) this.selectedJobCollections = this.githubJobCollections;
    else if (jobSource == JobSources.gupy) this.selectedJobCollections = this.gupyJobCollections;
    else this.selectedJobCollections = this.linkedInJobCollections;
  }

  setJobCollectionQuarter(quarter: Quarters): void {
    this.selectedQuarter = quarter;

    if(!this.selectedJobCollection) return
    if(!this.selectedQuarter) return

    this.jobSourcesService.updateSelectedCollections(this.selectedJobCollection, this.selectedQuarter, this.selectedYear)
  }

  onInfoButtonClick(jobCollection: JobCollectionData): void {
    this.selectedJobCollectionInfo = jobCollection;
    if (this.jobCollectionInfoModal) this.jobCollectionInfoModal.nativeElement.showModal();
  }
  
  decreaseSourceYear(): void {
    this.selectedYear -= 1
  }

  increaseSourceYear(): void {
    this.selectedYear += 1
  }

  private getCollectionByJobSource(jobSource: JobSources): JobCollectionsMap {
    const jobSources = Object.entries(jobCollectionsMap).filter(
      ([_, value]) => value.source == jobSource,
    );
    return Object.fromEntries(jobSources) as JobCollectionsMap;
  }
}
