import { Observable } from 'rxjs';
import { Job } from '../job/job.types';

export enum JobSources {
  gupy = 'gupy',
  github = 'github',
  linkedin = 'linkedin',
}

export enum Quarters {
  Q1 = 'Q1',
  Q2 = 'Q2',
  Q3 = 'Q3',
  Q4 = 'Q4',
}

function getCurrentQuarter(): Quarters {
  const today = new Date();
  const month = today.getMonth(); // 0 = January, 11 = December

  if (month >= 0 && month <= 2) {
    return Quarters.Q1;
  } else if (month >= 3 && month <= 5) {
    return Quarters.Q2;
  } else if (month >= 6 && month <= 8) {
    return Quarters.Q3;
  } else {
    return Quarters.Q4;
  }
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

export type QuarterData = {
  dataSource: Observable<Job[]>;
  isCurrentQuarter: boolean;
  isSelected: boolean;
  isDownloading: boolean;
  isLoading: boolean;
  isLoaded: boolean;
  hasFailedToLoad: boolean;
  loadingProgress: number;
};

export type QuartersMap = Record<Quarters, QuarterData>;
export type YearsMap = Record<number, QuartersMap>;

export type JobCollectionData = {
  name: string;
  icon: string;
  source: string;
  dataByYear: YearsMap;
  searchStringKeywords: string[];
  initialDailyFetchDate: string;
};

export type JobCollectionsMap = Record<JobCollections, JobCollectionData>;

export function createQuarterData(): QuarterData {
  return {
    dataSource: new Observable(),
    isCurrentQuarter: false,
    isSelected: false,
    isDownloading: false,
    isLoading: false,
    isLoaded: false,
    hasFailedToLoad: false,
    loadingProgress: 0,
  };
}

function createQuartersMap(): QuartersMap {
  const quartersMap = {
    Q1: createQuarterData(),
    Q2: createQuarterData(),
    Q3: createQuarterData(),
    Q4: createQuarterData(),
  };

  const currentQuarter = getCurrentQuarter();
  quartersMap[currentQuarter].isCurrentQuarter = true;
  return quartersMap;
}

function createYearsMap(): YearsMap {
  return {
    2024: createQuartersMap(),
    2025: createQuartersMap(),
  };
}

export const jobCollectionsMap: JobCollectionsMap = {
  gupyDev: {
    name: 'Desenvolvimento Web',
    icon: 'bx bxs-business',
    source: JobSources.gupy,
    dataByYear: createYearsMap(),
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
    dataByYear: createYearsMap(),
    searchStringKeywords: ['mobile', 'android', 'ios'],
    initialDailyFetchDate: '05/02/2024',
  },
  gupyDevops: {
    name: 'DevOps',
    icon: 'bx bxs-business',
    source: JobSources.gupy,
    dataByYear: createYearsMap(),
    searchStringKeywords: ['devops', 'sre', 'devsecops', 'cloud'],
    initialDailyFetchDate: '05/02/2024',
  },
  gupyUIUX: {
    name: 'UI/UX',
    icon: 'bx bxs-business',
    source: JobSources.gupy,
    dataByYear: createYearsMap(),
    searchStringKeywords: ['ui', 'ux'],
    initialDailyFetchDate: '05/02/2024',
  },
  gupyDados: {
    name: 'Dados',
    icon: 'bx bxs-business',
    source: JobSources.gupy,
    dataByYear: createYearsMap(),
    searchStringKeywords: ['data', 'dados'],
    initialDailyFetchDate: '05/02/2024',
  },
  gupyQA: {
    name: 'QA',
    icon: 'bx bxs-business',
    source: JobSources.gupy,
    dataByYear: createYearsMap(),
    searchStringKeywords: ['qa', 'teste', 'quality assurance'],
    initialDailyFetchDate: '09/02/2024',
  },
  gupyIA: {
    name: 'IA',
    icon: 'bx bxs-business',
    source: JobSources.gupy,
    dataByYear: createYearsMap(),
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
    dataByYear: createYearsMap(),
    searchStringKeywords: ['product manager'],
    initialDailyFetchDate: '22/02/2024',
  },
  gupyAgileRelated: {
    name: 'Agilista/Scrum Master',
    icon: 'bx bxs-business',
    source: JobSources.gupy,
    dataByYear: createYearsMap(),
    searchStringKeywords: ['agilista', 'scrum', 'agile'],
    initialDailyFetchDate: '23/02/2024',
  },
  gupyRecruitment: {
    name: 'Recrutamento',
    icon: 'bx bxs-business',
    source: JobSources.gupy,
    dataByYear: createYearsMap(),
    searchStringKeywords: ['recrutador', 'recruiter', 'recrutamento', 'recursos humanos', 'RH'],
    initialDailyFetchDate: '05/03/2024',
  },
  frontendbr: {
    name: 'frontendbr/vagas',
    icon: 'bx bxl-github',
    source: JobSources.github,
    dataByYear: createYearsMap(),
    searchStringKeywords: ['não se aplica'],
    initialDailyFetchDate: 'Em progresso',
  },
  backendbr: {
    name: 'backend-br/vagas',
    icon: 'bx bxl-github',
    source: JobSources.github,
    dataByYear: createYearsMap(),
    searchStringKeywords: ['não se aplica'],
    initialDailyFetchDate: 'Em progresso',
  },
  soujava: {
    name: 'soujava/vagas-java',
    icon: 'bx bxl-github',
    source: JobSources.github,
    dataByYear: createYearsMap(),
    searchStringKeywords: ['não se aplica'],
    initialDailyFetchDate: 'Em progresso',
  },
  reactBrasil: {
    name: 'react-brasil/vagas',
    icon: 'bx bxl-github',
    source: JobSources.github,
    dataByYear: createYearsMap(),
    searchStringKeywords: ['não se aplica'],
    initialDailyFetchDate: 'Em progresso',
  },
  androidDevBr: {
    name: 'androiddevbr/vagas',
    icon: 'bx bxl-github',
    source: JobSources.github,
    dataByYear: createYearsMap(),
    searchStringKeywords: ['não se aplica'],
    initialDailyFetchDate: 'Em progresso',
  },
  linkedinDev: {
    name: 'Desenvolvimento de software',
    icon: 'bx bxl-linkedin-square',
    source: JobSources.linkedin,
    dataByYear: createYearsMap(),
    searchStringKeywords: ['desenvolvedor'],
    initialDailyFetchDate: '08/02/2024',
  },
};

console.log(
  jobCollectionsMap['gupyDev'].dataByYear[2024]['Q1'] ==
    jobCollectionsMap['gupyDev'].dataByYear[2025]['Q1'],
);
