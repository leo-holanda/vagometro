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

export type ExperienceLevelRelatedTerms = {
  [key: string]: ExperienceLevels;
};

export const experienceLevelRelatedTerms: ExperienceLevelRelatedTerms = {
  estagio: ExperienceLevels.intern,
  estagiario: ExperienceLevels.intern,
  estagiaria: ExperienceLevels.intern,

  trainee: ExperienceLevels.trainee,

  júnior: ExperienceLevels.junior,
  junior: ExperienceLevels.junior,
  jr: ExperienceLevels.junior,
  'jr.': ExperienceLevels.junior,

  plena: ExperienceLevels.mid,
  pleno: ExperienceLevels.mid,
  'pleno/sênior': ExperienceLevels.mid,
  'pleno/senior': ExperienceLevels.mid,
  'pl/sr': ExperienceLevels.mid,
  pl: ExperienceLevels.mid,
  'pl.': ExperienceLevels.mid,
  'pl/sr.': ExperienceLevels.mid,

  sênior: ExperienceLevels.senior,
  senior: ExperienceLevels.senior,
  sr: ExperienceLevels.senior,
  'sr.': ExperienceLevels.senior,
  iii: ExperienceLevels.senior,
  lll: ExperienceLevels.senior,

  especialista: ExperienceLevels.specialist,
};
