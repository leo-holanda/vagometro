import { CertificationStatus, certificationRelatedTerms } from './certification.data';
import { ContractTypes, contractTypeRelatedTerms } from './contract-types.data';
import {
  EducationalData,
  EducationalLevels,
  HigherEducationCoursesNames,
  educationalLevelTerms,
  higherEducationCoursesNames,
} from './education.data';
import {
  ExperienceLevels,
  experienceLevelRelatedTerms,
  multiWordExperienceLevelRelatedTerms,
} from './experience-levels.data';
import { InclusionTypes, inclusionRelatedTerms } from './inclusion.data';
import { Languages, languageRelatedTerms } from './languages.data';
import { oneWordTechnologies, multiWordTechnologies, Technology } from './technologies.data';
import { WorkplaceTypes, workplaceTypeRelatedTerms } from './workplace.data';

export type MatcherInput = {
  title?: string;
  description?: string;
  labels?: string[];
};

export function matchLanguages(content: MatcherInput): Languages[] {
  const matchedLanguages: Languages[] = [];

  if (content.description) {
    const sanitizedContent = sanitizeString(content.description);
    const matchedLanguagesInDescription = languageRelatedTerms
      .filter((languageTerm) =>
        languageTerm.termsForMatching.some((term) => sanitizedContent.includes(term)),
      )
      .map((languageTerm) => languageTerm.defaultTerm);

    matchedLanguages.push(...matchedLanguagesInDescription);
  }

  if (content.labels) {
    const sanitizedContent = sanitizeString(content.labels.join(' '));
    const matchedLanguagesInLabels = languageRelatedTerms
      .filter((languageTerm) =>
        languageTerm.termsForMatching.some((term) => sanitizedContent.includes(term)),
      )
      .map((languageTerm) => languageTerm.defaultTerm);

    matchedLanguages.push(...matchedLanguagesInLabels);
  }

  return getUniqueStrings(matchedLanguages) as Languages[];
}

export function matchExperienceLevel(content: MatcherInput): ExperienceLevels[] {
  const matchedExperienceLevels: ExperienceLevels[] = [];

  // Split is necessary to avoid wrongly matching abbreviations like sr (sênior) and pl (pleno)
  if (content.title) {
    const sanitizedTitle = sanitizeString(content.title).split(' ');
    matchedExperienceLevels.push(...matchExperienceLevelTerms(sanitizedTitle));
  }

  // The title match has priority. But, if it doesn't happen then try with labels then description
  if (matchedExperienceLevels.length == 0 && content.labels) {
    const sanitizedLabels = sanitizeString(content.labels.join(' ')).split(' ');
    matchedExperienceLevels.push(...matchExperienceLevelTerms(sanitizedLabels));
  }

  if (matchedExperienceLevels.length == 0 && content.description) {
    const sanitizedSplittedDescription = sanitizeString(content.description).split(' ');
    matchedExperienceLevels.push(...matchExperienceLevelTerms(sanitizedSplittedDescription));
  }

  if (matchedExperienceLevels.length == 0 && content.description) {
    const sanitizedDescription = sanitizeString(content.description);
    matchedExperienceLevels.push(...matchExperienceLevelTermsWithoutSplit(sanitizedDescription));
  }

  const uniqueMatchedExperienceLevels = getUniqueStrings(
    matchedExperienceLevels,
  ) as ExperienceLevels[];

  if (uniqueMatchedExperienceLevels.length == 0) return [ExperienceLevels.unknown];
  return uniqueMatchedExperienceLevels;
}

