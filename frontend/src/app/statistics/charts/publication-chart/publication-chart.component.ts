import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as echarts from 'echarts';
import {
  MonthlyPostingsSeries,
  DailyPostingsSeries,
  AnnualPostingsSeries,
  JobPostingsSeries,
  IntervalTypes,
} from './publication-chart.model';
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
  @Input() intervalType: IntervalTypes = 'daily';
  @Input() onlyLongTermIntervals = false;
  @Output() intervalTypeChanged = new EventEmitter<IntervalTypes>();
  @ViewChild('chartwrapper') chartWrapper!: ElementRef<HTMLElement>;

  isChartLoading = true;

  private publicationChart!: echarts.EChartsType;
  private yAxisMaxValue!: number;

  private destroy$ = new Subject<void>();

  constructor(private chartService: ChartService) {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngAfterViewInit(): void {
    this.publicationChart = echarts.init(this.chartWrapper.nativeElement);
    this.setChartDefaultOptions();
    this.publicationChart.showLoading('default', {
      maskColor: 'rgba(0, 0, 0, 0)',
      text: 'Carregando...',
      textColor: 'white',
    });

    fromEvent(window, 'resize')
      .pipe(debounceTime(250))
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.publicationChart.resize();
      });

    this.setPostingsData();
  }

  ngOnChanges(): void {
    this.setPostingsData();
  }

  setPostingsData(): void {
    if (this.intervalType == 'daily') {
      this.chartService.getDailyPostingsSeries().subscribe((postingsSeries) => {
        this.yAxisMaxValue = this.getYAxisMaxValue(postingsSeries);
      });

      this.chartService.getDailyPostingsSeries(this.jobs$).subscribe((postingsSeries) => {
        if (this.isChartLoading) {
          this.publicationChart.hideLoading();
          this.isChartLoading = false;
        }
        this.drawShortTermPostingsChart(postingsSeries);
      });
    } else if (this.intervalType == 'monthly') {
      this.chartService.getMonthlyPostingsSeries().subscribe((postingsSeries) => {
        this.yAxisMaxValue = this.getYAxisMaxValue(postingsSeries);
      });

      this.chartService.getMonthlyPostingsSeries(this.jobs$).subscribe((postingsSeries) => {
        if (this.isChartLoading) {
          this.publicationChart.hideLoading();
          this.isChartLoading = false;
        }
        this.drawLongTermPostingsChart(postingsSeries);
      });
    } else {
      this.chartService.getAnnualPostingsSeries().subscribe((postingsSeries) => {
        this.yAxisMaxValue = this.getYAxisMaxValue(postingsSeries);
      });

      this.chartService.getAnnualPostingsSeries(this.jobs$).subscribe((postingsSeries) => {
        if (this.isChartLoading) {
          this.publicationChart.hideLoading();
          this.isChartLoading = false;
        }
        this.drawLongTermPostingsChart(postingsSeries);
      });
    }
  }

  setIntervalType(intervalType: IntervalTypes): void {
    this.intervalType = intervalType;
    this.intervalTypeChanged.emit(intervalType);
    this.setPostingsData();
  }

  private getYAxisMaxValue(postingsSeries: JobPostingsSeries): number {
    //Without this map, the app doesn't not compile. TypeScript error.
    const postingsSeriesValues = postingsSeries.map((value) => value[1]);
    return postingsSeriesValues.reduce((max, value) => {
      if (value > max) return value;
      return max;
    }, 0);
  }

  private setChartDefaultOptions(): void {
    this.publicationChart.setOption({
      tooltip: {
        trigger: 'axis',
      },
      grid: {
        // To prevent the data zoom from overlapping the x axis label
        // https://stackoverflow.com/questions/44497298/echarts-generated-label-overlaps-with-datazoom
        bottom: 90,
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
    });
  }

  private drawLongTermPostingsChart(postingsSeries: MonthlyPostingsSeries | AnnualPostingsSeries): void {
    this.publicationChart.setOption({
      xAxis: {
        type: 'category',
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
      series: [
        {
          type: 'bar',
          name: 'Vagas publicadas',
          data: postingsSeries,
          smooth: true,
        },
      ],
    });
  }

  private drawShortTermPostingsChart(postingsSeries: DailyPostingsSeries): void {
    this.publicationChart.setOption({
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
      series: [
        {
          type: 'bar',
          name: 'Vagas publicadas',
          data: postingsSeries,
        },
      ],
    });
  }
}
