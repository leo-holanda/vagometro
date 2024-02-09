import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { JobSourcesService } from './job-sources/job-sources.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'vgm-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  hasOneJobSourceActive$: Observable<boolean>;

  @ViewChild('jobSourcesModal') jobSourcesModal: ElementRef | undefined;

  constructor(private jobSourcesService: JobSourcesService) {
    this.hasOneJobSourceActive$ = this.jobSourcesService.hasOneActiveJobSource$;
  }

  ngAfterViewInit(): void {
    if (this.jobSourcesModal) this.jobSourcesModal.nativeElement.showModal();
  }
}
