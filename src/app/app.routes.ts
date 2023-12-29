import { Routes } from '@angular/router';
import { StatisticsComponent } from './statistics/statistics.component';
import { CitiesOverviewComponent } from './statistics/overviews/cities-overview/cities-overview.component';
import { WorkplacesOverviewComponent } from './statistics/overviews/workplaces-overview/workplaces-overview.component';
import { KeywordsOverviewComponent } from './statistics/overviews/keywords-overview/keywords-overview.component';

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
    path: 'modalidades',
    component: WorkplacesOverviewComponent,
  },
  {
    path: 'tecnologias',
    component: KeywordsOverviewComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];
