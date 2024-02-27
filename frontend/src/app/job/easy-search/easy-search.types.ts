import { ExperienceLevels } from 'src/app/shared/keywords-matcher/experience-levels.data';
import { KeywordData } from 'src/app/shared/keywords-matcher/technologies.data';

export type SearchData = {
  keywords: KeywordData[];
  experienceLevels: ExperienceLevels[];
};
