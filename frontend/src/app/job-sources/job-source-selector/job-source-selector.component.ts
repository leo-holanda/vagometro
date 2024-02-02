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
  gupyJobSources!: JobCollectionsMap;
  githubJobSources!: JobCollectionsMap;

  jobCollectionsMap = jobCollectionsMap;

  constructor(private jobSourcesService: JobSourcesService) {
    this.gupyJobSources = this.getCollectionByJobSource(JobSources.gupy);
    this.githubJobSources = this.getCollectionByJobSource(JobSources.github);
  }

  toggleJobCollection(jobCollection: string): void {
    this.jobSourcesService.toggleJobCollection(jobCollection as JobCollections);
  }

  private getCollectionByJobSource(jobSource: JobSources): JobCollectionsMap {
    const jobSources = Object.entries(jobCollectionsMap).filter(
      ([key, value]) => value.source == jobSource
    );
    return Object.fromEntries(jobSources) as JobCollectionsMap;
  }
}
