import { AfterViewInit, Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as echarts from 'echarts';
import { StatisticsService } from '../../statistics.service';
import { fromEvent, debounceTime } from 'rxjs';

@Component({
  selector: 'vgm-workplaces-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './workplaces-chart.component.html',
  styleUrls: ['./workplaces-chart.component.scss'],
})
export class WorkplacesChartComponent implements AfterViewInit {
  @ViewChild('chartwrapper') chartWrapper!: ElementRef<HTMLElement>;
  @Output() workplaceClicked = new EventEmitter<string>();

  constructor(private statisticsService: StatisticsService) {}

  ngAfterViewInit(): void {
    const workplacesChart = echarts.init(this.chartWrapper.nativeElement);

    this.statisticsService.getWorkplaceRank().subscribe((workplacesRank) => {
      workplacesChart.setOption({
        xAxis: {
          type: 'category',
          data: workplacesRank.map((workplace) => workplace.type),
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            data: workplacesRank.map((workplace) => workplace.count),
            type: 'bar',
          },
        ],
      });
    });

    workplacesChart.on('click', (params: any) => {
      this.workplaceClicked.emit(params.name);
    });

    fromEvent(window, 'resize')
      .pipe(debounceTime(250))
      .subscribe(() => {
        workplacesChart.resize();
      });
  }
}
