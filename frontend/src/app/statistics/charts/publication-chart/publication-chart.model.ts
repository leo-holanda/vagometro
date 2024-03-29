export type Decal = {
  dashArrayX: [number, number];
  dashArrayY: [number, number];
  rotation: number;
};

export interface SeriesData {
  itemStyle?: {
    color: string;
    decal?: Decal;
  };
}

export interface ShortTermSeriesData extends SeriesData {
  value: [Date, number];
}

export interface LongTermSeriesData extends SeriesData {
  value: [string, number];
}

export type DailyPostingsSeries = ShortTermSeriesData[];
export type MonthlyPostingsSeries = LongTermSeriesData[];
export type AnnualPostingsSeries = LongTermSeriesData[];

export type JobPostingsSeries = DailyPostingsSeries | MonthlyPostingsSeries | AnnualPostingsSeries;

export type IntervalTypes = 'daily' | 'monthly' | 'annual';
export enum MovingAverageTypes {
  oneWeek = '7 dias',
  oneMonth = '30 dias',
  halfYear = '180 dias',
  oneYear = '1 ano',
}
export interface MatchData extends SeriesData {
  value: [string, number];
}
