export type CertificationsData = {
  status: CertificationStatus;
  count: number;
};

export enum CertificationStatus {
  asks = 'Pede certificação',
  unknown = 'Desconhecido',
}

interface CertificationRelatedTerms {
  [key: string]: CertificationStatus;
}

export const certificationRelatedTerms: CertificationRelatedTerms = {
  certificacao: CertificationStatus.asks,
  certificacoes: CertificationStatus.asks,
};
