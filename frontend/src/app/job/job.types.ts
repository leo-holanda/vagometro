import { ExperienceLevels } from '../statistics/ranks/experience-levels-rank/experience-levels-rank.model';

export enum WorkplaceTypes {
  remote = 'Remoto',
  hybrid = 'Híbrido',
  'on-site' = 'Presencial',
  unknown = 'Desconhecido',
}

interface workplaceTypeRelatedTerms {
  [key: string]: WorkplaceTypes;
}

export const workplaceTypeRelatedTerms: workplaceTypeRelatedTerms = {
  remoto: WorkplaceTypes.remote,
  hibrido: WorkplaceTypes.hybrid,
  presencial: WorkplaceTypes['on-site'],
  'home office': WorkplaceTypes.remote,
  remote: WorkplaceTypes.remote,
  remota: WorkplaceTypes.remote,
};

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
