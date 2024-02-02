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
  },
};
