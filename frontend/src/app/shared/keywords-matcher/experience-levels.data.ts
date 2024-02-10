export enum ExperienceLevels {
  intern = 'Estagiário',
  trainee = 'Trainee',
  junior = 'Júnior',
  mid = 'Pleno',
  senior = 'Sênior',
  specialist = 'Especialista',
  unknown = 'Desconhecido',
}

export type ExperienceLevelData = {
  level: ExperienceLevels;
  count: number;
};

export const internLevelRelatedTypes = ['vacancy_type_internship'];
export const traineeLevelRelatedTypes = ['vacancy_type_trainee'];
export const juniorLevelRelatedTypes = ['vacancy_type_apprentice', 'vacancy_type_associate'];

export interface ExperienceLevelRelatedTerms {
  termsForMatching: string[];
  defaultTerm: ExperienceLevels;
}

export const experienceLevelRelatedTerms: ExperienceLevelRelatedTerms[] = [
  {
    termsForMatching: ['estagiario', 'estagiaria'],
    defaultTerm: ExperienceLevels.intern,
  },
  {
    termsForMatching: ['trainee'],
    defaultTerm: ExperienceLevels.trainee,
  },
  {
    termsForMatching: ['júnior', 'junior', 'jr', 'jr.'],
    defaultTerm: ExperienceLevels.junior,
  },
  {
    termsForMatching: ['plena', 'pleno', 'pleno/sênior', 'pleno/senior', 'pl/sr', 'pl', 'pl.', 'pl/sr.'],
    defaultTerm: ExperienceLevels.mid,
  },
  {
    termsForMatching: ['sênior', 'senior', 'sr', 'sr.', 'iii', 'lll'],
    defaultTerm: ExperienceLevels.senior,
  },
  {
    termsForMatching: ['especialista'],
    defaultTerm: ExperienceLevels.specialist,
  },
];
