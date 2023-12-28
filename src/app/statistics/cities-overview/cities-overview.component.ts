import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrazilMapComponent } from '../maps/brazil-map/brazil-map.component';
import { JobService } from 'src/app/job/job.service';

@Component({
  selector: 'vgm-cities-overview',
  standalone: true,
  imports: [CommonModule, BrazilMapComponent],
  templateUrl: './cities-overview.component.html',
  styleUrls: ['./cities-overview.component.scss'],
})
export class CitiesOverviewComponent implements OnInit {
  selectedState: string = 'São Paulo';

  constructor(private jobService: JobService) {}

  ngOnInit(): void {}

  onStateClicked(state: string): void {
    this.jobService.getJobsByState(state).subscribe((jobs) => {
      console.log(jobs);
    });
  }
}
