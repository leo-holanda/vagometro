import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { JobService } from 'src/app/job/job.service';
import { TimeWindows } from 'src/app/job/job.model';

@Component({
  selector: 'vgm-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  timeWindows = TimeWindows;
  selectedTimeWindows = TimeWindows.all;

  constructor(private jobService: JobService) {}

  filterJobs(timeWindow: TimeWindows): void {
    this.selectedTimeWindows = timeWindow;
    this.jobService.filterJobsByTime(timeWindow);
  }
}
