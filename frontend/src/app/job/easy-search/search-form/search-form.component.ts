import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  Technology,
  oneWordTechnologies,
  multiWordTechnologies,
} from 'src/app/shared/keywords-matcher/technologies.data';
import { trackByKeyword, trackByName } from 'src/app/shared/track-by-functions';
import { SearchData, SortOrders } from '../easy-search.types';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import {
  KeywordOnSearchForm,
  ExperienceLevelOnSearchForm,
  WorkplaceTypeOnSearchForm,
  ContractTypesOnSearchForm,
  InclusionTypesOnSearchForm,
  CompaniesOnSearchForm,
} from './search-form.types';
import { ExperienceLevels } from 'src/app/shared/keywords-matcher/experience-levels.data';
import { EasySearchService } from '../easy-search.service';
import { WorkplaceTypes } from 'src/app/shared/keywords-matcher/workplace.data';
import { ContractTypes } from 'src/app/shared/keywords-matcher/contract-types.data';
import { InclusionTypes } from 'src/app/shared/keywords-matcher/inclusion.data';
import { combineLatest, map, Observable, startWith, Subject, take } from 'rxjs';
import { Job } from '../../job.types';

@Component({
  selector: 'vgm-search-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.scss'],
})
export class SearchFormComponent {
  searchData!: SearchData;
  keywordSearchString = '';
  companySearchString = '';
  private companySearchStringChanged$ = new Subject<void>();

  filteredKeywords: KeywordOnSearchForm[] = [];
  filteredCompanies$!: Observable<CompaniesOnSearchForm[]>;

  experienceLevels: ExperienceLevelOnSearchForm[] = [];
  workplaceTypes: WorkplaceTypeOnSearchForm[] = [];
  contractTypes: ContractTypesOnSearchForm[] = [];
  inclusionTypes: InclusionTypesOnSearchForm[] = [];
  private companies$!: Observable<CompaniesOnSearchForm[]>;

  private selectedKeywords: Technology[] = [];
  private keywords: KeywordOnSearchForm[] = [];

  sortBy: keyof Job = 'matchPercentage';
  sortOrder: SortOrders = SortOrders.descending;
  SortOrders = SortOrders;

  trackByKeyword = trackByKeyword;
  trackByName = trackByName;

  constructor(
    private router: Router,
    private easySearchService: EasySearchService,
  ) {
    this.setSearchData();
    this.loadKeywords();
    this.loadExperienceLevels();
    this.loadWorkplaceTypes();
    this.loadContractTypes();
    this.loadInclusionTypes();
    this.loadCompanies();
    this.toggleSelectedItems();
  }

  filterCompanies(): void {
    this.companySearchStringChanged$.next();
  }

  filterKeywords(): void {
    this.filteredKeywords = this.keywords.filter((keyword) =>
      keyword.name.toLowerCase().includes(this.keywordSearchString.toLowerCase()),
    );

    this.sortKeywords();
  }

  onCompanyClick(clickedCompany: CompaniesOnSearchForm): void {
    if (clickedCompany.isSelected) {
      this.searchData.excludedCompanies = this.searchData.excludedCompanies.filter(
        (companyName) => companyName != clickedCompany.name,
      );
    } else {
      this.searchData.excludedCompanies.push(clickedCompany.name);
    }

    clickedCompany.isSelected = !clickedCompany.isSelected;
  }

  onKeywordClick(keyword: KeywordOnSearchForm): void {
    if (keyword.isSelected) {
      this.selectedKeywords = this.selectedKeywords.filter(
        (selectedKeyword) => selectedKeyword.name != keyword.name,
      );
      keyword.isSelected = false;
    } else {
      this.selectedKeywords.push(keyword);
      keyword.isSelected = true;
    }

    this.searchData.technologies = this.selectedKeywords;
  }

  onExperienceLevelClick(experienceLevel: ExperienceLevelOnSearchForm): void {
    experienceLevel.isSelected = !experienceLevel.isSelected;

    this.searchData.experienceLevels = this.experienceLevels
      .filter((experienceLevel) => experienceLevel.isSelected)
      .map((experienceLevel): ExperienceLevels => experienceLevel.name);
  }

  onWorkplaceTypeClick(workplaceType: WorkplaceTypeOnSearchForm): void {
    workplaceType.isSelected = !workplaceType.isSelected;

    this.searchData.workplaceTypes = this.workplaceTypes
      .filter((experienceLevel) => experienceLevel.isSelected)
      .map((experienceLevel): WorkplaceTypes => experienceLevel.name);
  }

  onContractTypeClick(contractType: ContractTypesOnSearchForm): void {
    contractType.isSelected = !contractType.isSelected;

    this.searchData.contractTypes = this.contractTypes
      .filter((contractType) => contractType.isSelected)
      .map((contractType): ContractTypes => contractType.name);
  }

  onInclusionTypeClick(inclusionType: InclusionTypesOnSearchForm): void {
    inclusionType.isSelected = !inclusionType.isSelected;

    this.searchData.inclusionTypes = this.inclusionTypes
      .filter((inclusionType) => inclusionType.isSelected)
      .map((inclusionType): InclusionTypes => inclusionType.name);
  }

  saveSearchData(): void {
    this.easySearchService.saveSearchData(this.searchData);
    this.router.navigate(['busca-facil']);
  }

  setSortingSettings(): void {
    this.searchData.sortBy = this.sortBy;
    this.searchData.sortOrder = this.sortOrder;
  }

