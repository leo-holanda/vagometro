import { Job } from '../job.types';
import { SearchData } from './easy-search.types';

export function getJobMatchPercentage(
  job: Job,
  searchData: SearchData | undefined,
): number | undefined {
  if (searchData == undefined) return undefined;

  let matchedTechnologiesQuantity = 0;
  job.keywords.forEach((keyword) => {
    keyword.matchesSearchParameters = searchData.technologies.some(
      (technology) => technology.name == keyword.name,
    );
    if (keyword.matchesSearchParameters) matchedTechnologiesQuantity++;
  });

  let hasMatchedExperienceLevels = false;
  job.experienceLevels.forEach((experienceLevel) => {
    experienceLevel.matchesSearchParameters = searchData.experienceLevels.includes(
      experienceLevel.name,
    );

    hasMatchedExperienceLevels =
      experienceLevel.matchesSearchParameters || hasMatchedExperienceLevels;
  });

  let hasMatchedWorkplaceTypes = false;
  job.workplaceTypes.forEach((workplaceType) => {
    workplaceType.matchesSearchParameters = searchData.workplaceTypes.includes(workplaceType.type);
    hasMatchedWorkplaceTypes = workplaceType.matchesSearchParameters || hasMatchedWorkplaceTypes;
  });

  let hasMatchedContractTypes = false;
  job.contractTypes.forEach((contractType) => {
    contractType.matchesSearchParameters = searchData.contractTypes.includes(contractType.type);
    hasMatchedContractTypes = contractType.matchesSearchParameters || hasMatchedContractTypes;
  });

  let hasMatchedInclusionTypes = false;
  job.inclusionTypes.forEach((inclusionType) => {
    inclusionType.matchesSearchParameters = searchData.inclusionTypes.includes(inclusionType.type);
    hasMatchedInclusionTypes = inclusionType.matchesSearchParameters || hasMatchedInclusionTypes;
  });

  const howManyItemsWereMatched =
    matchedTechnologiesQuantity +
    (hasMatchedExperienceLevels ? 1 : 0) +
    (hasMatchedWorkplaceTypes ? 1 : 0) +
    (hasMatchedContractTypes ? 1 : 0) +
    (hasMatchedInclusionTypes ? 1 : 0);

  const howManyItemsWereSelected =
    searchData.technologies.length +
    (searchData.experienceLevels.length ? 1 : 0) +
    (searchData.workplaceTypes.length ? 1 : 0) +
    (searchData.contractTypes.length ? 1 : 0) +
    (searchData.inclusionTypes.length ? 1 : 0);

  const matchPercentage = (howManyItemsWereMatched / howManyItemsWereSelected) * 100;
  return matchPercentage;
}
