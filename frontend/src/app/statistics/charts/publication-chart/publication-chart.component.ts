import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as echarts from 'echarts';
import { PublicationSeries } from './publication-chart.model';
import { Observable, Subject, debounceTime, fromEvent, takeUntil } from 'rxjs';
import { ChartService } from '../chart.service';
import { Job } from 'src/app/job/job.types';

@Component({
  selector: 'vgm-publication-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './publication-chart.component.html',
  styleUrls: ['./publication-chart.component.scss'],
})
export class PublicationChartComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input() jobs$?: Observable<Job[]>;
  @ViewChild('chartwrapper') chartWrapper!: ElementRef<HTMLElement>;

  private destroy$ = new Subject<void>();

  private publicationSeries!: PublicationSeries;
  private publicationChart!: echarts.EChartsType;
  private yAxisMaxValue!: number;

  constructor(private chartService: ChartService) {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngAfterViewInit(): void {
    this.publicationChart = echarts.init(this.chartWrapper.nativeElement);
    this.publicationChart.showLoading('default', {
      maskColor: 'rgba(0, 0, 0, 0)',
      text: 'Carregando...',
      textColor: 'white',
    });

    this.chartService
      .getPublicationSeries()
      .pipe(takeUntil(this.destroy$))
      .subscribe((publicationSeries) => {
        this.yAxisMaxValue = this.getYAxisMaxValue(publicationSeries);
      });

    this.chartService
      .getPublicationSeries(this.jobs$)
      .pipe(takeUntil(this.destroy$))
      .subscribe((publicationSeries) => {
        this.publicationSeries = publicationSeries;
        this.publicationChart.hideLoading();
        this.drawChart();
      });

    fromEvent(window, 'resize')
      .pipe(debounceTime(250))
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.publicationChart.resize();
      });
  }

  ngOnChanges(): void {
    this.chartService
      .getPublicationSeries(this.jobs$)
      .pipe(takeUntil(this.destroy$))
      .subscribe((publicationSeries) => {
        this.publicationSeries = publicationSeries;
        this.drawChart();
      });
  }

  private getYAxisMaxValue(publicationSeries: PublicationSeries): number {
    return publicationSeries.reduce((max, value) => {
      if (value[1] > max) return value[1];
      return max;
    }, 0);
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
        min: 0,
        max: this.yAxisMaxValue,
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
