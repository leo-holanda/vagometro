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

export enum HigherEducationCoursesNames {
  unknown = 'Desconhecido',
  computerScience = 'Ciência da Computação',
  computerEngineering = 'Engenharia de Computação',
  informationSystems = 'Sistemas de Informação',
  sysntemAnalysisAndDevelopment = 'Análise e Desenvolvimento de Sistemas',
  softwareEngineering = 'Engenharia de Software',
  systemAnalysis = 'Análise de Sistemas',
  eletricEngineering = 'Engenharia Elétrica',
  eletronicEngineering = 'Engenharia Eletrônica',
  informationTechnology = 'Tecnologia da Informação',
  network = 'Redes',

  design = 'Design',
  marketing = 'Marketing',
  advertising = 'Publicidade',
  graphicDesign = 'Design Gráfico',
  communication = 'Comunicação', //risky to match with other contexts

  dataScience = 'Ciência de Dados',
  statistics = 'Estatística',
  math = 'Matemática',

  management = 'Administração',
  economony = 'Economia',
}

export type EducationalData = {
  coursesNames: string[];
  educationalLevels: EducationalLevels[];
};
interface EducationRelatedTerms {
  [key: string]: HigherEducationCoursesNames;
}

interface EducationalLevelRelatedTerms {
  [key: string]: EducationalLevels;
}

export const higherEducationCoursesNames: EducationRelatedTerms = {
  'tecnologia da informacao': HigherEducationCoursesNames.informationTechnology,

  CC: HigherEducationCoursesNames.computerScience,
  'ciencia da computacao': HigherEducationCoursesNames.computerScience,
  'ciencias da computacao': HigherEducationCoursesNames.computerScience,
  'ciencia de computacao': HigherEducationCoursesNames.computerScience,
  'ciencias de computacao': HigherEducationCoursesNames.computerScience,
  'computer science': HigherEducationCoursesNames.computerScience,

  EC: HigherEducationCoursesNames.computerEngineering,
  'engenharia da computacao': HigherEducationCoursesNames.computerEngineering,
  'engenharia de computacao': HigherEducationCoursesNames.computerEngineering,

  SI: HigherEducationCoursesNames.informationSystems,
  'sistema da informacao': HigherEducationCoursesNames.informationSystems,
  'sistemas da informacao': HigherEducationCoursesNames.informationSystems,
  'sistema de informacao': HigherEducationCoursesNames.informationSystems,
  'sistemas de informacao': HigherEducationCoursesNames.informationSystems,

  ADS: HigherEducationCoursesNames.sysntemAnalysisAndDevelopment,
  'analise e desenvolvimento de sistema': HigherEducationCoursesNames.sysntemAnalysisAndDevelopment,
  'analise e desenvolvimento de sistemas':
    HigherEducationCoursesNames.sysntemAnalysisAndDevelopment,

  'analise de sistema': HigherEducationCoursesNames.systemAnalysis,

  'software engineering': HigherEducationCoursesNames.softwareEngineering,
  'engenharia de software': HigherEducationCoursesNames.softwareEngineering,

  'engenharia eletrica': HigherEducationCoursesNames.eletricEngineering,
  'engenharia eletronica': HigherEducationCoursesNames.eletronicEngineering,

  // design: HigherEducationCoursesNames.design (too risky),
  // comunicacao: HigherEducationCoursesNames.communication (too risky),
  'design grafico': HigherEducationCoursesNames.graphicDesign,
  publicidade: HigherEducationCoursesNames.advertising,
  marketing: HigherEducationCoursesNames.marketing,

  'ciencia de dados': HigherEducationCoursesNames.dataScience,
  estatistica: HigherEducationCoursesNames.statistics,
  matematica: HigherEducationCoursesNames.math,

  administracao: HigherEducationCoursesNames.management,
  economia: HigherEducationCoursesNames.economony,

  redes: HigherEducationCoursesNames.network,
  'redes de computadores': HigherEducationCoursesNames.network,
};

export const educationalLevelTerms: EducationalLevelRelatedTerms = {
  'ensino medio': EducationalLevels.highSchool,
  'nivel medio': EducationalLevels.highSchool,

  /*
    "tecnico em" is an option but it's risky to match with something like
    "Requer conhecimento tecnico em..."
  */
  'ensino tecnico': EducationalLevels.technician,
  'nivel tecnico': EducationalLevels.technician,
  'formacao tecnica': EducationalLevels.technician,
  'curso tecnico': EducationalLevels.technician,
  'tecnico completo': EducationalLevels.technician,

  tecnologo: EducationalLevels.technologist,

  'ensino superior': EducationalLevels.bachelors,
  'nivel superior': EducationalLevels.bachelors,
  'formacao superior': EducationalLevels.bachelors,
  'curso superior': EducationalLevels.bachelors,
  'superior completo': EducationalLevels.bachelors,
  graduacao: EducationalLevels.bachelors,
  bacharelado: EducationalLevels.bachelors,
  licenciatura: EducationalLevels.bachelors,
  'b.s.': EducationalLevels.bachelors,

  especializacao: EducationalLevels.specialization,
  'pos-graduacao': EducationalLevels.specialization,
  'pos graduacao': EducationalLevels.specialization,

  mestrado: EducationalLevels.masters,

  doutorado: EducationalLevels.doctorate,

  'pos-doutorado': EducationalLevels.postDoctoral,
  'pós-doutorado': EducationalLevels.postDoctoral,
  'pos douturado': EducationalLevels.postDoctoral,
  'pós douturado': EducationalLevels.postDoctoral,
};
