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
import { KeywordOnSearchForm } from './search-form.types';

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

  private selectedKeywords: KeywordData[] = [];
  private keywords: KeywordOnSearchForm[] = [];

  trackByKeyword = trackByKeyword;

  constructor(private router: Router) {
    this.setSearchData();
    this.loadKeywords();
  }

  filterKeywords(): void {
    this.filteredKeywords = this.keywords.filter((keyword) =>
      keyword.name.toLowerCase().includes(this.keywordSearchString.toLowerCase()),
    );
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

  saveSearchData(): void {
    if (this.searchData) {
      localStorage.setItem('searchData', JSON.stringify(this.searchData));
      this.router.navigate(['busca-facil']);
    }
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

  private setSearchData(): void {
    const data = localStorage.getItem('searchData');
    if (data) this.searchData = JSON.parse(data);
    else
      this.searchData = {
        keywords: [],
      };
  }
}
