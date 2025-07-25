export enum WorkplaceTypes {
  remote = 'Remoto',
  hybrid = 'Híbrido',
  'on-site' = 'Presencial',
  unknown = 'Desconhecido',
}

export type WorkplaceData = {
  type: WorkplaceTypes;
  matchesSearchParameters: boolean;
};

interface workplaceTypeRelatedTerms {
  [key: string]: WorkplaceTypes;
}

export const workplaceTypeRelatedTerms: workplaceTypeRelatedTerms = {
  remoto: WorkplaceTypes.remote,
  remote: WorkplaceTypes.remote,
  remota: WorkplaceTypes.remote,
  remotamente: WorkplaceTypes.remote,
  'home office': WorkplaceTypes.remote,
  'home-office': WorkplaceTypes.remote,

  hibrido: WorkplaceTypes.hybrid,
  hibrida: WorkplaceTypes.hybrid,
  hybrid: WorkplaceTypes.hybrid,

  presencial: WorkplaceTypes['on-site'],
  presencialmente: WorkplaceTypes['on-site'],
  'on-site': WorkplaceTypes['on-site'],
};
