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

function removeAccents(string: string): string {
  //TODO Understand how it works
  return string.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function getUniqueStrings(strings: string[]): string[] {
  const uniqueSet = new Set(strings);
  const uniqueArray = Array.from(uniqueSet);
  return uniqueArray;
}
