import { ExperienceLevels } from 'src/app/shared/keywords-matcher/experience-levels.data';
import { KeywordData } from 'src/app/shared/keywords-matcher/technologies.data';
import { WorkplaceTypes } from 'src/app/shared/keywords-matcher/workplace.data';

export type SearchData = {
  keywords: KeywordData[];
  experienceLevels: ExperienceLevels[];
  workplaceTypes: WorkplaceTypes[];
};
