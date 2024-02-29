import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobListComponent } from '../../job-list/job-list.component';
import { Observable, filter } from 'rxjs';
import { Job } from '../../job.types';
import { JobService } from '../../job.service';
import { PublicationChartComponent } from 'src/app/statistics/charts/publication-chart/publication-chart.component';
import { JobPostingsComparisonComponent } from 'src/app/statistics/comparisons/job-postings-comparison/job-postings-comparison.component';
import { RouterModule } from '@angular/router';
import { RankComponent } from 'src/app/statistics/rank/rank.component';
import { RankTypes } from 'src/app/statistics/rank/rank.types';

@Component({
  selector: 'vgm-search-results',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    JobListComponent,
    PublicationChartComponent,
    JobPostingsComparisonComponent,
    RankComponent,
  ],
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss'],
})
export class SearchResultsComponent {
  selectedDataType: 'jobs' | 'stats' = 'jobs';

  jobs$: Observable<Job[]>;

  rankTypes = RankTypes;

  constructor(private jobService: JobService) {
    this.jobs$ = this.jobService.jobs$.pipe(filter((jobs): jobs is Job[] => jobs != undefined));
  }

  setDataType(dataType: 'jobs' | 'stats'): void {
    this.selectedDataType = dataType;
  }
}
