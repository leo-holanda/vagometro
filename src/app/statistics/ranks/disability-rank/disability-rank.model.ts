export enum DisabilityStatuses {
  PCD = 'PCD',
  nonPCD = 'Não-PCD',
}

export type DisabilityData = {
  name: DisabilityStatuses;
  count: number;
};
