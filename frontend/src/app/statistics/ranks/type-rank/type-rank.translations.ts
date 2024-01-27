import { ContractTypes } from 'src/app/job/job.types';

export interface GupyContractTypeMap {
  [key: string]: string;
}

export const gupyContractTypeMap: GupyContractTypeMap = {
  vacancy_type_apprentice: 'Aprendiz',
  vacancy_type_associate: 'Associado',
  vacancy_type_talent_pool: 'Piscina de Talentos',
  vacancy_type_effective: ContractTypes.CLT,
  vacancy_type_internship: ContractTypes.intern,
  vacancy_type_summer: 'Verão',
  vacancy_type_temporary: 'Temporário',
  vacancy_type_outsource: 'Terceirizado',
  vacancy_type_trainee: ContractTypes.intern,
  vacancy_type_volunteer: 'Voluntário',
  vacancy_legal_entity: ContractTypes.PJ,
  vacancy_type_lecturer: 'Palestrante',
  vacancy_type_freelancer: ContractTypes.freelance,
  vacancy_type_autonomous: 'Autônomo',
};
