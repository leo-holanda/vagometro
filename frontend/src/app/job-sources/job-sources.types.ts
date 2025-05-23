import { Observable } from 'rxjs';
import { Job } from '../job/job.types';

export enum JobSources {
  gupy = 'gupy',
  github = 'github',
  linkedin = 'linkedin',
}

export enum Quarters {
  Q1 = "Q1",
  Q2 = "Q2",
  Q3 = "Q3",
  Q4 = "Q4",
}

export enum JobCollections {
  // Gupy
  gupyDev = 'gupyDev',
  gupyMobile = 'gupyMobile',
  gupyDevops = 'gupyDevops',
  gupyUIUX = 'gupyUIUX',
  gupyDados = 'gupyDados',
  gupyQA = 'gupyQA',
  gupyIA = 'gupyIA',
  gupyProductManager = 'gupyProductManager',
  gupyAgileRelated = 'gupyAgileRelated',
  gupyRecruitment = 'gupyRecruitment',

  // GitHub
  frontendbr = 'frontendbr',
  backendbr = 'backendbr',
  soujava = 'soujava',
  reactBrasil = 'reactBrasil',
  androidDevBr = 'androidDevBr',

  //LinkedIn
  linkedinDev = 'linkedinDev',
}

export type QuarterDataStatus = {
  isActive: boolean;
  isDownloading: boolean;
  isLoading: boolean;
  isLoaded: boolean;
  hasFailedToLoad: boolean;
  loadingProgress: number;
};


export type QuartersMap = Record<Quarters, QuarterDataStatus>
export type YearsMap = Record<number, QuartersMap>

export type JobCollectionData = {
  name: string;
  icon: string;
  source: string;
  dataSource: Observable<Job[]>;
  dataByYear: YearsMap;
  searchStringKeywords: string[];
  initialDailyFetchDate: string;
};

export type JobCollectionsMap = Record<JobCollections, JobCollectionData>;

const status: QuarterDataStatus = {
  isActive: false,
  isDownloading: false,
  isLoading: false,
  isLoaded: false,
  hasFailedToLoad: false,
  loadingProgress: 0,
};

const quartersMap: QuartersMap = {
  Q1: {...status},
  Q2: {...status},
  Q3: {...status},
  Q4: {...status},
}

const yearsMap: YearsMap = {
  2024: quartersMap,
  2025: quartersMap,
}

export const jobCollectionsMap: JobCollectionsMap = {
  gupyDev: {
    name: 'Desenvolvimento Web',
    icon: 'bx bxs-business',
    source: JobSources.gupy,
    dataSource: new Observable(),
    dataByYear: { ...yearsMap },
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
  gupyMobile: {
    name: 'Mobile',
    icon: 'bx bxs-business',
    source: JobSources.gupy,
    dataSource: new Observable(),
    dataByYear: { ...yearsMap },
    searchStringKeywords: ['mobile', 'android', 'ios'],
    initialDailyFetchDate: '05/02/2024',
  },
  gupyDevops: {
    name: 'DevOps',
    icon: 'bx bxs-business',
    source: JobSources.gupy,
    dataSource: new Observable(),
    dataByYear: { ...yearsMap },
    searchStringKeywords: ['devops', 'sre', 'devsecops', 'cloud'],
    initialDailyFetchDate: '05/02/2024',
  },
  gupyUIUX: {
    name: 'UI/UX',
    icon: 'bx bxs-business',
    source: JobSources.gupy,
    dataSource: new Observable(),
    dataByYear: { ...yearsMap },
    searchStringKeywords: ['ui', 'ux'],
    initialDailyFetchDate: '05/02/2024',
  },
  gupyDados: {
    name: 'Dados',
    icon: 'bx bxs-business',
    source: JobSources.gupy,
    dataSource: new Observable(),
    dataByYear: { ...yearsMap },
    searchStringKeywords: ['data', 'dados'],
    initialDailyFetchDate: '05/02/2024',
  },
  gupyQA: {
    name: 'QA',
    icon: 'bx bxs-business',
    source: JobSources.gupy,
    dataSource: new Observable(),
    dataByYear: { ...yearsMap },
    searchStringKeywords: ['qa', 'teste', 'quality assurance'],
    initialDailyFetchDate: '09/02/2024',
  },
  gupyIA: {
    name: 'IA',
    icon: 'bx bxs-business',
    source: JobSources.gupy,
    dataSource: new Observable(),
    dataByYear: { ...yearsMap },
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
    dataByYear: { ...yearsMap },
    searchStringKeywords: ['product manager'],
    initialDailyFetchDate: '22/02/2024',
  },
  gupyAgileRelated: {
    name: 'Agilista/Scrum Master',
    icon: 'bx bxs-business',
    source: JobSources.gupy,
    dataSource: new Observable(),
    dataByYear: { ...yearsMap },
    searchStringKeywords: ['agilista', 'scrum', 'agile'],
    initialDailyFetchDate: '23/02/2024',
  },
  gupyRecruitment: {
    name: 'Recrutamento',
    icon: 'bx bxs-business',
    source: JobSources.gupy,
    dataSource: new Observable(),
    dataByYear: { ...yearsMap },
    searchStringKeywords: ['recrutador', 'recruiter', 'recrutamento', 'recursos humanos', 'RH'],
    initialDailyFetchDate: '05/03/2024',
  },
  frontendbr: {
    name: 'frontendbr/vagas',
    icon: 'bx bxl-github',
    source: JobSources.github,
    dataSource: new Observable(),
    dataByYear: { ...yearsMap },
    searchStringKeywords: ['não se aplica'],
    initialDailyFetchDate: 'Em progresso',
  },
  backendbr: {
    name: 'backend-br/vagas',
    icon: 'bx bxl-github',
    source: JobSources.github,
    dataSource: new Observable(),
    dataByYear: { ...yearsMap },
    searchStringKeywords: ['não se aplica'],
    initialDailyFetchDate: 'Em progresso',
  },
  soujava: {
    name: 'soujava/vagas-java',
    icon: 'bx bxl-github',
    source: JobSources.github,
    dataSource: new Observable(),
    dataByYear: { ...yearsMap },
    searchStringKeywords: ['não se aplica'],
    initialDailyFetchDate: 'Em progresso',
  },
  reactBrasil: {
    name: 'react-brasil/vagas',
    icon: 'bx bxl-github',
    source: JobSources.github,
    dataSource: new Observable(),
    dataByYear: { ...yearsMap },
    searchStringKeywords: ['não se aplica'],
    initialDailyFetchDate: 'Em progresso',
  },
  androidDevBr: {
    name: 'androiddevbr/vagas',
    icon: 'bx bxl-github',
    source: JobSources.github,
    dataSource: new Observable(),
    dataByYear: { ...yearsMap },
    searchStringKeywords: ['não se aplica'],
    initialDailyFetchDate: 'Em progresso',
  },
  linkedinDev: {
    name: 'Desenvolvimento de software',
    icon: 'bx bxl-linkedin-square',
    source: JobSources.linkedin,
    dataSource: new Observable(),
    dataByYear: { ...yearsMap },
    searchStringKeywords: ['desenvolvedor'],
    initialDailyFetchDate: '08/02/2024',
  },
};
