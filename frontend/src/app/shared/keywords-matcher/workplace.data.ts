export enum WorkplaceTypes {
  remote = 'Remoto',
  hybrid = 'Híbrido',
  'on-site' = 'Presencial',
  unknown = 'Desconhecido',
}

interface workplaceTypeRelatedTerms {
  [key: string]: WorkplaceTypes;
}

export const workplaceTypeRelatedTerms: workplaceTypeRelatedTerms = {
  remoto: WorkplaceTypes.remote,
  remote: WorkplaceTypes.remote,
  remota: WorkplaceTypes.remote,
  'home office': WorkplaceTypes.remote,
  hibrido: WorkplaceTypes.hybrid,
  hibrida: WorkplaceTypes.hybrid,
  presencial: WorkplaceTypes['on-site'],
  'on-site': WorkplaceTypes['on-site'],
};
