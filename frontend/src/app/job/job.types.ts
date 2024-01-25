import { ExperienceLevels } from '../statistics/ranks/experience-levels-rank/experience-levels-rank.model';

export enum WorkplaceTypes {
  remote = 'remote',
  hybrid = 'hybrid',
  'on-site' = 'on-site',
  unknown = 'unknown',
}

export type Job = {
  id: number;
  companyUrl: string;
  companyName: string;
  title: string;
  description: string;
  jobUrl: string;
  workplaceType: WorkplaceTypes;
  country: string;
  state: string;
  city: string;
  isOpenToPCD: boolean;
  publishedDate: string;
  contractType: string;
  experienceLevel: ExperienceLevels;
  keywords: string[];
  educationTerms: string[];
  educationalLevelTerms: string[];
  languages: string[];
};

export enum TimeWindows {
  'day' = 'day',
  'week' = 'week',
  'month' = 'month',
  '6months' = '6months',
  'year' = 'year',
  'all' = 'all',
}
