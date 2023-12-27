import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as echarts from 'echarts';
import { PublicationSeries } from './publication-chart.model';
import { Observable, first, map } from 'rxjs';
import { ChartService } from '../chart.service';

@Component({
  selector: 'vgm-publication-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './publication-chart.component.html',
  styleUrls: ['./publication-chart.component.scss'],
})
export class PublicationChartComponent implements AfterViewInit {
  @ViewChild('chartwrapper') chartWrapper!: ElementRef<HTMLElement>;

  constructor(private chartService: ChartService) {}

  ngAfterViewInit(): void {
    const publicationChart = echarts.init(this.chartWrapper.nativeElement);

    this.chartService
      .getPublicationSeries()
      .pipe(first())
      .subscribe((publicationSeries) => {
        publicationChart.setOption({
          tooltip: {
            trigger: 'axis',
          },
          xAxis: {
            type: 'time',
          },

          yAxis: {
            type: 'value',
            splitLine: {
              show: false,
            },
          },
          series: [
            {
              type: 'line',
              data: publicationSeries,
              areaStyle: {},
              smooth: true,
            },
          ],
        });
      });
  }
}
