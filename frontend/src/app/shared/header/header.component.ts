import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { JobService } from 'src/app/job/job.service';
import { TimeWindows } from 'src/app/job/job.model';
import { Observable } from 'rxjs';
import { WindowResolutionObserverService } from '../window-resolution-observer.service';

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
  matchesSmallBreakpoint$: Observable<boolean>;

  constructor(
    private jobService: JobService,
    private windowResolutionObserver: WindowResolutionObserverService
  ) {
    this.currentTimeWindow$ = this.jobService.currentTimeWindow$;
    this.matchesSmallBreakpoint$ =
      this.windowResolutionObserver.matchesSmallBreakpoint();
  }

  onTimeWindowClick(timeWindow: TimeWindows): void {
    this.jobService.filterJobsByTime(timeWindow);
  }
}
