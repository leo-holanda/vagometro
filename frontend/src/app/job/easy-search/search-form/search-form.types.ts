import { ExperienceLevels } from 'src/app/shared/keywords-matcher/experience-levels.data';
import { KeywordCategoryData } from 'src/app/shared/keywords-matcher/technologies.data';

export type KeywordOnSearchForm = {
  name: string;
  category: KeywordCategoryData;
  isSelected: boolean;
};

export type ExperienceLevelOnSearchForm = {
  name: ExperienceLevels;
  isSelected: boolean;
};