  private loadExperienceLevels(): void {
    this.experienceLevels = Object.values(ExperienceLevels).map((experienceLevel) => {
      return {
        name: experienceLevel,
        isSelected: false,
      };
    });
  }

  private loadCompanies(): void {
    this.companies$ = this.easySearchService
      .getCompaniesForSearchForm()
      .pipe(map(this.toggleExcludedCompanies), map(this.sortCompanies));

    this.filteredCompanies$ = combineLatest([
      this.companies$,
      this.companySearchStringChanged$.pipe(startWith(null)),
    ]).pipe(
      map(([companies]) => this.filterCompaniesBySearchString(companies)),
      map((companies) => this.sortCompanies(companies)),
    );
  }

  private loadKeywords(): void {
    const keywordsMap = { ...oneWordTechnologies, ...multiWordTechnologies };
    const keywordSet = new Set();

    for (const keyword in keywordsMap) {
      const currentKeyword = keywordsMap[keyword];
      if (keywordSet.has(currentKeyword.name)) continue;
      this.keywords.push({ ...currentKeyword, isSelected: false });
      keywordSet.add(currentKeyword.name);
    }

    this.filteredKeywords = this.keywords;
  }

  private loadWorkplaceTypes(): void {
    this.workplaceTypes = Object.values(WorkplaceTypes).map((workplaceType) => {
      return {
        name: workplaceType,
        isSelected: false,
      };
    });
  }

  private loadContractTypes(): void {
    this.contractTypes = Object.values(ContractTypes).map((contractType) => {
      return {
        name: contractType,
        isSelected: false,
      };
    });
  }

  private loadInclusionTypes(): void {
    this.inclusionTypes = Object.values(InclusionTypes).map((inclusionType) => {
      return {
        name: inclusionType,
        isSelected: false,
      };
    });
  }

  private filterCompaniesBySearchString(
    companies: CompaniesOnSearchForm[],
  ): CompaniesOnSearchForm[] {
    return companies.filter((company) =>
      company.name.toLowerCase().includes(this.companySearchString.toLowerCase()),
    );
  }

  private sortCompanies(companies: CompaniesOnSearchForm[]): CompaniesOnSearchForm[] {
    companies.sort((a, b) => {
      if (a.isSelected && !b.isSelected) return -1;
      if (!a.isSelected && b.isSelected) return 1;
      return 0;
    });

    return companies;
  }

  private sortKeywords(): void {
    this.filteredKeywords.sort((a, b) => {
      if (a.isSelected && !b.isSelected) return -1;
      if (!a.isSelected && b.isSelected) return 1;
      return 0;
    });
  }

  private selectKeywordsFromSearchData(): void {
    this.selectedKeywords = this.searchData.technologies;
    const selectedKeywordsNames = this.selectedKeywords.map((keyword) => keyword.name);

    this.filteredKeywords.forEach((filteredKeyword) => {
      if (selectedKeywordsNames.includes(filteredKeyword.name)) {
        filteredKeyword.isSelected = true;
      }
    });

    this.sortKeywords();
  }

  private selectExperienceLevelsFromSearchData(): void {
    this.searchData.experienceLevels.forEach((experienceLevel) => {
      const matchedExperienceLevel = this.experienceLevels.find(
        (formExperienceLevel) => formExperienceLevel.name == experienceLevel,
      );

      if (matchedExperienceLevel) matchedExperienceLevel.isSelected = true;
    });
  }

  private selectWorkplaceTypesFromSearchData(): void {
    this.searchData.workplaceTypes.forEach((workplaceType) => {
      const matchedWorkplaceType = this.workplaceTypes.find(
        (formWorkplaceType) => formWorkplaceType.name == workplaceType,
      );

      if (matchedWorkplaceType) matchedWorkplaceType.isSelected = true;
    });
  }

  private selectContractTypesFromSearchData(): void {
    this.searchData.contractTypes.forEach((contractType) => {
      const matchedContractType = this.contractTypes.find(
        (formContractType) => formContractType.name == contractType,
      );

      if (matchedContractType) matchedContractType.isSelected = true;
    });
  }

  private selectInclusionTypesFromSearchData(): void {
    this.searchData.inclusionTypes.forEach((inclusionType) => {
      const matchedInclusionType = this.inclusionTypes.find(
        (formInclusionType) => formInclusionType.name == inclusionType,
      );

      if (matchedInclusionType) matchedInclusionType.isSelected = true;
    });
  }

  private toggleExcludedCompanies = (
    companies: CompaniesOnSearchForm[],
  ): CompaniesOnSearchForm[] => {
    return companies.map((company) => {
      if (this.searchData.excludedCompanies.includes(company.name)) company.isSelected = true;
      return company;
    });
  };

  private setSearchData(): void {
    const searchData = this.easySearchService.getSearchData();
    if (!searchData)
      this.searchData = {
        technologies: [],
        experienceLevels: [],
        workplaceTypes: [],
        contractTypes: [],
        inclusionTypes: [],
        excludedCompanies: [],
        sortBy: 'matchPercentage',
        sortOrder: SortOrders.descending,
      };
    else this.searchData = searchData;
  }

  private toggleSelectedItems(): void {
    this.selectKeywordsFromSearchData();
    this.selectExperienceLevelsFromSearchData();
    this.selectWorkplaceTypesFromSearchData();
    this.selectContractTypesFromSearchData();
    this.selectInclusionTypesFromSearchData();
  }
}
