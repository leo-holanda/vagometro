import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobSourceSelectorComponent } from '../job-sources/job-source-selector/job-source-selector.component';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { JobSourcesService } from '../job-sources/job-sources.service';

@Component({
  selector: 'vgm-landing-page',
  standalone: true,
  imports: [CommonModule, JobSourceSelectorComponent, RouterLink],
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
})
export class LandingPageComponent {
  hasOneActiveJobSource$: Observable<boolean>;

  constructor(private jobSourcesService: JobSourcesService) {
    this.hasOneActiveJobSource$ = this.jobSourcesService.hasOneActiveJobSource$;
  }
}
