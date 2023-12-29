import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { StatisticsService } from '../statistics.service';
import { JobService } from 'src/app/job/job.service';
import { TimeWindows } from 'src/app/job/job.model';

@Component({
  selector: 'vgm-job-count',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './job-count.component.html',
  styleUrls: ['./job-count.component.scss'],
})
export class JobCountComponent implements OnInit {
  jobsPublishedInCurrentMonthCount$!: Observable<number>;

  currentTimeWindow$!: Observable<TimeWindows>;
  timeWindows = TimeWindows;

  constructor(
    private statisticsService: StatisticsService,
    private jobService: JobService
  ) {}

  ngOnInit(): void {
    this.currentTimeWindow$ = this.jobService.currentTimeWindow$;

    this.jobsPublishedInCurrentMonthCount$ =
      this.statisticsService.getJobsPublishedInCurrentMonthCount();
  }
}
