export type MovingAverageStatData = {
  value: number;
  comparedValue: number;
};

export enum TrendStatuses {
  INCREASING = 'increasing',
  DECREASING = 'decreasing',
  STABLE = 'stable',
}
