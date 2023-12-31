import { Routes } from '@angular/router';
import { StatisticsComponent } from './statistics/statistics.component';
import { CitiesOverviewComponent } from './statistics/overviews/cities-overview/cities-overview.component';
import { WorkplacesOverviewComponent } from './statistics/overviews/workplaces-overview/workplaces-overview.component';
import { KeywordsOverviewComponent } from './statistics/overviews/keywords-overview/keywords-overview.component';
import { CompaniesOverviewComponent } from './statistics/overviews/companies-overview/companies-overview.component';
import { TypesOverviewComponent } from './statistics/overviews/types-overview/types-overview.component';
import { ExperienceLevelsOverviewComponent } from './statistics/overviews/experience-levels-overview/experience-levels-overview.component';
import { DisabilityStatusesOverviewComponent } from './statistics/overviews/disability-statuses-overview/disability-statuses-overview.component';

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
    path: 'empresas',
    component: CompaniesOverviewComponent,
  },
  {
    path: 'tipos',
    component: TypesOverviewComponent,
  },
  {
    path: 'niveis',
    component: ExperienceLevelsOverviewComponent,
  },
  {
    path: 'pcd',
    component: DisabilityStatusesOverviewComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];
