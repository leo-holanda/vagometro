import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CountdownComponent } from '../countdown/countdown.component';
import { JobSources } from 'src/app/job-sources/job-sources.types';

@Component({
  selector: 'vgm-footer',
  standalone: true,
  imports: [CommonModule, CountdownComponent],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
  jobSources = JobSources;
}
