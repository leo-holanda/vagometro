import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, map } from 'rxjs';
import { CompanyData } from './companies-rank.model';
import { StatisticsService } from '../../statistics.service';
import { Job } from 'src/app/job/job.types';
import { trackByCompany } from 'src/app/shared/track-by-functions';

@Component({
  selector: 'vgm-companies-rank',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './companies-rank.component.html',
  styleUrls: ['./companies-rank.component.scss'],
})
export class CompaniesRankComponent implements OnInit, OnChanges {
  @Input() jobs$?: Observable<Job[]>;
  @Input() rankSize: number | undefined;

  companiesRank$!: Observable<CompanyData[]>;

  trackByCompany = trackByCompany;

  constructor(private statisticsService: StatisticsService) {}

  ngOnInit(): void {
    this.companiesRank$ = this.statisticsService.getCompanyRank(this.jobs$);
    if (this.rankSize)
      this.companiesRank$ = this.companiesRank$.pipe(
        map((companiesRank) => companiesRank.slice(0, this.rankSize)),
      );
  }

  ngOnChanges(): void {
    this.companiesRank$ = this.statisticsService.getCompanyRank(this.jobs$);

    if (this.rankSize)
      this.companiesRank$ = this.companiesRank$.pipe(
        map((companiesRank) => companiesRank.slice(0, this.rankSize)),
      );
  }
}
