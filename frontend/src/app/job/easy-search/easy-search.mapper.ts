import { Job } from '../job.types';
import { SearchData } from './easy-search.types';

export function getJobMatchPercentage(
  job: Job,
  searchData: SearchData | undefined,
): number | undefined {
  if (searchData == undefined) return undefined;

  const searchDataKeywords = searchData.keywords.map((keyword) => keyword.name);
  const matchedKeywords = job.keywords.filter((keyword) =>
    searchDataKeywords.includes(keyword.name),
  );

  const hasMatchedExperienceLevels = job.experienceLevels.some((experienceLevel) =>
    searchData.experienceLevels.includes(experienceLevel),
  );

  const hasMatchedWorkplaceTypes = job.workplaceTypes.some((workplaceType) =>
    searchData.workplaceTypes.includes(workplaceType),
  );

  const hasMatchedContractTypes = job.contractTypes.some((contractType) =>
    searchData.contractTypes.includes(contractType),
  );

  const hasMatchedInclusionTypes = job.inclusionTypes.some((inclusionType) =>
    searchData.inclusionTypes.includes(inclusionType),
  );

  const howManyItemsWereMatched =
    matchedKeywords.length +
    (hasMatchedExperienceLevels ? 1 : 0) +
    (hasMatchedWorkplaceTypes ? 1 : 0) +
    (hasMatchedContractTypes ? 1 : 0) +
    (hasMatchedInclusionTypes ? 1 : 0);

  const howManyItemsWereSelected =
    searchDataKeywords.length +
    (searchData.experienceLevels.length ? 1 : 0) +
    (searchData.workplaceTypes.length ? 1 : 0) +
    (searchData.contractTypes.length ? 1 : 0) +
    (searchData.inclusionTypes.length ? 1 : 0);

  const matchPercentage = (howManyItemsWereMatched / howManyItemsWereSelected) * 100;
  return matchPercentage;
}
