import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/header/header.component';
import { CountdownComponent } from './shared/countdown/countdown.component';
import { JobSourceSelectorComponent } from './job-sources/job-source-selector/job-source-selector.component';

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
export class AppComponent {}
