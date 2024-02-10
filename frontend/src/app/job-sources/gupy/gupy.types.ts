import { ContractTypes } from 'src/app/shared/keywords-matcher/contract-types.data';
import { ExperienceLevels } from 'src/app/shared/keywords-matcher/experience-levels.data';

export type GupyJob = {
  careerPageUrl: string;
  jobUrl: string;
  isRemoteWork: boolean;
  companyId: number;
  partition_key: number;
  workplaceType: string;
  sort_key: string;
  country: string;
  name: string;
  state: string;
  city: string;
  disabilities: boolean;
  careerPageId: number;
  applicationDeadline: string;
  badges: Badges;
  careerPageLogo: string;
  careerPageName: string;
  description: string;
  id: number;
  publishedDate: string;
  type: string;
  //Attributes below were added by me
  experienceLevel: ExperienceLevels;
  keywords: string[];
  educationTerms: string[];
  educationalLevelTerms: string[];
  languages: string[];
};

export type Badges = {
  friendlyBadge: boolean;
};

export enum TimeWindows {
  'day' = 'day',
  'week' = 'week',
  'month' = 'month',
  '6months' = '6months',
  'year' = 'year',
  'all' = 'all',
}

export interface GupyContractTypeMap {
  [key: string]: ContractTypes;
}

export const gupyContractTypeMap: GupyContractTypeMap = {
  vacancy_type_apprentice: ContractTypes.apprentice,
  vacancy_type_associate: ContractTypes.associate,
  vacancy_type_talent_pool: ContractTypes.talent_pool,
  vacancy_type_effective: ContractTypes.CLT,
  vacancy_type_internship: ContractTypes.intern,
  vacancy_type_summer: ContractTypes.summer,
  vacancy_type_temporary: ContractTypes.temporary,
  vacancy_type_outsource: ContractTypes.outsource,
  vacancy_type_trainee: ContractTypes.intern,
  vacancy_type_volunteer: ContractTypes.volunteer,
  vacancy_legal_entity: ContractTypes.PJ,
  vacancy_type_lecturer: ContractTypes.lecturer,
  vacancy_type_freelancer: ContractTypes.freelance,
  vacancy_type_autonomous: ContractTypes.autonomous,
};
