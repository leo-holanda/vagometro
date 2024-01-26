import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/header/header.component';
import { CountdownComponent } from './shared/countdown/countdown.component';
import { JobSourceSelectorComponent } from './job-sources/job-source-selector/job-source-selector.component';
import { JobSourcesService } from './job-sources/job-sources.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'vgm-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent,
    CountdownComponent,
    JobSourceSelectorComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  hasOneJobSourceActive$: Observable<boolean>;

  @ViewChild('jobSourcesModal') jobSourcesModal: ElementRef | undefined;

  constructor(private jobSourcesService: JobSourcesService) {
    this.hasOneJobSourceActive$ = this.jobSourcesService.hasOneJobSourceActive$;
  }

  ngAfterViewInit(): void {
    if (this.jobSourcesModal) this.jobSourcesModal.nativeElement.showModal();
  }
}
