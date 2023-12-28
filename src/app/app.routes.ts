import { Routes } from '@angular/router';
import { StatisticsComponent } from './statistics/statistics.component';
import { CitiesOverviewComponent } from './statistics/cities-overview/cities-overview.component';

export const routes: Routes = [
  {
    path: '',
    component: StatisticsComponent,
  },
  {
    path: 'cidades',
    component: CitiesOverviewComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];
