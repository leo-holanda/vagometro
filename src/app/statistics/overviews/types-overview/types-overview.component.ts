import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TypeData } from '../../ranks/type-rank/type-rank.model';
import { Observable } from 'rxjs';
import { JobService } from 'src/app/job/job.service';
import { StatisticsService } from '../../statistics.service';
import { Job } from 'src/app/job/job.model';
import { KeywordsRankComponent } from '../../ranks/keywords-rank/keywords-rank.component';
import { CompaniesRankComponent } from '../../ranks/companies-rank/companies-rank.component';
import { WorkplaceRankComponent } from '../../ranks/workplace-rank/workplace-rank.component';
import { translations } from '../../ranks/type-rank/type-rank.translations';
import { PublicationChartComponent } from '../../charts/publication-chart/publication-chart.component';
import { JobListComponent } from 'src/app/job/job-list/job-list.component';

@Component({
  selector: 'vgm-types-overview',
  standalone: true,
  imports: [
    CommonModule,
    KeywordsRankComponent,
    CompaniesRankComponent,
    WorkplaceRankComponent,
    PublicationChartComponent,
    JobListComponent,
  ],
  templateUrl: './types-overview.component.html',
  styleUrls: ['./types-overview.component.scss'],
})
export class TypesOverviewComponent implements OnInit {
  typesRank$!: Observable<TypeData[]>;
  typesQuantity!: number;
  selectedType!: string;
  jobsByType$!: Observable<Job[]>;

  typesTranslations = translations;

  constructor(
    private statisticsService: StatisticsService,
    private jobService: JobService
  ) {}

  ngOnInit(): void {
    this.typesRank$ = this.statisticsService.getTypesRank();

    this.typesRank$.subscribe((typesRank) => {
      this.selectedType = typesRank[0].name;

      this.jobsByType$ = this.jobService.getJobsByType(this.selectedType);
    });

    this.typesRank$.subscribe((typesRank) => {
      this.typesQuantity = typesRank.reduce((acc, Type) => acc + Type.count, 0);
    });
  }

  onTypeClick(TypeName: string): void {
    this.selectedType = TypeName;

    this.jobsByType$ = this.jobService.getJobsByType(this.selectedType);
  }
}
