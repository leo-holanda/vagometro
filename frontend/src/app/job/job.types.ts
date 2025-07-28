import { ContractData } from '../shared/keywords-matcher/contract-types.data';
import { ExperienceData } from '../shared/keywords-matcher/experience-levels.data';
import { WorkplaceData } from '../shared/keywords-matcher/workplace.data';
import { InclusionData } from '../shared/keywords-matcher/inclusion.data';
import { CertificationStatus } from '../shared/keywords-matcher/certification.data';
import { TechnologyData } from '../shared/keywords-matcher/technologies.data';

export enum InteractionStatuses {
  APPLIED = 'applied',
  VIEWED = 'viewed',
  ACCESSED = 'accessed',
  DISCARDED = 'discarded',
}

export type InteractionStatus = {
  [key in InteractionStatuses]: boolean;
};

export enum JobLists {
  TO_DECIDE = 'to_decide',
  APPLIED = 'applied',
  DISCARDED = 'discarded',
}

export type Job = {
  id: number;
  companyUrl: string;
  companyName: string;
  title: string;
  description: string;
  jobUrl: string;
  workplaceTypes: WorkplaceData[];
  country: string;
  state: string;
  city: string;
  inclusionTypes: InclusionData[];
  publishedDate: Date;
  contractTypes: ContractData[];
  experienceLevels: ExperienceData[];
  keywords: TechnologyData[];
  educationTerms: string[];
  educationalLevelTerms: string[];
  languages: string[];
  certificationStatuses: CertificationStatus[];
  matchPercentage?: number;
  repostings: Job[];
  timeInDaysBetweenRepostings: number;
  interactionStatus: InteractionStatus;
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
