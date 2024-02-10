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

export const internLevelRelatedTerms = ['estagiario', 'estagiaria'];
export const traineeLevelRelatedTerms = ['trainee'];
export const juniorLevelRelatedTerms = ['júnior', 'junior', 'jr', 'jr.', 'i', 'l'];

export const midLevelRelatedTerms = ['plena', 'pleno', 'pleno/sênior', 'pleno/senior', 'pl/sr', 'pl', 'pl.', 'pl/sr.', 'ii', 'll'];

export const seniorLevelRelatedTerms = ['sênior', 'senior', 'sr', 'sr.', 'iii', 'lll'];

export const specialistLevelRelatedTerms = ['especialista'];
