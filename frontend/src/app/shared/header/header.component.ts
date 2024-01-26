import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { JobService } from 'src/app/job/job.service';
import { TimeWindows } from 'src/app/job/job.types';
import { Observable } from 'rxjs';
import { WindowResolutionObserverService } from '../window-resolution-observer.service';
import { JobSourceSelectorComponent } from 'src/app/job-sources/job-source-selector/job-source-selector.component';
import { JobSourcesService } from 'src/app/job-sources/job-sources.service';

@Component({
  selector: 'vgm-header',
  standalone: true,
  imports: [CommonModule, RouterModule, JobSourceSelectorComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  timeWindows = TimeWindows;
  currentTimeWindow$: Observable<TimeWindows>;
  matchesSmallBreakpoint$: Observable<boolean>;
  hasOneJobSourceActive$: Observable<boolean>;

  constructor(
    private jobService: JobService,
    private windowResolutionObserver: WindowResolutionObserverService,
    private jobSourcesService: JobSourcesService
  ) {
    this.currentTimeWindow$ = this.jobService.currentTimeWindow$;
    this.matchesSmallBreakpoint$ =
      this.windowResolutionObserver.matchesSmallBreakpoint();

    this.hasOneJobSourceActive$ = this.jobSourcesService.hasOneJobSourceActive$;
  }

  onTimeWindowClick(timeWindow: TimeWindows): void {
    this.jobService.filterJobsByTime(timeWindow);
  }
}
