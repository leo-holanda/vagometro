import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatisticsService } from '../../statistics.service';
import { TypeData } from './type-rank.model';
import { Observable, map } from 'rxjs';
import { translations } from './type-rank.translations';

@Component({
  selector: 'vgm-type-rank',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './type-rank.component.html',
  styleUrls: ['./type-rank.component.scss'],
})
export class TypeRankComponent implements OnInit {
  typeRank!: Observable<TypeData[]>;
  translations = translations;

  constructor(private statisticsService: StatisticsService) {}

  ngOnInit(): void {
    this.typeRank = this.statisticsService
      .getTypeRank()
      .pipe(map((typeRank) => typeRank.slice(0, 5)));
  }
}
