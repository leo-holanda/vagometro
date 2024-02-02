import { Observable } from 'rxjs';
import { Job } from '../job/job.types';

export enum JobSources {
  gupy = 'gupy',
  frontendbr = 'frontendbr',
  backendbr = 'backendbr',
  soujava = 'soujava',
  gupymobile = 'gupymobile',
}

export type JobSourceData = {
  name: string;
  icon: string;
  dataSource: Observable<Job[]>;
  isActive: boolean;
  isLoading: boolean;
  isLoaded: boolean;
  hasFailedToLoad: boolean;
};

export type JobSourcesMap = Record<JobSources, JobSourceData>;

export const jobSourcesMap: JobSourcesMap = {
  gupy: {
    name: 'Gupy - Desenvolvedor',
    icon: 'bx bxs-business',
    dataSource: new Observable(),
    isActive: false,
    isLoading: false,
    isLoaded: false,
    hasFailedToLoad: false,
  },
  gupymobile: {
    name: 'Gupy - Mobile',
    icon: 'bx bxs-business',
    dataSource: new Observable(),
    isActive: false,
    isLoading: false,
    isLoaded: false,
    hasFailedToLoad: false,
  },
  frontendbr: {
    name: 'frontendbr/vagas',
    icon: 'bx bxl-github',
    dataSource: new Observable(),
    isActive: false,
    isLoading: false,
    isLoaded: false,
    hasFailedToLoad: false,
  },
  backendbr: {
    name: 'backend-br/vagas',
    icon: 'bx bxl-github',
    dataSource: new Observable(),
    isActive: false,
    isLoading: false,
    isLoaded: false,
    hasFailedToLoad: false,
  },
  soujava: {
    name: 'soujava/vagas-java',
    icon: 'bx bxl-github',
    dataSource: new Observable(),
    isActive: false,
    isLoading: false,
    isLoaded: false,
    hasFailedToLoad: false,
  },
};
