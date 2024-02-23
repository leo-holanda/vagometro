import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { JobSourceSelectorComponent } from '../job-sources/job-source-selector/job-source-selector.component';
import { CountdownComponent } from '../shared/countdown/countdown.component';
import { HeaderComponent } from '../shared/header/header.component';
import { JobSources } from '../job-sources/job-sources.types';

@Component({
  selector: 'vgm-statistics',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent,
    CountdownComponent,
    JobSourceSelectorComponent,
  ],
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss'],
})
export class StatisticsComponent {
  jobSources = JobSources;
}
