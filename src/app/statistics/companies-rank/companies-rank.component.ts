import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, map } from 'rxjs';
import { CompanyData } from './companies-rank.model';
import { StatisticsService } from '../statistics.service';

@Component({
  selector: 'vgm-companies-rank',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './companies-rank.component.html',
  styleUrls: ['./companies-rank.component.scss'],
})
export class CompaniesRankComponent implements OnInit {
  companyRank!: Observable<CompanyData[]>;

  constructor(private statisticsService: StatisticsService) {}

  ngOnInit(): void {
    this.companyRank = this.statisticsService
      .getCompanyRank()
      .pipe(map((companyRank) => companyRank.slice(0, 5)));
  }
}
