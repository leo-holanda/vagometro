import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  KeywordData,
  oneWordKeywords,
  multiWordKeywords,
} from 'src/app/shared/keywords-matcher/technologies.data';
import { trackByKeyword } from 'src/app/shared/track-by-functions';
import { SearchData } from '../easy-search.types';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import {
  KeywordOnSearchForm,
  ExperienceLevelOnSearchForm,
  WorkplaceTypeOnSearchForm,
} from './search-form.types';
import { ExperienceLevels } from 'src/app/shared/keywords-matcher/experience-levels.data';
import { EasySearchService } from '../easy-search.service';
import { WorkplaceTypes } from 'src/app/shared/keywords-matcher/workplace.data';

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

  filteredKeywords: KeywordOnSearchForm[] = [];
  experienceLevels: ExperienceLevelOnSearchForm[] = [];
  workplaceTypes: WorkplaceTypeOnSearchForm[] = [];

  private selectedKeywords: KeywordData[] = [];
  private keywords: KeywordOnSearchForm[] = [];

  trackByKeyword = trackByKeyword;

  constructor(
    private router: Router,
    private easySearchService: EasySearchService,
  ) {
    this.loadKeywords();
    this.loadExperienceLevels();
    this.loadWorkplaceTypes();
    this.setSearchData();
  }

  filterKeywords(): void {
    this.filteredKeywords = this.keywords.filter((keyword) =>
      keyword.name.toLowerCase().includes(this.keywordSearchString.toLowerCase()),
    );

    this.sortKeywords();
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

    this.searchData.keywords = this.selectedKeywords;
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

  saveSearchData(): void {
    this.easySearchService.saveSearchData(this.searchData);
    this.router.navigate(['busca-facil']);
  }

  private loadExperienceLevels(): void {
    this.experienceLevels = Object.values(ExperienceLevels).map((experienceLevel) => {
      return {
        name: experienceLevel,
        isSelected: false,
      };
    });
  }

  private loadKeywords(): void {
    const keywordsMap = { ...oneWordKeywords, ...multiWordKeywords };
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

  private sortKeywords(): void {
    this.filteredKeywords.sort((a, b) => (a.isSelected ? -1 : 0));
  }

  private selectKeywordsFromSearchData(): void {
    this.selectedKeywords = this.searchData.keywords;
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

  private setSearchData(): void {
    const searchData = this.easySearchService.getSearchData();
    if (!searchData)
      this.searchData = {
        keywords: [],
        experienceLevels: [],
        workplaceTypes: [],
      };
    else this.searchData = searchData;

    this.selectKeywordsFromSearchData();
    this.selectExperienceLevelsFromSearchData();
    this.selectWorkplaceTypesFromSearchData();
  }
}
