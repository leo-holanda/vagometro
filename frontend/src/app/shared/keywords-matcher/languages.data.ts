export enum Languages {
  english = 'Inglês',
  spanish = 'Espanhol',
  french = 'Francês',
  german = 'Alemão',
  mandarin = 'Mandarim',
  italian = 'Italiano',
  japanese = 'Japonês',
}

export interface LanguageRelatedTerms {
  termsForMatching: string[];
  defaultTerm: Languages;
}

export const languageRelatedTerms: LanguageRelatedTerms[] = [
  {
    termsForMatching: ['ingles', 'inglês', 'english'],
    defaultTerm: Languages.english,
  },
  {
    termsForMatching: ['espanhol', 'español', 'spanish'],
    defaultTerm: Languages.spanish,
  },
  {
    termsForMatching: ['frances', 'french'],
    defaultTerm: Languages.french,
  },
  {
    termsForMatching: ['alemao', 'german'],
    defaultTerm: Languages.german,
  },
  {
    termsForMatching: ['mandarim', 'mandarin'],
    defaultTerm: Languages.mandarin,
  },
  {
    termsForMatching: ['italiano', 'italian'],
    defaultTerm: Languages.italian,
  },
  {
    termsForMatching: ['japones', 'japanese'],
    defaultTerm: Languages.japanese,
  },
];
