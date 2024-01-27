import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import * as echarts from 'echarts';
import { PublicationSeries } from './publication-chart.model';
import { Observable, debounceTime, first, fromEvent, map } from 'rxjs';
import { ChartService } from '../chart.service';
import { Job } from 'src/app/job/job.types';

@Component({
  selector: 'vgm-publication-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './publication-chart.component.html',
  styleUrls: ['./publication-chart.component.scss'],
})
export class PublicationChartComponent implements AfterViewInit, OnChanges {
  @Input() jobs$?: Observable<Job[]>;
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

    this.chartService
      .getPublicationSeries(this.jobs$)
      .subscribe((publicationSeries) => {
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

  ngOnChanges(): void {
    this.chartService
      .getPublicationSeries(this.jobs$)
      .subscribe((publicationSeries) => {
        this.publicationSeries = publicationSeries;
        this.drawChart();
      });
  }

  private drawChart(): void {
    this.publicationChart.setOption({
      tooltip: {
        trigger: 'axis',
      },
      grid: {
        // To avoid the data zoom overlapping the x axis label
        // https://stackoverflow.com/questions/44497298/echarts-generated-label-overlaps-with-datazoom
        bottom: 90,
      },
      xAxis: {
        type: 'time',
        axisLabel: { showMaxLabel: true },
        name: 'Data de publicação',
        nameLocation: 'center',
        nameGap: 30,
      },
      yAxis: {
        type: 'value',
        splitLine: {
          show: false,
        },
        boundaryGap: ['0%', '10%'],
        name: 'Vagas publicadas',
        nameLocation: 'center',
        nameGap: 30,
      },
      dataZoom: [
        {
          type: 'inside',
          start: 0,
          end: 100,
        },
        {
          start: 0,
          end: 100,
        },
      ],
      series: [
        {
          type: 'bar',
          name: 'Vagas publicadas',
          data: this.publicationSeries,
          smooth: true,
        },
      ],
    });
  }
}
