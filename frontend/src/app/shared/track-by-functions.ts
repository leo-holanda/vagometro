import { KeywordOnSearchForm } from '../job/easy-search/search-form/search-form.types';
import { Job } from '../job/job.types';
import { ComparisonData, MonthData } from '../statistics/comparisons/comparisons.types';
import { RankData } from '../statistics/rank/rank.types';

export function trackByKeyword(index: number, item: KeywordOnSearchForm): string {
  return item.name;
}

export function trackByJobId(index: number, item: Job): number {
  return item.id;
}

export function trackByRankData(index: number, item: RankData): string {
  return item.name;
}

export function trackByComparisonData(index: number, item: ComparisonData | MonthData): string {
  return item.name;
}
