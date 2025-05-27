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
  isUpcomingQuarter: boolean;
  isSelected: boolean;
  isDownloading: boolean;
  isLoading: boolean;
  isLoaded: boolean;
  hasFailedToLoad: boolean;
  loadingProgress: number;

  canTrackDownloadProgress: boolean;
  downloadingProgress: number;
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