export function matchTechnologies(content: MatcherInput): Technology[] {
  const jobTechnologies: Technology[] = [];

  if (content.title) {
    const sanitizedTitle = sanitizeString(content.title).split(' ');
    sanitizedTitle.forEach((substring: string) => {
      // The typeof check is necessary to prevent the keywords constructor being matched.
      if (oneWordTechnologies[substring] && typeof oneWordTechnologies[substring] !== 'function')
        jobTechnologies.push(oneWordTechnologies[substring]);
    });
  }

  if (content.description) {
    const sanitizedSplittedDescription = sanitizeString(content.description).split(' ');
    sanitizedSplittedDescription.forEach((substring: string) => {
      // The typeof check is necessary to prevent the keywords constructor being matched.
      if (oneWordTechnologies[substring] && typeof oneWordTechnologies[substring] !== 'function')
        jobTechnologies.push(oneWordTechnologies[substring]);
    });

    const sanitizedDescription = sanitizeString(content.description);
    Object.keys(multiWordTechnologies).forEach((keyword) => {
      if (sanitizedDescription.includes(keyword))
        jobTechnologies.push(multiWordTechnologies[keyword]);
    });
  }

  if (content.labels) {
    const sanitizedDescription = sanitizeString(content.labels.join(' ')).split(' ');
    sanitizedDescription.forEach((substring: string) => {
      // The typeof check is necessary to prevent the keyword constructor being matched.
      if (oneWordTechnologies[substring] && typeof oneWordTechnologies[substring] !== 'function')
        jobTechnologies.push(oneWordTechnologies[substring]);
    });
  }

  return getUniqueTechnologies(jobTechnologies).sort((a, b) =>
    a.category.name > b.category.name ? 1 : -1,
  );
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

  if (matchedInclusionTypes.length == 0) return [InclusionTypes.unknown];
  return getUniqueStrings(matchedInclusionTypes) as InclusionTypes[];
}

export function matchCertificationStatus(content: MatcherInput): CertificationStatus[] {
  const matchedCertificationStatus: CertificationStatus[] = [];

  if (content.description) {
    const sanitizedDescription = sanitizeString(content.description);

    Object.keys(certificationRelatedTerms).forEach((term) => {
      const descriptionHasTerm = sanitizedDescription.includes(term);
      if (descriptionHasTerm) matchedCertificationStatus.push(certificationRelatedTerms[term]);
    });
  }

  if (matchedCertificationStatus.length == 0) return [CertificationStatus.unknown];
  return getUniqueStrings(matchedCertificationStatus) as CertificationStatus[];
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
    /*
      This typeof check is necessary because there is a US company named Constructor
      Without this check, the constructor function becomes the job's assigned experience level
      This breakes the worker that runs the mapToJob function
    */
    if (matchedExperienceLevel && typeof matchedExperienceLevel === 'string')
      matchedExperienceLevels.push(matchedExperienceLevel);
  });

  return matchedExperienceLevels;
}

function matchExperienceLevelTermsWithoutSplit(content: string): ExperienceLevels[] {
  const matchedExperienceLevels: ExperienceLevels[] = [];

  Object.keys(multiWordExperienceLevelRelatedTerms).forEach((term) => {
    if (content.includes(term)) {
      matchedExperienceLevels.push(multiWordExperienceLevelRelatedTerms[term]);
    }
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
    .replaceAll('.', ' ')
    .replaceAll('(', ' ')
    .replaceAll(')', ' ')
    .replaceAll('-', ' ')
    .replaceAll('[', ' ')
    .replaceAll(']', ' ')
    .replaceAll(';', ' ');
}

export function removeAccents(string: string): string {
  //TODO Understand how it works
  return string.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function getUniqueStrings(strings: string[]): string[] {
  const uniqueSet = new Set(strings);
  const uniqueArray = Array.from(uniqueSet);
  return uniqueArray;
}

function getUniqueTechnologies(technologies: Technology[]): Technology[] {
  const uniqueSet = new Set();
  const uniqueArray: Technology[] = [];

  technologies.forEach((technology) => {
    if (!uniqueSet.has(technology.name)) {
      uniqueSet.add(technology.name);
      uniqueArray.push(technology);
    }
  });

  return uniqueArray;
}
