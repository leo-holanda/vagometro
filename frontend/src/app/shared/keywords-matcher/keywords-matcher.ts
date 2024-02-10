import { ExperienceLevels, experienceLevelRelatedTerms } from './experience-levels.data';
import { Languages, languageRelatedTerms } from './languages.data';

export function matchLanguages(content: string): Languages[] {
  const sanitizedContent = removeAccents(content).toLowerCase();

  const matchedLanguages = languageRelatedTerms
    .filter((languageTerm) => {
      const hasTerm = languageTerm.termsForMatching.some((term) => sanitizedContent.includes(term));
      return hasTerm;
    })
    .map((languageTerm) => languageTerm.defaultTerm);

  return getUniqueStrings(matchedLanguages) as Languages[];
}

export function matchExperienceLevel(content: { title: string; description: string }): ExperienceLevels[] {
  const matchedExperienceLevels: ExperienceLevels[] = [];

  // Split is necessary to avoid matching abbreviations like sr (sênior) and pl (pleno)
  const sanitizedContent = sanitizeString(content.title).split(' ');
  matchedExperienceLevels.push(...matchExperienceLevelTerms(sanitizedContent));

  // If you didn't found the level in the title, try the description
  if (matchedExperienceLevels.length == 0) {
    const sanitizedContent = sanitizeString(content.description).split(' ');
    matchedExperienceLevels.push(...matchExperienceLevelTerms(sanitizedContent));
  }

  return (getUniqueStrings(matchedExperienceLevels) as ExperienceLevels[]) || [ExperienceLevels.unknown];
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
