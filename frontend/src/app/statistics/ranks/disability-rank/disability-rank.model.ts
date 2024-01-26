export enum DisabilityStatuses {
  PCD = 'Também para PCD',
  nonPCD = 'Não-PCD',
  unknown = 'Desconhecido',
}

export type DisabilityData = {
  name: DisabilityStatuses;
  count: number;
};
