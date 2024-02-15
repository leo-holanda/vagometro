export type DailyPostingsSeries = [Date, number][];
export type MonthlyPostingsSeries = [string, number][];
export type AnnualPostingsSeries = [string, number][];

export type JobPostingsSeries = DailyPostingsSeries | MonthlyPostingsSeries | AnnualPostingsSeries;

export type IntervalTypes = 'daily' | 'monthly' | 'annual';
