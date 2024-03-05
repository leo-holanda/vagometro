import { ContractTypes } from '../shared/keywords-matcher/contract-types.data';
import { ExperienceLevels } from '../shared/keywords-matcher/experience-levels.data';
import { WorkplaceTypes } from '../shared/keywords-matcher/workplace.data';
import { InclusionTypes } from '../shared/keywords-matcher/inclusion.data';
import { CertificationStatus } from '../shared/keywords-matcher/certification.data';
import { KeywordData } from '../shared/keywords-matcher/technologies.data';

export type Job = {
  id: number;
  companyUrl: string;
  companyName: string;
  title: string;
  description: string;
  jobUrl: string;
  workplaceTypes: WorkplaceTypes[];
  country: string;
  state: string;
  city: string;
  inclusionTypes: InclusionTypes[];
  publishedDate: Date;
  contractTypes: ContractTypes[];
  experienceLevels: ExperienceLevels[];
  keywords: KeywordData[];
  educationTerms: string[];
  educationalLevelTerms: string[];
  languages: string[];
  certificationStatuses: CertificationStatus[];
  matchPercentage?: number;
  repostings: Job[];
};

export enum TimeWindows {
  'yesterday' = 'yesterday',
  'today' = 'today',
  'week' = 'week',
  'month' = 'month',
  '6months' = '6months',
  'year' = 'year',
  'all' = 'all',
}

export type MonthsMap = {
  [key: number]: string;
};

export const monthsMap: MonthsMap = {
  0: 'Janeiro',
  1: 'Fevereiro',
  2: 'Março',
  3: 'Abril',
  4: 'Maio',
  5: 'Junho',
  6: 'Julho',
  7: 'Agosto',
  8: 'Setembro',
  9: 'Outubro',
  10: 'Novembro',
  11: 'Dezembro',
};
