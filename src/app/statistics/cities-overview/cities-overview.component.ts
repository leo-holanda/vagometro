import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrazilMapComponent } from '../maps/brazil-map/brazil-map.component';

@Component({
  selector: 'vgm-cities-overview',
  standalone: true,
  imports: [CommonModule, BrazilMapComponent],
  templateUrl: './cities-overview.component.html',
  styleUrls: ['./cities-overview.component.scss'],
})
export class CitiesOverviewComponent {}
