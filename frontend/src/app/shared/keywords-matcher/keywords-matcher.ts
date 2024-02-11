import { ContractTypes, contractTypeRelatedTerms } from './contract-types.data';
import { EducationalData, EducationalLevels, educationalLevelTerms, higherEducationCoursesNames } from './education.data';
import { ExperienceLevels, experienceLevelRelatedTerms } from './experience-levels.data';
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

export function matchExperienceLevel(content: { title: string | undefined; description: string | undefined }): ExperienceLevels[] {
  const matchedExperienceLevels: ExperienceLevels[] = [];

  // Split is necessary to avoid matching abbreviations like sr (sênior) and pl (pleno)
  if (content.title) {
    const sanitizedContent = sanitizeString(content.title).split(' ');
    matchedExperienceLevels.push(...matchExperienceLevelTerms(sanitizedContent));
  }

  // If you didn't found the level in the title, try the description
  if (matchedExperienceLevels.length == 0 && content.description) {
    const sanitizedContent = sanitizeString(content.description).split(' ');
    matchedExperienceLevels.push(...matchExperienceLevelTerms(sanitizedContent));
  }

  return (getUniqueStrings(matchedExperienceLevels) as ExperienceLevels[]) || [ExperienceLevels.unknown];
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
      coursesNames: [],
      educationalLevels: [EducationalLevels.unknown],
    };
  }

  const coursesNames = matchHigherEducationCoursesNames(content);
  const educationalLevels = matchEducationalLevel(content);
  if (coursesNames.length > 0) educationalLevels.push(EducationalLevels.bachelors);
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

function matchHigherEducationCoursesNames(content: string): string[] {
  const sanitizedContent = sanitizeString(content);
  return higherEducationCoursesNames
    .filter((courseName) => courseName.termsForMatching.some((term) => sanitizedContent.includes(term)))
    .map((courseName) => courseName.defaultTerm);
}

function matchEducationalLevel(content: string): string[] {
  const sanitizedContent = sanitizeString(content);
  return educationalLevelTerms
    .filter((educationalLevelTerm) => educationalLevelTerm.termsForMatching.some((term) => sanitizedContent.includes(term)))
    .map((educationalLevelTerm) => educationalLevelTerm.defaultTerm);
}

function matchExperienceLevelTerms(splittedContent: string[]): ExperienceLevels[] {
  return experienceLevelRelatedTerms
    .filter((experienceLevelTerms) => experienceLevelTerms.termsForMatching.some((term) => splittedContent.includes(term)))
    .map((experienceLevelTerms) => experienceLevelTerms.defaultTerm);
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
