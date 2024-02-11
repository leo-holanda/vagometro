import { Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component';

export const routes: Routes = [
  {
    path: '',
    component: LandingPageComponent,
  },
  {
    path: 'stats',
    loadComponent: () => import('./statistics/statistics.component').then((mod) => mod.StatisticsComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./statistics/overviews/all-overview/all-overview.component').then((mod) => mod.AllOverviewComponent),
      },
      {
        path: 'cidades',
        loadComponent: () =>
          import('./statistics/overviews/cities-overview/cities-overview.component').then((mod) => mod.CitiesOverviewComponent),
      },
      {
        path: 'modalidades',
        loadComponent: () =>
          import('./statistics/overviews/workplaces-overview/workplaces-overview.component').then((mod) => mod.WorkplacesOverviewComponent),
      },
      {
        path: 'tecnologias',
        loadComponent: () =>
          import('./statistics/overviews/keywords-overview/keywords-overview.component').then((mod) => mod.KeywordsOverviewComponent),
      },
      {
        path: 'empresas',
        loadComponent: () =>
          import('./statistics/overviews/companies-overview/companies-overview.component').then((mod) => mod.CompaniesOverviewComponent),
      },
      {
        path: 'tipos',
        loadComponent: () =>
          import('./statistics/overviews/types-overview/types-overview.component').then((mod) => mod.TypesOverviewComponent),
      },
      {
        path: 'niveis',
        loadComponent: () =>
          import('./statistics/overviews/experience-levels-overview/experience-levels-overview.component').then(
            (mod) => mod.ExperienceLevelsOverviewComponent,
          ),
      },
      {
        path: 'inclusao',
        loadComponent: () =>
          import('./statistics/overviews/inclusion-overview/inclusion-overview.component').then((mod) => mod.InclusionOverviewComponent),
      },
      {
        path: 'educacao',
        loadComponent: () =>
          import('./statistics/overviews/education-overview/education-overview.component').then((mod) => mod.EducationOverviewComponent),
      },
      {
        path: 'idiomas',
        loadComponent: () =>
          import('./statistics/overviews/languages-overview/languages-overview.component').then((mod) => mod.LanguagesOverviewComponent),
      },
      {
        path: 'meses',
        loadComponent: () =>
          import('./statistics/overviews/months-overview/months-overview.component').then((mod) => mod.MonthsOverviewComponent),
      },
      {
        path: 'comparativo',
        loadComponent: () =>
          import('./statistics/overviews/comparison-overview/comparison-overview.component').then((mod) => mod.ComparisonOverviewComponent),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
