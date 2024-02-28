import { Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { hasOneJobCollectionLoadedGuard } from './shared/guards/has-one-job-collection-loaded.guard';

export const routes: Routes = [
  {
    path: '',
    component: LandingPageComponent,
  },
  {
    path: 'stats',
    loadComponent: () =>
      import('./statistics/statistics.component').then((mod) => mod.StatisticsComponent),
    canActivate: [hasOneJobCollectionLoadedGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./statistics/overviews/all-overview/all-overview.component').then(
            (mod) => mod.AllOverviewComponent,
          ),
      },
      {
        path: 'cidades',
        loadComponent: () =>
          import('./statistics/overviews/cities-overview/cities-overview.component').then(
            (mod) => mod.CitiesOverviewComponent,
          ),
      },
      {
        path: 'modalidades',
        loadComponent: () =>
          import('./statistics/overviews/workplaces-overview/workplaces-overview.component').then(
            (mod) => mod.WorkplacesOverviewComponent,
          ),
      },
      {
        path: 'tecnologias',
        loadComponent: () =>
          import('./statistics/overviews/keywords-overview/keywords-overview.component').then(
            (mod) => mod.KeywordsOverviewComponent,
          ),
      },
      {
        path: 'empresas',
        loadComponent: () =>
          import('./statistics/overviews/companies-overview/companies-overview.component').then(
            (mod) => mod.CompaniesOverviewComponent,
          ),
      },
      {
        path: 'contratos',
        loadComponent: () =>
          import('./statistics/overviews/types-overview/types-overview.component').then(
            (mod) => mod.TypesOverviewComponent,
          ),
      },
      {
        path: 'experiencia',
        loadComponent: () =>
          import(
            './statistics/overviews/experience-levels-overview/experience-levels-overview.component'
          ).then((mod) => mod.ExperienceLevelsOverviewComponent),
      },
      {
        path: 'inclusao',
        loadComponent: () =>
          import('./statistics/overviews/inclusion-overview/inclusion-overview.component').then(
            (mod) => mod.InclusionOverviewComponent,
          ),
      },
      {
        path: 'educacao',
        loadComponent: () =>
          import('./statistics/overviews/education-overview/education-overview.component').then(
            (mod) => mod.EducationOverviewComponent,
          ),
      },
      {
        path: 'idiomas',
        loadComponent: () =>
          import('./statistics/overviews/languages-overview/languages-overview.component').then(
            (mod) => mod.LanguagesOverviewComponent,
          ),
      },
      {
        path: 'meses',
        loadComponent: () =>
          import('./statistics/overviews/months-overview/months-overview.component').then(
            (mod) => mod.MonthsOverviewComponent,
          ),
      },
      {
        path: 'comparativo',
        loadComponent: () =>
          import('./statistics/overviews/comparison-overview/comparison-overview.component').then(
            (mod) => mod.ComparisonOverviewComponent,
          ),
      },
      {
        path: 'certificacoes',
        loadComponent: () =>
          import(
            './statistics/overviews/certifications-overview/certifications-overview.component'
          ).then((mod) => mod.CertificationsOverviewComponent),
      },
    ],
  },
  {
    path: 'busca-facil',
    canActivate: [hasOneJobCollectionLoadedGuard],
    loadComponent: () =>
      import('./job/easy-search/easy-search.component').then((mod) => mod.EasySearchComponent),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./job/easy-search/search-results/search-results.component').then(
            (mod) => mod.SearchResultsComponent,
          ),
      },
      {
        path: 'dados',
        loadComponent: () =>
          import('./job/easy-search/search-form/search-form.component').then(
            (mod) => mod.SearchFormComponent,
          ),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
