export enum ExperienceLevels {
  intern = 'Estagiário',
  trainee = 'Trainee',
  junior = 'Júnior',
  mid = 'Pleno',
  senior = 'Sênior',
  specialist = 'Especialista',
  unknownWithExperience = 'Desconhecido mas pede experiência',
  unknown = 'Totalmente desconhecido',
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
  'estagio.': ExperienceLevels.intern,
  estagiario: ExperienceLevels.intern,
  'estagiario.': ExperienceLevels.intern,
  estagiaria: ExperienceLevels.intern,
  'estagiaria.': ExperienceLevels.intern,

  trainee: ExperienceLevels.trainee,
  'trainee.': ExperienceLevels.trainee,

  júnior: ExperienceLevels.junior,
  junior: ExperienceLevels.junior,
  'junior.': ExperienceLevels.junior,
  jr: ExperienceLevels.junior,
  'jr.': ExperienceLevels.junior,

  plena: ExperienceLevels.mid,
  'plena.': ExperienceLevels.mid,
  pleno: ExperienceLevels.mid,
  'pleno.': ExperienceLevels.mid,
  'pleno/sênior': ExperienceLevels.mid,
  'pleno/senior': ExperienceLevels.mid,
  'pleno/senior.': ExperienceLevels.mid,
  'pl/sr': ExperienceLevels.mid,
  'pl/sr.': ExperienceLevels.mid,
  pl: ExperienceLevels.mid,
  'pl.': ExperienceLevels.mid,

  sênior: ExperienceLevels.senior,
  senior: ExperienceLevels.senior,
  'senior.': ExperienceLevels.senior,
  sr: ExperienceLevels.senior,
  'sr.': ExperienceLevels.senior,
  iii: ExperienceLevels.senior,
  lll: ExperienceLevels.senior,

  especialista: ExperienceLevels.specialist,
  'especialista.': ExperienceLevels.specialist,
};

/*
  Why not just match with "experience"?

  Some companies use the word experience to reference to other things like
  "we are gonna offer you the greatest experience with" and these things
  Matching only with "experience" would generate "false positives" in this case

  By matching the whole sentence, the intention is to seek higher precision
  by only matching sentences that references to the job requested experience

  Further observation is necessary to validate this
*/
export const multiWordExperienceLevelRelatedTerms: ExperienceLevelRelatedTerms = {
  'experiencia necessaria': ExperienceLevels.unknownWithExperience,
  'experiencia na funcao': ExperienceLevels.unknownWithExperience,
  'experiencia na area de': ExperienceLevels.unknownWithExperience,
  'ja ter trabalhado com': ExperienceLevels.unknownWithExperience,

  'experiencia comprovada': ExperienceLevels.unknownWithExperience,
  'experiencia em': ExperienceLevels.unknownWithExperience,
  'experiencia com': ExperienceLevels.unknownWithExperience,
  'experiencia nas': ExperienceLevels.unknownWithExperience,
  'experiencia no': ExperienceLevels.unknownWithExperience,

  'vivencia comprovada': ExperienceLevels.unknownWithExperience,
  'vivencia em': ExperienceLevels.unknownWithExperience,
  'vivencia com': ExperienceLevels.unknownWithExperience,
  'vivencia nas': ExperienceLevels.unknownWithExperience,
  'vivencia no': ExperienceLevels.unknownWithExperience,

  'experiencia previa comprovada': ExperienceLevels.unknownWithExperience,
  'experiencia previa em': ExperienceLevels.unknownWithExperience,
  'experiencia previa com': ExperienceLevels.unknownWithExperience,
  'experiencia previa nas': ExperienceLevels.unknownWithExperience,
  'experiencia previa no': ExperienceLevels.unknownWithExperience,

  'experiencia significativa comprovada': ExperienceLevels.unknownWithExperience,
  'experiencia significativa em': ExperienceLevels.unknownWithExperience,
  'experiencia significativa com': ExperienceLevels.unknownWithExperience,
  'experiencia significativa nas': ExperienceLevels.unknownWithExperience,
  'experiencia significativa no': ExperienceLevels.unknownWithExperience,

  'experiencia desejavel comprovada': ExperienceLevels.unknownWithExperience,
  'experiencia desejavel em': ExperienceLevels.unknownWithExperience,
  'experiencia desejavel com': ExperienceLevels.unknownWithExperience,
  'experiencia desejavel nas': ExperienceLevels.unknownWithExperience,
  'experiencia desejavel no': ExperienceLevels.unknownWithExperience,

  'experiencia pratica comprovada': ExperienceLevels.unknownWithExperience,
  'experiencia pratica em': ExperienceLevels.unknownWithExperience,
  'experiencia pratica com': ExperienceLevels.unknownWithExperience,
  'experiencia pratica nas': ExperienceLevels.unknownWithExperience,
  'experiencia pratica no': ExperienceLevels.unknownWithExperience,

  'experiencia solida comprovada': ExperienceLevels.unknownWithExperience,
  'experiencia solida em': ExperienceLevels.unknownWithExperience,
  'experiencia solida com': ExperienceLevels.unknownWithExperience,
  'experiencia solida nas': ExperienceLevels.unknownWithExperience,
  'experiencia solida no': ExperienceLevels.unknownWithExperience,

  'experiencia necessaria comprovada': ExperienceLevels.unknownWithExperience,
  'experiencia necessaria em': ExperienceLevels.unknownWithExperience,
  'experiencia necessaria com': ExperienceLevels.unknownWithExperience,
  'experiencia necessaria nas': ExperienceLevels.unknownWithExperience,
  'experiencia necessaria no': ExperienceLevels.unknownWithExperience,

  'experiencia especifica comprovada': ExperienceLevels.unknownWithExperience,
  'experiencia especifica em': ExperienceLevels.unknownWithExperience,
  'experiencia especifica com': ExperienceLevels.unknownWithExperience,
  'experiencia especifica nas': ExperienceLevels.unknownWithExperience,
  'experiencia especifica no': ExperienceLevels.unknownWithExperience,

  'experiencia profissional comprovada': ExperienceLevels.unknownWithExperience,
  'experiencia profissional em': ExperienceLevels.unknownWithExperience,
  'experiencia profissional com': ExperienceLevels.unknownWithExperience,
  'experiencia profissional nas': ExperienceLevels.unknownWithExperience,
  'experiencia profissional no': ExperienceLevels.unknownWithExperience,

  'experiencia avancada comprovada': ExperienceLevels.unknownWithExperience,
  'experiencia avancada em': ExperienceLevels.unknownWithExperience,
  'experiencia avancada com': ExperienceLevels.unknownWithExperience,
  'experiencia avancada nas': ExperienceLevels.unknownWithExperience,
  'experiencia avancada no': ExperienceLevels.unknownWithExperience,

  'experiencia avancado comprovada': ExperienceLevels.unknownWithExperience, //sic
  'experiencia avancado em': ExperienceLevels.unknownWithExperience, //sic
  'experiencia avancado com': ExperienceLevels.unknownWithExperience, //sic
  'experiencia avancado nas': ExperienceLevels.unknownWithExperience, //sic
  'experiencia avancado no': ExperienceLevels.unknownWithExperience, //sic

  'experiencia robusta e diversificada comprovada': ExperienceLevels.unknownWithExperience,
  'experiencia robusta e diversificada em': ExperienceLevels.unknownWithExperience,
  'experiencia robusta e diversificada com': ExperienceLevels.unknownWithExperience,
  'experiencia robusta e diversificada nas': ExperienceLevels.unknownWithExperience,
  'experiencia robusta e diversificada no': ExperienceLevels.unknownWithExperience,
};
