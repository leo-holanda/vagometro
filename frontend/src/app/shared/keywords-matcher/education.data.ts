export enum EducationalLevels {
  unknown = 'Desconhecido',
  highSchool = 'Ensino médio',
  technician = 'Nível técnico',
  technologist = 'Tecnólogo',
  bachelors = 'Graduação',
  specialization = 'Especialização',
  masters = 'Mestrado',
  doctorate = 'Doutorado',
  postDoctoral = 'Pós-doutorado',
}

export type EducationalData = {
  coursesNames: string[];
  educationalLevels: EducationalLevels[];
};
export interface EducationRelatedTerms {
  termsForMatching: string[];
  defaultTerm: string;
}

export const higherEducationCoursesNames: EducationRelatedTerms[] = [
  {
    termsForMatching: ['ciencia da computacao', 'ciencias da computacao', 'ciencia de computacao', 'ciencias de computacao', 'CC'],
    defaultTerm: 'Ciência da Computação',
  },
  {
    termsForMatching: ['engenharia da computacao', 'engenharia de computacao', 'EC'],
    defaultTerm: 'Engenharia de Computação',
  },
  {
    termsForMatching: ['sistema da informacao', 'sistemas da informacao', 'sistema de informacao', 'sistemas de informacao', 'SI'],
    defaultTerm: 'Sistemas de Informação',
  },
  {
    termsForMatching: ['analise e desenvolvimento de sistema', 'analise e desenvolvimento de sistemas', 'ADS'],
    defaultTerm: 'Análise e Desenvolvimento de Sistemas',
  },
  {
    termsForMatching: ['analise de sistema'],
    defaultTerm: 'Análise de Sistemas',
  },
  {
    termsForMatching: ['engenharia eletrica'],
    defaultTerm: 'Engenharia Elétrica',
  },
  {
    termsForMatching: ['engenharia eletronica'],
    defaultTerm: 'Engenharia Eletrônica',
  },
];

export const educationalLevelTerms: EducationRelatedTerms[] = [
  {
    termsForMatching: ['ensino medio', 'nivel medio'],
    defaultTerm: EducationalLevels.highSchool,
  },
  {
    termsForMatching: ['ensino tecnico', 'nivel tecnico', 'formacao tecnica', 'curso tecnico'],
    defaultTerm: EducationalLevels.technician,
  },
  {
    termsForMatching: ['tecnologo'],
    defaultTerm: EducationalLevels.technologist,
  },
  {
    termsForMatching: ['ensino superior', 'nivel superior', 'formacao superior', 'curso superior'],
    defaultTerm: EducationalLevels.bachelors,
  },
  {
    termsForMatching: ['graduacao'],
    defaultTerm: EducationalLevels.bachelors,
  },
  {
    termsForMatching: ['especializacao', 'pos-graduacao'],
    defaultTerm: EducationalLevels.specialization,
  },
  {
    termsForMatching: ['mestrado'],
    defaultTerm: EducationalLevels.masters,
  },
  {
    termsForMatching: ['doutorado'],
    defaultTerm: EducationalLevels.doctorate,
  },
  {
    termsForMatching: ['pos-doutorado', 'pós-doutorado', 'pos douturado', 'pós douturado'],
    defaultTerm: EducationalLevels.postDoctoral,
  },
];
