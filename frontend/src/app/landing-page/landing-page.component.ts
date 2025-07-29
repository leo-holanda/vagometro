import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobSourceSelectorComponent } from '../job-sources/job-source-selector/job-source-selector.component';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { JobSourcesService } from '../job-sources/job-sources.service';
import { LoadingDirective } from '../shared/directives/loading.directive';
import { FooterComponent } from '../shared/footer/footer.component';
import { VisualizationModes } from '../job-sources/job-sources.types';

@Component({
  selector: 'vgm-landing-page',
  standalone: true,
  imports: [
    CommonModule,
    JobSourceSelectorComponent,
    RouterLink,
    LoadingDirective,
    FooterComponent,
  ],
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
})
export class LandingPageComponent {
  hasOneActiveJobSource$: Observable<boolean>;
  isFinalSelectionStep = false;
  visualizationMode = VisualizationModes.newJobs;

  visualizationModes = VisualizationModes;

  constructor(private jobSourcesService: JobSourcesService) {
    this.hasOneActiveJobSource$ = this.jobSourcesService.hasOneActiveJobSource$;
  }

  scrollTo(element: HTMLElement): void {
    element.scrollIntoView({ behavior: 'smooth' });
  }
}
