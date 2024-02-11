import { ContractTypes, contractTypeRelatedTerms } from './contract-types.data';
import {
  EducationalData,
  EducationalLevels,
  HigherEducationCoursesNames,
  educationalLevelTerms,
  higherEducationCoursesNames,
} from './education.data';
import { ExperienceLevels, experienceLevelRelatedTerms } from './experience-levels.data';
import { InclusionTypes, inclusionRelatedTerms } from './inclusion.data';
import { Languages, languageRelatedTerms } from './languages.data';
import { keywords } from './technologies.data';
import { WorkplaceTypes, workplaceTypeRelatedTerms } from './workplace.data';

export type MatcherInput = {
  title: string | undefined;
  description: string | undefined;
  labels?: string[];
};

export function matchLanguages(content: string | undefined): Languages[] {
  if (!content) return [];

  const sanitizedContent = sanitizeString(content);
  const matchedLanguages = languageRelatedTerms
    .filter((languageTerm) => languageTerm.termsForMatching.some((term) => sanitizedContent.includes(term)))
    .map((languageTerm) => languageTerm.defaultTerm);

  return getUniqueStrings(matchedLanguages) as Languages[];
}

export function matchExperienceLevel(content: MatcherInput): ExperienceLevels[] {
  const matchedExperienceLevels: ExperienceLevels[] = [];

  // Split is necessary to avoid wrongly matching abbreviations like sr (sênior) and pl (pleno)
  if (content.title) {
    const sanitizedTitle = sanitizeString(content.title).split(' ');
    matchedExperienceLevels.push(...matchExperienceLevelTerms(sanitizedTitle));
  }

  // The title match has priority. But, if it doesn't happen then try with description
  if (matchedExperienceLevels.length == 0 && content.description) {
    const sanitizedDescription = sanitizeString(content.description).split(' ');
    matchedExperienceLevels.push(...matchExperienceLevelTerms(sanitizedDescription));
  }

  if (matchedExperienceLevels.length == 0 && content.labels) {
    const sanitizedLabels = sanitizeString(content.labels.join(' ')).split(' ');
    matchedExperienceLevels.push(...matchExperienceLevelTerms(sanitizedLabels));
  }

  const uniqueMatchedExperienceLevels = getUniqueStrings(matchedExperienceLevels) as ExperienceLevels[];

  if (uniqueMatchedExperienceLevels.length == 0) return [ExperienceLevels.unknown];
  return uniqueMatchedExperienceLevels;
}

export function matchKeywords(content: { title: string | undefined; description: string | undefined }): string[] {
  const jobKeywords: string[] = [];

  if (content.title) {
    const sanitizedTitle = sanitizeString(content.title).split(' ');
    sanitizedTitle.forEach((substring: string) => {
      // The typeof check is necessary to prevent the keywords constructor being matched.
      if (keywords[substring] && typeof keywords[substring] === 'string') jobKeywords.push(keywords[substring]);
    });
  }

  if (content.description) {
    const sanitizedDescription = sanitizeString(content.description).split(' ');
    sanitizedDescription.forEach((substring: string) => {
      // The typeof check is necessary to prevent the keywords constructor being matched.
      if (keywords[substring] && typeof keywords[substring] === 'string') jobKeywords.push(keywords[substring]);
    });
  }

  return getUniqueStrings(jobKeywords);
}

export function matchEducationalTerms(content: string): EducationalData {
  if (!content) {
    return {
      coursesNames: [HigherEducationCoursesNames.unknown],
      educationalLevels: [EducationalLevels.unknown],
    };
  }

  const coursesNames = matchHigherEducationCoursesNames(content);
  const educationalLevels = matchEducationalLevel(content);
  if (coursesNames.length > 0) educationalLevels.push(EducationalLevels.bachelors);
  else coursesNames.push(HigherEducationCoursesNames.unknown);

  if (educationalLevels.length == 0) educationalLevels.push(EducationalLevels.unknown);

  return {
    coursesNames,
    educationalLevels: getUniqueStrings(educationalLevels) as EducationalLevels[],
  };
}

export function matchWorkplaceTypes(content: MatcherInput): WorkplaceTypes[] {
  const matchedWorkplaceTypes: WorkplaceTypes[] = [];

  if (content.title) {
    const sanitizedTitle = sanitizeString(content.title);

    Object.keys(workplaceTypeRelatedTerms).forEach((term) => {
      const titleHasTerm = sanitizedTitle.includes(term);
      if (titleHasTerm) matchedWorkplaceTypes.push(workplaceTypeRelatedTerms[term]);
    });
  }

  if (content.description) {
    const sanitizedDescription = sanitizeString(content.description);

    Object.keys(workplaceTypeRelatedTerms).forEach((term) => {
      const descriptionHasTerm = sanitizedDescription.includes(term);
      if (descriptionHasTerm) matchedWorkplaceTypes.push(workplaceTypeRelatedTerms[term]);
    });
  }

  if (content.labels) {
    const sanitizedLabels = sanitizeString(content.labels.join(' '));

    Object.keys(workplaceTypeRelatedTerms).forEach((term) => {
      const labelsHasTerm = sanitizedLabels.includes(term);
      if (labelsHasTerm) matchedWorkplaceTypes.push(workplaceTypeRelatedTerms[term]);
    });
  }

  // TODO: If no match happened but job has a city or state, match with on-site

  if (matchedWorkplaceTypes.length == 0) return [WorkplaceTypes.unknown];
  return getUniqueStrings(matchedWorkplaceTypes) as WorkplaceTypes[];
}

