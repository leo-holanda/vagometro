import { ContractTypes } from 'src/app/job/job.types';

export interface GupyContractTypeMap {
  [key: string]: ContractTypes;
}

export const gupyContractTypeMap: GupyContractTypeMap = {
  vacancy_type_apprentice: ContractTypes.apprentice,
  vacancy_type_associate: ContractTypes.associate,
  vacancy_type_talent_pool: ContractTypes.talent_pool,
  vacancy_type_effective: ContractTypes.CLT,
  vacancy_type_internship: ContractTypes.intern,
  vacancy_type_summer: ContractTypes.summer,
  vacancy_type_temporary: ContractTypes.temporary,
  vacancy_type_outsource: ContractTypes.outsource,
  vacancy_type_trainee: ContractTypes.intern,
  vacancy_type_volunteer: ContractTypes.volunteer,
  vacancy_legal_entity: ContractTypes.PJ,
  vacancy_type_lecturer: ContractTypes.lecturer,
  vacancy_type_freelancer: ContractTypes.freelance,
  vacancy_type_autonomous: ContractTypes.autonomous,
};
