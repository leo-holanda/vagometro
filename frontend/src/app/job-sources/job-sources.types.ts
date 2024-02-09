import { Observable } from 'rxjs';
import { Job } from '../job/job.types';

export enum JobSources {
  gupy = 'gupy',
  github = 'github',
  linkedin = 'linkedin',
}

export enum JobCollections {
  gupy = 'gupy',
  frontendbr = 'frontendbr',
  backendbr = 'backendbr',
  soujava = 'soujava',
  gupymobile = 'gupymobile',
  gupydevops = 'gupydevops',
  gupyuiux = 'gupyuiux',
  gupydados = 'gupydados',
  linkedin_dev = 'linkedin_dev',
}

export type JobCollectionData = {
  name: string;
  icon: string;
  source: string;
  dataSource: Observable<Job[]>;
  isActive: boolean;
  isLoading: boolean;
  isLoaded: boolean;
  hasFailedToLoad: boolean;
  searchStringKeywords: string[];
  initialDailyFetchDate: string;
};

export type JobCollectionsMap = Record<JobCollections, JobCollectionData>;

export const jobCollectionsMap: JobCollectionsMap = {
  gupy: {
    name: 'Desenvolvimento Web',
    icon: 'bx bxs-business',
    source: JobSources.gupy,
    dataSource: new Observable(),
    isActive: false,
    isLoading: false,
    isLoaded: false,
    hasFailedToLoad: false,
    searchStringKeywords: ['desenvolvedor', 'dev', 'front', 'back', 'full', 'fullstack', 'software'],
    initialDailyFetchDate: '19/12/2023',
  },
  gupymobile: {
    name: 'Mobile',
    icon: 'bx bxs-business',
    source: JobSources.gupy,
    dataSource: new Observable(),
    isActive: false,
    isLoading: false,
    isLoaded: false,
    hasFailedToLoad: false,
    searchStringKeywords: ['mobile'],
    initialDailyFetchDate: '05/02/2024',
  },
  gupydevops: {
    name: 'DevOps',
    icon: 'bx bxs-business',
    source: JobSources.gupy,
    dataSource: new Observable(),
    isActive: false,
    isLoading: false,
    isLoaded: false,
    hasFailedToLoad: false,
    searchStringKeywords: ['devops', 'sre'],
    initialDailyFetchDate: '05/02/2024',
  },
  gupyuiux: {
    name: 'UI/UX',
    icon: 'bx bxs-business',
    source: JobSources.gupy,
    dataSource: new Observable(),
    isActive: false,
    isLoading: false,
    isLoaded: false,
    hasFailedToLoad: false,
    searchStringKeywords: ['ui', 'ux'],
    initialDailyFetchDate: '05/02/2024',
  },
  gupydados: {
    name: 'Dados',
    icon: 'bx bxs-business',
    source: JobSources.gupy,
    dataSource: new Observable(),
    isActive: false,
    isLoading: false,
    isLoaded: false,
    hasFailedToLoad: false,
    searchStringKeywords: ['data', 'dados'],
    initialDailyFetchDate: '05/02/2024',
  },
  frontendbr: {
    name: 'frontendbr/vagas',
    icon: 'bx bxl-github',
    source: JobSources.github,
    dataSource: new Observable(),
    isActive: false,
    isLoading: false,
    isLoaded: false,
    hasFailedToLoad: false,
    searchStringKeywords: ['não se aplica'],
    initialDailyFetchDate: 'Em progresso',
  },
  backendbr: {
    name: 'backend-br/vagas',
    icon: 'bx bxl-github',
    source: JobSources.github,
    dataSource: new Observable(),
    isActive: false,
    isLoading: false,
    isLoaded: false,
    hasFailedToLoad: false,
    searchStringKeywords: ['não se aplica'],
    initialDailyFetchDate: 'Em progresso',
  },
  soujava: {
    name: 'soujava/vagas-java',
    icon: 'bx bxl-github',
    source: JobSources.github,
    dataSource: new Observable(),
    isActive: false,
    isLoading: false,
    isLoaded: false,
    hasFailedToLoad: false,
    searchStringKeywords: ['não se aplica'],
    initialDailyFetchDate: 'Em progresso',
  },
  linkedin_dev: {
    name: 'Desenvolvimento de software (Fase de testes)',
    icon: 'bx bxl-linkedin-square',
    source: JobSources.linkedin,
    dataSource: new Observable(),
    isActive: false,
    isLoading: false,
    isLoaded: false,
    hasFailedToLoad: false,
    searchStringKeywords: ['desenvolvedor'],
    initialDailyFetchDate: 'Em progresso',
  },
};
