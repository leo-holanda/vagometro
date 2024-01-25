import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, map } from 'rxjs';
import { LanguageData } from './languages-rank.types';
import { trackByLanguage } from 'src/app/shared/track-by-functions';
import { Job } from 'src/app/job/job.types';
import { StatisticsService } from '../../statistics.service';

@Component({
  selector: 'vgm-languages-rank',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './languages-rank.component.html',
  styleUrls: ['./languages-rank.component.scss'],
})
export class LanguagesRankComponent {
  @Input() jobs$?: Observable<Job[]>;
  @Input() rankSize: number | undefined;

  languagesRank$!: Observable<LanguageData[]>;

  trackByLanguage = trackByLanguage;

  constructor(private statisticsService: StatisticsService) {
    this.languagesRank$ = this.statisticsService.getLanguagesRank();

    if (this.rankSize)
      this.languagesRank$ = this.languagesRank$.pipe(
        map((languagesRank) => languagesRank.slice(0, this.rankSize))
      );
  }

  ngOnChanges(): void {
    this.languagesRank$ = this.statisticsService.getLanguagesRank(this.jobs$);

    if (this.rankSize)
      this.languagesRank$ = this.languagesRank$.pipe(
        map((languagesRank) => languagesRank.slice(0, this.rankSize))
      );
  }
}
