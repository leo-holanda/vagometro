export enum ComparisonTypes {
  monthly = 'monthly',
  quarterly = 'quarterly',
  annual = 'annual',
}

export type MonthData = {
  name: string;
  count: number;
};

export type ComparisonData = {
  name: string;
  count: number;
  difference: number;
  differenceAsPercentage: number;
};