export function matchContractTypes(content: MatcherInput): ContractTypes[] {
  const matchedContractTypes: ContractTypes[] = [];

  if (content.title) {
    const sanitizedTitle = sanitizeString(content.title);

    Object.keys(contractTypeRelatedTerms).forEach((term) => {
      const titleHasTerm = sanitizedTitle.includes(term);
      if (titleHasTerm) matchedContractTypes.push(contractTypeRelatedTerms[term]);
    });
  }

  if (content.description) {
    const sanitizedDescription = sanitizeString(content.description);

    Object.keys(contractTypeRelatedTerms).forEach((term) => {
      const descriptionHasTerm = sanitizedDescription.includes(term);
      if (descriptionHasTerm) matchedContractTypes.push(contractTypeRelatedTerms[term]);
    });
  }

  if (content.labels) {
    const sanitizedLabels = sanitizeString(content.labels.join(' '));

    Object.keys(contractTypeRelatedTerms).forEach((term) => {
      const labelsHasTerm = sanitizedLabels.includes(term);
      if (labelsHasTerm) matchedContractTypes.push(contractTypeRelatedTerms[term]);
    });
  }

  // TODO: If no match happened but job has a city or state, match with on-site

  if (matchedContractTypes.length == 0) return [ContractTypes.unknown];
  return getUniqueStrings(matchedContractTypes) as ContractTypes[];
}

export function matchInclusionTypes(content: MatcherInput): InclusionTypes[] {
  const matchedInclusionTypes: InclusionTypes[] = [];

  if (content.title) {
    const sanitizedTitle = sanitizeString(content.title);

    Object.keys(inclusionRelatedTerms).forEach((term) => {
      const titleHasTerm = sanitizedTitle.includes(term);
      if (titleHasTerm) matchedInclusionTypes.push(inclusionRelatedTerms[term]);
    });
  }

  if (content.description) {
    const sanitizedDescription = sanitizeString(content.description);

    Object.keys(inclusionRelatedTerms).forEach((term) => {
      const descriptionHasTerm = sanitizedDescription.includes(term);
      if (descriptionHasTerm) matchedInclusionTypes.push(inclusionRelatedTerms[term]);
    });
  }

  if (content.labels) {
    const sanitizedLabels = sanitizeString(content.labels.join(' '));

    Object.keys(inclusionRelatedTerms).forEach((term) => {
      const labelsHasTerm = sanitizedLabels.includes(term);
      if (labelsHasTerm) matchedInclusionTypes.push(inclusionRelatedTerms[term]);
    });
  }

  // TODO: If no match happened but job has a city or state, match with on-site
  if (matchedInclusionTypes.length == 0) return [InclusionTypes.unknown];
  return getUniqueStrings(matchedInclusionTypes) as InclusionTypes[];
}

function matchHigherEducationCoursesNames(content: string): string[] {
  const matchedCoursesNames: string[] = [];

  const sanitizedContent = sanitizeString(content);
  Object.keys(higherEducationCoursesNames).forEach((term) => {
    const contentHasTerm = sanitizedContent.includes(term);
    if (contentHasTerm) matchedCoursesNames.push(higherEducationCoursesNames[term]);
  });

  return matchedCoursesNames;
}

function matchEducationalLevel(content: string): string[] {
  const matchedEducationalLevels: string[] = [];

  const sanitizedContent = sanitizeString(content);
  Object.keys(educationalLevelTerms).forEach((term) => {
    const contentHasTerm = sanitizedContent.includes(term);
    if (contentHasTerm) matchedEducationalLevels.push(educationalLevelTerms[term]);
  });

  return matchedEducationalLevels;
}

function matchExperienceLevelTerms(splittedContent: string[]): ExperienceLevels[] {
  const matchedExperienceLevels: ExperienceLevels[] = [];

  splittedContent.forEach((contentSubstring) => {
    const matchedExperienceLevel = experienceLevelRelatedTerms[contentSubstring];
    if (matchedExperienceLevel) matchedExperienceLevels.push(matchedExperienceLevel);
  });

  return matchedExperienceLevels;
}

function sanitizeString(content: string): string {
  return removeSymbols(removeAccents(content)).toLowerCase();
}

function removeSymbols(string: string): string {
  // Do not add the dot symbol. Think about .NET first
  return string
    .replaceAll('/', ' ')
    .replaceAll(',', ' ')
    .replaceAll('(', ' ')
    .replaceAll(')', ' ')
    .replaceAll('-', ' ')
    .replaceAll('[', ' ')
    .replaceAll(']', ' ')
    .replaceAll(';', ' ');
}

function removeAccents(string: string): string {
  //TODO Understand how it works
  return string.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function getUniqueStrings(strings: string[]): string[] {
  const uniqueSet = new Set(strings);
  const uniqueArray = Array.from(uniqueSet);
  return uniqueArray;
}
