import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobSources } from 'src/app/job-sources/job-sources.types';

@Component({
  selector: 'vgm-countdown',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './countdown.component.html',
  styleUrls: ['./countdown.component.scss'],
})
export class CountdownComponent implements OnInit {
  @Input() jobSource: JobSources | undefined;

  hours = 0;
  minutes = 0;
  seconds = 0;
  isCountdownFinished = false;
  jobSourceText = '';

  ngOnInit(): void {
    const today = new Date();
    today.setMinutes(0);
    today.setSeconds(0);

    if (this.jobSource == JobSources.gupy) {
      this.jobSourceText = 'da Gupy';
      if (today.getHours() > 19) {
        today.setDate(today.getDate() + 1);
        today.setHours(11);
      }
      if (today.getHours() > 11) today.setHours(19);
      else today.setHours(11);
    } else {
      this.jobSourceText = 'do LinkedIn';

      today.setDate(new Date().getDate() + 1);
      today.setHours(3);
    }

    const countDownDateTime = today.getTime();

    //LATER: Can this be done without calling new Date()?
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = countDownDateTime - now;

      this.hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      this.minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      this.seconds = Math.floor((distance % (1000 * 60)) / 1000);

      if (distance <= 0) {
        clearInterval(interval);
        this.isCountdownFinished = true;
      }
    }, 1000);
  }
}
