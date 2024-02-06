import { Observable } from 'rxjs';
import { Job } from '../job/job.types';

export enum JobSources {
  gupy = 'gupy',
  github = 'github',
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
  initialFetchDate: string;
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
    searchStringKeywords: [
      'desenvolvedor',
      'dev',
      'front',
      'back',
      'full',
      'fullstack',
      'software',
    ],
    initialFetchDate: '19/12/2023',
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
    initialFetchDate: '02/01/2024',
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
    initialFetchDate: '02/01/2024',
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
    initialFetchDate: '02/01/2024',
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
    initialFetchDate: '02/01/2024',
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
    initialFetchDate: '03/02/2016',
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
    initialFetchDate: '03/10/2017',
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
    initialFetchDate: '13/10/2023',
  },
};
