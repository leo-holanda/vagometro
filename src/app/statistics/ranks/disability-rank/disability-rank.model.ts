export enum DisabilityStatuses {
  PCD = 'Também para PCD',
  nonPCD = 'Não-PCD',
}

export type DisabilityData = {
  name: DisabilityStatuses;
  count: number;
};
