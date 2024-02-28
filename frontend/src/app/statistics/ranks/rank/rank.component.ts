import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, map } from 'rxjs';
import { Job } from 'src/app/job/job.types';
import { StatisticsService } from '../../statistics.service';
import { RankMetaData, RankOptions } from './rank.data';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'vgm-rank',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './rank.component.html',
  styleUrls: ['./rank.component.scss'],
})
export class RankComponent implements OnInit, OnChanges {
  @Input() jobs$?: Observable<Job[]>;
  @Input() rankType: string | undefined;
  @Input() rankSize: number | undefined;

  rankData$!: Observable<any[]>;
  rankMetaData!: RankMetaData;
  jobsQuantity!: Observable<number>;

  constructor(private statisticsService: StatisticsService) {}

  ngOnInit(): void {
    const rankOptions = this.createRankOptions();
    this.rankMetaData = rankOptions[this.rankType || 'months'];
    this.jobsQuantity = this.statisticsService.getJobsCount(this.jobs$);

    this.rankData$ = this.rankMetaData.getRank(this.jobs$);
    if (this.rankSize)
      this.rankData$ = this.rankData$.pipe(map((rankData) => rankData.slice(0, this.rankSize)));
  }

  ngOnChanges(): void {
    this.rankData$ = this.rankMetaData.getRank(this.jobs$);
    if (this.rankSize)
      this.rankData$ = this.rankData$.pipe(map((rankData) => rankData.slice(0, this.rankSize)));
  }

  private createRankOptions(): RankOptions {
    return {
      months: {
        name: 'Meses com mais vagas publicadas',
        icon: 'bx bxs-calendar',
        dataColumnName: 'Mês',
        getRank: this.statisticsService.getMonthsRank.bind(this.statisticsService),
      },
      education: {
        name: 'Educação',
        icon: 'bx bxs-calendar',
        dataColumnName: 'Nível',
        getRank: this.statisticsService.getEducationalLevelRank.bind(this.statisticsService),
      },
    };
  }
}
