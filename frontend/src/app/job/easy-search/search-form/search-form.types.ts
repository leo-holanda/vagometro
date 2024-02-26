import { KeywordCategoryData } from 'src/app/shared/keywords-matcher/technologies.data';

export type KeywordOnSearchForm = {
  name: string;
  category: KeywordCategoryData;
  isSelected: boolean;
};
