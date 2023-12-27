import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatisticsService } from './statistics.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'vgm-statistics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss'],
})
export class StatisticsComponent implements OnInit {
  jobsPublishedInCurrentMonthCount!: Observable<number>;

  constructor(private statisticsService: StatisticsService) {}

  ngOnInit(): void {
    this.jobsPublishedInCurrentMonthCount =
      this.statisticsService.getJobsPublishedInCurrentMonthCount();
  }
}
