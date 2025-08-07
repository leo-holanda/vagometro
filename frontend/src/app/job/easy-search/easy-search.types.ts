import { ContractTypes } from 'src/app/shared/keywords-matcher/contract-types.data';
import { ExperienceLevels } from 'src/app/shared/keywords-matcher/experience-levels.data';
import { InclusionTypes } from 'src/app/shared/keywords-matcher/inclusion.data';
import { Technology } from 'src/app/shared/keywords-matcher/technologies.data';
import { WorkplaceTypes } from 'src/app/shared/keywords-matcher/workplace.data';
import { Job } from '../job.types';

export const TIP_TOAST_FLAG = 'shouldShowTipToast';

export enum SortOrders {
  ascending = 'ascending',
  descending = 'descending',
}

export type SearchData = {
  technologies: Technology[];
  experienceLevels: ExperienceLevels[];
  workplaceTypes: WorkplaceTypes[];
  contractTypes: ContractTypes[];
  inclusionTypes: InclusionTypes[];
  excludedCompanies: string[];
  sortBy: keyof Job;
  sortOrder: SortOrders;
};
