import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatisticsService } from '../../statistics.service';
import { TypeData } from './type-rank.model';
import { Observable, map } from 'rxjs';
import { translations } from './type-rank.translations';
import { Job } from 'src/app/job/job.model';

@Component({
  selector: 'vgm-type-rank',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './type-rank.component.html',
  styleUrls: ['./type-rank.component.scss'],
})
export class TypeRankComponent implements OnInit, OnChanges {
  @Input() jobs$?: Observable<Job[]>;
  typesRank$!: Observable<TypeData[]>;

  translations = translations;

  constructor(private statisticsService: StatisticsService) {}

  ngOnInit(): void {
    this.typesRank$ = this.statisticsService.getTypesRank(this.jobs$);
  }

  ngOnChanges(): void {
    this.typesRank$ = this.statisticsService.getTypesRank(this.jobs$);
  }
}
