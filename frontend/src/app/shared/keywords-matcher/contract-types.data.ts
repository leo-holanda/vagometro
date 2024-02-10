export enum ContractTypes {
  CLT = 'CLT',
  PJ = 'Pessoa Jurídica',
  intern = 'Estágio',
  freelance = 'Freelance',
  allocated = 'Alocado',
  apprentice = 'Aprendiz',
  associate = 'Associado',
  talent_pool = 'Piscina de Talentos',
  summer = 'Verão',
  temporary = 'Temporário',
  outsource = 'Terceirizado',
  volunteer = 'Voluntário',
  lecturer = 'Palestrante',
  autonomous = 'Autônomo',
  trainee = 'Trainee',
  unknown = 'Desconhecido',
}

interface contractTypesRelatedTerms {
  [key: string]: ContractTypes;
}

export const contractTypeRelatedTerms: contractTypesRelatedTerms = {
  clt: ContractTypes.CLT,
  efetivo: ContractTypes.CLT,
  pj: ContractTypes.PJ,
  freelance: ContractTypes.freelance,
  freela: ContractTypes.freelance,
  estagio: ContractTypes.intern,
  estagiario: ContractTypes.intern,
  aprendiz: ContractTypes.apprentice,
  associado: ContractTypes.associate,
  piscina: ContractTypes.talent_pool,
  temporario: ContractTypes.temporary,
  outsource: ContractTypes.outsource,
  voluntario: ContractTypes.volunteer,
  palestrante: ContractTypes.lecturer,
  autonomo: ContractTypes.autonomous,
};
