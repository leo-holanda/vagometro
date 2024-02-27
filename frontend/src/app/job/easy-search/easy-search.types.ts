import { ContractTypes } from 'src/app/shared/keywords-matcher/contract-types.data';
import { ExperienceLevels } from 'src/app/shared/keywords-matcher/experience-levels.data';
import { InclusionTypes } from 'src/app/shared/keywords-matcher/inclusion.data';
import { KeywordData } from 'src/app/shared/keywords-matcher/technologies.data';
import { WorkplaceTypes } from 'src/app/shared/keywords-matcher/workplace.data';

export type SearchData = {
  keywords: KeywordData[];
  experienceLevels: ExperienceLevels[];
  workplaceTypes: WorkplaceTypes[];
  contractTypes: ContractTypes[];
  inclusionTypes: InclusionTypes[];
};
