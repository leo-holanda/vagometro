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

  const howManyItemsWereMatched = matchedKeywords.length + matchedExperienceLevels.length;
  const howManyItemsWereSelected = searchDataKeywords.length + searchData.experienceLevels.length;

  const matchPercentage = (howManyItemsWereMatched / howManyItemsWereSelected) * 100;
  return matchPercentage;
}
