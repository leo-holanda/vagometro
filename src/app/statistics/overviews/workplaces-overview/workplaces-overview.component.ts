import { AfterViewInit, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobService } from 'src/app/job/job.service';
import { WorkplacesChartComponent } from '../../charts/workplaces-chart/workplaces-chart.component';
import { CompaniesRankComponent } from '../../ranks/companies-rank/companies-rank.component';
import { Observable } from 'rxjs';
import { Job } from 'src/app/job/job.model';
import { KeywordsRankComponent } from '../../ranks/keywords-rank/keywords-rank.component';
import { TypeRankComponent } from '../../ranks/type-rank/type-rank.component';
import { StatisticsService } from '../../statistics.service';
import { WorkplaceData } from '../../ranks/workplace-rank/workplace-rank.model';
import { PublicationChartComponent } from '../../charts/publication-chart/publication-chart.component';

@Component({
  selector: 'vgm-workplaces-overview',
  standalone: true,
  imports: [
    CommonModule,
    WorkplacesChartComponent,
    CompaniesRankComponent,
    KeywordsRankComponent,
    TypeRankComponent,
    PublicationChartComponent,
  ],
  templateUrl: './workplaces-overview.component.html',
  styleUrls: ['./workplaces-overview.component.scss'],
})
export class WorkplacesOverviewComponent implements OnInit {
  selectedWorkplace: string = 'remoto';

  jobsByWorkplace$: Observable<Job[]>;
  workplacesRank$: Observable<WorkplaceData[]>;
  workplacesQuantity: number = 0;

  constructor(
    private jobService: JobService,
    private statisticsService: StatisticsService
  ) {
    this.workplacesRank$ = this.statisticsService.getWorkplaceRank();

    this.workplacesRank$.subscribe((workplacesRank) => {
      this.selectedWorkplace = workplacesRank[0].type;
      this.workplacesQuantity = workplacesRank.reduce(
        (acc, workplace) => acc + workplace.count,
        0
      );
    });

    this.jobsByWorkplace$ = this.jobService.getJobsByWorkplace(
      this.selectedWorkplace
    );
  }

  ngOnInit(): void {}

  onWorkplaceClick(workplace: string): void {
    this.selectedWorkplace = workplace;
    this.jobsByWorkplace$ = this.jobService.getJobsByWorkplace(
      this.selectedWorkplace
    );
  }
}
