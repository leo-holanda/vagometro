import { Observable } from 'rxjs';
import { Job } from '../job/job.types';

export enum JobSources {
  gupy = 'gupy',
  github = 'github',
  linkedin = 'linkedin',
}

export enum JobCollections {
  // Gupy
  gupydev = 'gupydev',
  gupymobile = 'gupymobile',
  gupydevops = 'gupydevops',
  gupyuiux = 'gupyuiux',
  gupydados = 'gupydados',
  gupyqa = 'gupyqa',
  gupyia = 'gupyia',
  gupyProductManager = 'gupyProductManager',
  gupyAgileRelated = 'gupyAgileRelated',

  // GitHub
  frontendbr = 'frontendbr',
  backendbr = 'backendbr',
  soujava = 'soujava',
  reactBrasil = 'react-brasil',
  androidDevBr = 'androiddevbr',

  //LinkedIn
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
  gupydev: {
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
    searchStringKeywords: ['mobile', 'android', 'ios'],
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
    searchStringKeywords: ['devops', 'sre', 'devsecops', 'cloud'],
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
  gupyqa: {
    name: 'QA',
    icon: 'bx bxs-business',
    source: JobSources.gupy,
    dataSource: new Observable(),
    isActive: false,
    isLoading: false,
    isLoaded: false,
    hasFailedToLoad: false,
    searchStringKeywords: ['qa', 'teste', 'quality assurance'],
    initialDailyFetchDate: '09/02/2024',
  },
  gupyia: {
    name: 'IA',
    icon: 'bx bxs-business',
    source: JobSources.gupy,
    dataSource: new Observable(),
    isActive: false,
    isLoading: false,
    isLoaded: false,
    hasFailedToLoad: false,
    searchStringKeywords: [
      'ia',
      'ai',
      'machine learning',
      'inteligencia artificial',
      'deep learning',
    ],
    initialDailyFetchDate: '09/02/2024',
  },
  gupyProductManager: {
    name: 'Product Manager',
    icon: 'bx bxs-business',
    source: JobSources.gupy,
    dataSource: new Observable(),
    isActive: false,
    isLoading: false,
    isLoaded: false,
    hasFailedToLoad: false,
    searchStringKeywords: ['product manager'],
    initialDailyFetchDate: '22/02/2024',
  },
  gupyAgileRelated: {
    name: 'Agilista/Scrum Master',
    icon: 'bx bxs-business',
    source: JobSources.gupy,
    dataSource: new Observable(),
    isActive: false,
    isLoading: false,
    isLoaded: false,
    hasFailedToLoad: false,
    searchStringKeywords: ['agilista', 'scrum', 'agile'],
    initialDailyFetchDate: '23/02/2024',
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
  'react-brasil': {
    name: 'react-brasil/vagas',
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
  androiddevbr: {
    name: 'androiddevbr/vagas',
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
    name: 'Desenvolvimento de software',
    icon: 'bx bxl-linkedin-square',
    source: JobSources.linkedin,
    dataSource: new Observable(),
    isActive: false,
    isLoading: false,
    isLoaded: false,
    hasFailedToLoad: false,
    searchStringKeywords: ['desenvolvedor'],
    initialDailyFetchDate: '08/02/2024',
  },
};
