import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobService } from 'src/app/job/job.service';
import { GupyService } from '../gupy/gupy.service';
import { GitHubJobsService } from '../github/git-hub-jobs.service';
import { JobSourcesService } from '../job-sources.service';
import { Observable } from 'rxjs';
import { JobSources, jobSourcesMap } from '../job-sources.types';

@Component({
  selector: 'vgm-job-source-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './job-source-selector.component.html',
  styleUrls: ['./job-source-selector.component.scss'],
})
export class JobSourceSelectorComponent {
  hasSelectedOption = false;
  jobSources = JobSources;

  activeJobSources = jobSourcesMap;

  constructor(private jobSourcesService: JobSourcesService) {
    this.activeJobSources = this.jobSourcesService.activeJobSources;
  }

  toggleJobSource(jobSource: string): void {
    this.jobSourcesService.toggleJobSource(jobSource as JobSources);
  }
}
