export type CertificationsData = {
  status: CertificationStatus;
  count: number;
};

// Abbreviations are necessary to fit in the job list card badges
export enum CertificationStatus {
  asks = 'Menciona certificação',
  unknown = 'Desconhecido',
  // Professional Scrum Developer
  PSD = 'Scrum PSD',
  // Certified Scrum Developer
  CSD = 'Scrum CSD',
  // AWS Certified Cloud Practitioner',
  AWS_CCP = 'AWS CCP',
  // Microsoft Certified Solutions Developer
  MSCD = 'Microsoft MSCD',
  // Microsoft Certified Professional Developer
  MSPD = 'Microsoft MSPD',
  // Certified Pega System Architect
  PEGA_CPSA = 'PEGA CPSA',
}

interface CertificationRelatedTerms {
  [key: string]: CertificationStatus;
}

export const certificationRelatedTerms: CertificationRelatedTerms = {
  certificacao: CertificationStatus.asks,
  certificacoes: CertificationStatus.asks,
  'professional scrum developer': CertificationStatus.PSD,
  psd: CertificationStatus.PSD,
  'certified scrum developer': CertificationStatus.CSD,
  csd: CertificationStatus.CSD,
  'certified cloud practitioner': CertificationStatus.AWS_CCP,
  ccp: CertificationStatus.AWS_CCP,
  'microsoft certified solutions developer': CertificationStatus.MSCD,
  mscd: CertificationStatus.MSCD,
  'microsoft certified professional developer': CertificationStatus.MSPD,
  mspd: CertificationStatus.MSPD,
  'certified pega system architect': CertificationStatus.PEGA_CPSA,
  cpsa: CertificationStatus.PEGA_CPSA,
};
