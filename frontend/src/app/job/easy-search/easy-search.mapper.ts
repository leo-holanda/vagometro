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

  const matchedExperienceLevels = job.experienceLevels.filter((experienceLevel) =>
    searchData.experienceLevels.includes(experienceLevel),
  );

  const matchedWorkplaceTypes = job.workplaceTypes.filter((workplaceType) => {
    searchData.workplaceTypes.includes(workplaceType);
  });

  const matchedContractTypes = job.contractTypes.filter((contractType) =>
    searchData.contractTypes.includes(contractType),
  );

  const matchedInclusionTypes = job.inclusionTypes.filter((inclusionType) =>
    searchData.inclusionTypes.includes(inclusionType),
  );

  const howManyItemsWereMatched =
    matchedKeywords.length +
    matchedExperienceLevels.length +
    matchedWorkplaceTypes.length +
    matchedContractTypes.length +
    matchedInclusionTypes.length;

  const howManyItemsWereSelected =
    searchDataKeywords.length +
    searchData.experienceLevels.length +
    searchData.workplaceTypes.length +
    searchData.contractTypes.length +
    searchData.inclusionTypes.length;

  const matchPercentage = (howManyItemsWereMatched / howManyItemsWereSelected) * 100;
  return matchPercentage;
}
