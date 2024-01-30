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
