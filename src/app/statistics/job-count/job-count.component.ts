import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { StatisticsService } from '../statistics.service';

@Component({
  selector: 'vgm-job-count',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './job-count.component.html',
  styleUrls: ['./job-count.component.scss'],
})
export class JobCountComponent implements OnInit {
  jobsPublishedInCurrentMonthCount!: Observable<number>;
  constructor(private statisticsService: StatisticsService) {}

  ngOnInit(): void {
    this.jobsPublishedInCurrentMonthCount =
      this.statisticsService.getJobsPublishedInCurrentMonthCount();
  }
}
