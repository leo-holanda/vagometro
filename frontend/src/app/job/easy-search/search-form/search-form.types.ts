import { ContractTypes } from 'src/app/shared/keywords-matcher/contract-types.data';
import { ExperienceLevels } from 'src/app/shared/keywords-matcher/experience-levels.data';
import { KeywordCategoryData } from 'src/app/shared/keywords-matcher/technologies.data';
import { WorkplaceTypes } from 'src/app/shared/keywords-matcher/workplace.data';

interface SearchFormData {
  isSelected: boolean;
}

export interface KeywordOnSearchForm extends SearchFormData {
  name: string;
  category: KeywordCategoryData;
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
