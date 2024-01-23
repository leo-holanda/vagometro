import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'vgm-countdown',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './countdown.component.html',
  styleUrls: ['./countdown.component.scss'],
})
export class CountdownComponent implements OnInit {
  hours = 0;
  minutes = 0;
  seconds = 0;
  isCountdownFinished = false;

  ngOnInit(): void {
    const countDownDate = new Date();
    countDownDate.setDate(new Date().getDate() + 1);
    countDownDate.setHours(6);
    countDownDate.setMinutes(0);
    countDownDate.setSeconds(0);

    const countDownDateTime = countDownDate.getTime();

    //LATER: Can this be done without calling new Date()?
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = countDownDateTime - now;

      this.hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      this.minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      this.seconds = Math.floor((distance % (1000 * 60)) / 1000);

      if (distance <= 0) {
        clearInterval(interval);
        this.isCountdownFinished = true;
      }
    }, 1000);
  }
}
