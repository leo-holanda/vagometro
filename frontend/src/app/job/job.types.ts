import { DisabilityStatuses } from '../statistics/ranks/disability-rank/disability-rank.model';
import { ExperienceLevels } from '../statistics/ranks/experience-levels-rank/experience-levels-rank.model';

export enum WorkplaceTypes {
  remote = 'Remoto',
  hybrid = 'Híbrido',
  'on-site' = 'Presencial',
  unknown = 'Desconhecido',
}

export enum ContractTypes {
  CLT = 'CLT',
  PJ = 'Pessoa Jurídica',
  intern = 'Estágio',
  freelance = 'Freelance',
  allocated = 'Alocado',
  unknown = 'Desconhecido',
}

interface workplaceTypeRelatedTerms {
  [key: string]: WorkplaceTypes;
}

interface contractTypesRelatedTerms {
  [key: string]: ContractTypes;
}

export const workplaceTypeRelatedTerms: workplaceTypeRelatedTerms = {
  remoto: WorkplaceTypes.remote,
  hibrido: WorkplaceTypes.hybrid,
  presencial: WorkplaceTypes['on-site'],
  'home office': WorkplaceTypes.remote,
  remote: WorkplaceTypes.remote,
  remota: WorkplaceTypes.remote,
};

export const contractTypeRelatedTerms: contractTypesRelatedTerms = {
  clt: ContractTypes.CLT,
  pj: ContractTypes.PJ,
  alocado: ContractTypes.allocated,
  freelance: ContractTypes.freelance,
  freela: ContractTypes.freelance,
  estagio: ContractTypes.intern,
  estagiario: ContractTypes.intern,
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
  disabilityStatus: DisabilityStatuses;
  publishedDate: Date;
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
