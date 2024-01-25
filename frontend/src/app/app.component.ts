import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/header/header.component';
import { CountdownComponent } from './shared/countdown/countdown.component';
import { JobService } from './job/job.service';
import { GupyService } from './gupy/gupy.service';
import { GitHubJobsService } from './github/git-hub-jobs.service';

@Component({
  selector: 'vgm-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, CountdownComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  shouldShowAlert = true;

  constructor(
    private jobService: JobService,
    private githubJobsService: GitHubJobsService
  ) {
    this.githubJobsService.frontendJobs$.subscribe((jobs) => {
      this.jobService.setJobs(jobs);
    });

    setTimeout(() => {
      this.shouldShowAlert = false;
    }, 8000);
  }
}
