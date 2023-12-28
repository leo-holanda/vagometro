import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, map } from 'rxjs';
import { CompanyData } from './companies-rank.model';
import { StatisticsService } from '../../statistics.service';
import { Job } from 'src/app/job/job.model';

@Component({
  selector: 'vgm-companies-rank',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './companies-rank.component.html',
  styleUrls: ['./companies-rank.component.scss'],
})
export class CompaniesRankComponent implements OnInit, OnChanges {
  @Input() jobs$?: Observable<Job[]>;
  companyRank$!: Observable<CompanyData[]>;

  constructor(private statisticsService: StatisticsService) {}

  ngOnInit(): void {
    this.companyRank$ = this.statisticsService.getCompanyRank(this.jobs$);
  }

  ngOnChanges(): void {
    this.companyRank$ = this.statisticsService.getCompanyRank(this.jobs$);
  }
}
