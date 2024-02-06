import { Routes } from '@angular/router';
import { StatisticsComponent } from './statistics/statistics.component';
import { CitiesOverviewComponent } from './statistics/overviews/cities-overview/cities-overview.component';
import { WorkplacesOverviewComponent } from './statistics/overviews/workplaces-overview/workplaces-overview.component';
import { KeywordsOverviewComponent } from './statistics/overviews/keywords-overview/keywords-overview.component';
import { CompaniesOverviewComponent } from './statistics/overviews/companies-overview/companies-overview.component';
import { TypesOverviewComponent } from './statistics/overviews/types-overview/types-overview.component';
import { ExperienceLevelsOverviewComponent } from './statistics/overviews/experience-levels-overview/experience-levels-overview.component';
import { DisabilityStatusesOverviewComponent } from './statistics/overviews/disability-statuses-overview/disability-statuses-overview.component';
import { EducationOverviewComponent } from './statistics/overviews/education-overview/education-overview.component';
import { LanguagesOverviewComponent } from './statistics/overviews/languages-overview/languages-overview.component';
import { MonthsOverviewComponent } from './statistics/overviews/months-overview/months-overview.component';
import { ComparisonOverviewComponent } from './statistics/overviews/comparison-overview/comparison-overview.component';
import { AllOverviewComponent } from './statistics/overviews/all-overview/all-overview.component';
import { LandingPageComponent } from './landing-page/landing-page.component';

export const routes: Routes = [
  {
    path: '',
    component: LandingPageComponent,
  },
  {
    path: 'stats',
    component: StatisticsComponent,
    children: [
      {
        path: '',
        component: AllOverviewComponent,
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
        path: 'educacao',
        component: EducationOverviewComponent,
      },
      {
        path: 'idiomas',
        component: LanguagesOverviewComponent,
      },
      {
        path: 'meses',
        component: MonthsOverviewComponent,
      },
      {
        path: 'comparativo',
        component: ComparisonOverviewComponent,
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
