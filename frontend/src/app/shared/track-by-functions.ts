import { Job } from '../job/job.types';
import {
  CityData,
  StateData,
} from '../statistics/ranks/cities-rank/cities-rank.model';
import { CompanyData } from '../statistics/ranks/companies-rank/companies-rank.model';
import { DisabilityData } from '../statistics/ranks/disability-rank/disability-rank.model';
import { EducationData } from '../statistics/ranks/education-rank/education-rank.types';
import { ExperienceLevelData } from '../statistics/ranks/experience-levels-rank/experience-levels-rank.model';
import { KeywordData } from '../statistics/ranks/keywords-rank/keywords-rank.model';
import { LanguageData } from '../statistics/ranks/languages-rank/languages-rank.types';
import { MonthData } from '../statistics/ranks/months-rank/months-rank.types';
import { TypeData } from '../statistics/ranks/type-rank/type-rank.model';
import { WorkplaceData } from '../statistics/ranks/workplace-rank/workplace-rank.model';

export function trackByType(index: number, item: TypeData): string {
  return item.name;
}

export function trackByWorkplace(index: number, item: WorkplaceData): string {
  return item.type;
}

export function trackByKeyword(index: number, item: KeywordData): string {
  return item.word;
}

export function trackByExperienceLevel(
  index: number,
  item: ExperienceLevelData
): string {
  return item.level;
}

export function trackByDisabilityStatus(
  index: number,
  item: DisabilityData
): string {
  return item.name;
}

export function trackByCompany(index: number, item: CompanyData): string {
  return item.name;
}

export function trackByCity(index: number, item: CityData): string {
  return item.name;
}

export function trackByState(index: number, item: StateData): string {
  return item.name;
}

export function trackByJobId(index: number, item: Job): number {
  return item.id;
}

export function trackByEducationStatus(
  index: number,
  item: EducationData
): string {
  return item.name;
}

export function trackByLanguage(index: number, item: LanguageData): string {
  return item.name;
}

export function trackByMonth(index: number, item: MonthData): string {
  return item.name;
}
