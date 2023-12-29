import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { JobService } from 'src/app/job/job.service';
import { TimeWindows } from 'src/app/job/job.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'vgm-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  timeWindows = TimeWindows;
  currentTimeWindow$: Observable<TimeWindows>;

  constructor(private jobService: JobService) {
    this.currentTimeWindow$ = this.jobService.currentTimeWindow$;
  }

  onTimeWindowClick(timeWindow: TimeWindows): void {
    this.jobService.filterJobsByTime(timeWindow);
  }
}
