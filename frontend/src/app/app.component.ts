import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/header/header.component';
import { CountdownComponent } from './shared/countdown/countdown.component';
import { BehaviorSubject, delay, map, timer } from 'rxjs';

@Component({
  selector: 'vgm-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, CountdownComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  shouldShowAlert = true;

  constructor() {
    setTimeout(() => {
      this.shouldShowAlert = false;
    }, 8000);
  }
}
