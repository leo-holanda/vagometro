import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { KeywordData } from './keywords-rank.model';
import { StatisticsService } from '../../statistics.service';
import { Job } from 'src/app/job/job.model';

@Component({
  selector: 'vgm-keywords-rank',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './keywords-rank.component.html',
  styleUrls: ['./keywords-rank.component.scss'],
})
export class KeywordsRankComponent implements OnInit, OnChanges {
  @Input() jobs$?: Observable<Job[]>;
  keywordsRank$!: Observable<KeywordData[]>;

  constructor(private statisticsService: StatisticsService) {}

  ngOnInit(): void {
    this.keywordsRank$ = this.statisticsService.getKeywordsRank(this.jobs$);
  }

  ngOnChanges(): void {
    this.keywordsRank$ = this.statisticsService.getKeywordsRank(this.jobs$);
  }
}
