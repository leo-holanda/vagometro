import { AfterViewInit, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobService } from 'src/app/job/job.service';
import { WorkplacesChartComponent } from '../../charts/workplaces-chart/workplaces-chart.component';
import { CompaniesRankComponent } from '../../ranks/companies-rank/companies-rank.component';
import { Observable } from 'rxjs';
import { Job } from 'src/app/job/job.model';
import { KeywordsRankComponent } from '../../ranks/keywords-rank/keywords-rank.component';
import { TypeRankComponent } from '../../ranks/type-rank/type-rank.component';

@Component({
  selector: 'vgm-workplaces-overview',
  standalone: true,
  imports: [
    CommonModule,
    WorkplacesChartComponent,
    CompaniesRankComponent,
    KeywordsRankComponent,
    TypeRankComponent,
  ],
  templateUrl: './workplaces-overview.component.html',
  styleUrls: ['./workplaces-overview.component.scss'],
})
export class WorkplacesOverviewComponent implements OnInit {
  selectedWorkplace: string = 'remoto';
  jobsByWorkplace$!: Observable<Job[]>;

  constructor(private jobService: JobService) {}

  ngOnInit(): void {
    this.jobsByWorkplace$ = this.jobService.getJobsByWorkplace(
      this.selectedWorkplace
    );
  }

  onWorkplaceClick(workplace: string): void {
    this.selectedWorkplace = workplace;
    this.jobsByWorkplace$ = this.jobService.getJobsByWorkplace(
      this.selectedWorkplace
    );
  }
}
