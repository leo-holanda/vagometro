export enum ExperienceLevels {
  junior = 'Júnior',
  mid = 'Pleno',
  senior = 'Sênior',
  unknown = 'Desconhecido',
}

export type ExperienceLevelData = {
  level: ExperienceLevels;
  count: number;
};
