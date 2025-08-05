import { ContractTypes } from 'src/app/shared/keywords-matcher/contract-types.data';
import { ExperienceLevels } from 'src/app/shared/keywords-matcher/experience-levels.data';
import { InclusionTypes } from 'src/app/shared/keywords-matcher/inclusion.data';
import { TechnologyCategory } from 'src/app/shared/keywords-matcher/technologies.data';
import { WorkplaceTypes } from 'src/app/shared/keywords-matcher/workplace.data';

interface SearchFormData {
  isSelected: boolean;
}

export interface KeywordOnSearchForm extends SearchFormData {
  name: string;
  category: TechnologyCategory;
}

export interface ExperienceLevelOnSearchForm extends SearchFormData {
  name: ExperienceLevels;
}

export interface WorkplaceTypeOnSearchForm extends SearchFormData {
  name: WorkplaceTypes;
}

export interface ContractTypesOnSearchForm extends SearchFormData {
  name: ContractTypes;
}

export interface InclusionTypesOnSearchForm extends SearchFormData {
  name: InclusionTypes;
}

export interface CompaniesOnSearchForm extends SearchFormData {
  name: string;
}
