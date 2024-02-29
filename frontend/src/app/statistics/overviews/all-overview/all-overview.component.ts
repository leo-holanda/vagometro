import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { JobListComponent } from 'src/app/job/job-list/job-list.component';
import { PublicationChartComponent } from '../../charts/publication-chart/publication-chart.component';
import { JobCountComponent } from '../../job-count/job-count.component';
import { Observable } from 'rxjs';
import { JobService } from 'src/app/job/job.service';
import { Job } from 'src/app/job/job.types';
import { RankComponent } from '../../ranks/rank/rank.component';
import { RankTypes } from '../../ranks/rank/rank.types';

@Component({
  selector: 'vgm-all-overview',
  standalone: true,
  imports: [
    CommonModule,
    JobCountComponent,
    PublicationChartComponent,
    RouterModule,
    JobListComponent,
    RankComponent,
  ],
  templateUrl: './all-overview.component.html',
  styleUrls: ['./all-overview.component.scss'],
})
export class AllOverviewComponent {
  jobs$!: Observable<Job[] | undefined>;

  rankTypes = RankTypes;

  constructor(private jobService: JobService) {
    this.jobs$ = jobService.jobs$;
  }
}
