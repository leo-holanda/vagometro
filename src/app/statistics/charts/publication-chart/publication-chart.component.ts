import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as echarts from 'echarts';
import { PublicationSeries } from './publication-chart.model';
import { Observable, debounceTime, first, fromEvent, map } from 'rxjs';
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
  private publicationSeries!: PublicationSeries;
  private publicationChart!: echarts.EChartsType;

  constructor(private chartService: ChartService) {}

  ngAfterViewInit(): void {
    this.publicationChart = echarts.init(this.chartWrapper.nativeElement);
    this.publicationChart.showLoading('default', {
      maskColor: 'rgba(0, 0, 0, 0)',
      text: 'Carregando...',
      textColor: 'white',
    });

    this.chartService.getPublicationSeries().subscribe((publicationSeries) => {
      this.publicationSeries = publicationSeries;
      this.publicationChart.hideLoading();
      this.drawChart();
    });

    fromEvent(window, 'resize')
      .pipe(debounceTime(250))
      .subscribe(() => {
        this.publicationChart.resize();
      });
  }

  private drawChart(): void {
    this.publicationChart.setOption({
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
          data: this.publicationSeries,
          areaStyle: {},
          smooth: true,
        },
      ],
    });
  }
}
