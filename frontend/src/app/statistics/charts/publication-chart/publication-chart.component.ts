import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import * as echarts from 'echarts';
import {
  MonthlyPostingsSeries,
  DailyPostingsSeries,
  AnnualPostingsSeries,
  JobPostingsSeries,
  IntervalTypes,
  ShortTermSeriesData,
  MovingAverageTypes,
} from './publication-chart.model';
import {
  Observable,
  Subject,
  combineLatest,
  debounceTime,
  fromEvent,
  of,
  switchMap,
  takeUntil,
} from 'rxjs';
import { ChartService } from '../chart.service';
import { Job } from 'src/app/job/job.types';
import { WindowResolutionObserverService } from 'src/app/shared/window-resolution-observer.service';

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

  matchesMobileBreakpoint$: Observable<boolean>;
  isChartLoading = true;

  movingAverageType: MovingAverageTypes = '7d';
  hasChangedMovingAverageType = false;

  private publicationChart!: echarts.EChartsType;
  private yAxisMaxValue!: number;

  private destroy$ = new Subject<void>();

  constructor(
    private chartService: ChartService,
    private windowResolutionObserver: WindowResolutionObserverService,
  ) {
    this.matchesMobileBreakpoint$ = this.windowResolutionObserver.matchesMobileBreakpoint();
  }

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
    if (this.intervalType == 'daily') this.setDailyPostings();
    else if (this.intervalType == 'monthly') this.setMonthlyPostings();
    else this.setAnnualPostings();
  }

  setIntervalType(intervalType: IntervalTypes): void {
    this.intervalType = intervalType;
    this.intervalTypeChanged.emit(intervalType);
    this.setPostingsData();
  }

  setMovingAverageType(movingAverageType: MovingAverageTypes): void {
    this.movingAverageType = movingAverageType;
    this.hasChangedMovingAverageType = true;
    this.setPostingsData();
  }

  private getYAxisMaxValue(postingsSeries: JobPostingsSeries): number {
    //Without this map, the app doesn't not compile. TypeScript error.
    const postingsSeriesValues = postingsSeries.map((data) => data.value);
    const yAxisMaxValue = postingsSeriesValues.reduce((max, value) => {
      if (value[1] > max) return value[1];
      return max;
    }, 0);

    if (yAxisMaxValue < 100) {
      const valueRoundedToNextTen = yAxisMaxValue + (10 - (yAxisMaxValue % 10));
      return valueRoundedToNextTen;
    } else {
      const valueRoundedToNextHundred = yAxisMaxValue + (100 - (yAxisMaxValue % 100));
      return valueRoundedToNextHundred;
    }
  }

  private setDailyPostings(): void {
    this.chartService
      .getDailyPostingsSeries()
      .pipe(
        switchMap((postingsSeries) => {
          this.yAxisMaxValue = this.getYAxisMaxValue(postingsSeries);
          //TODO: Make this only call the necessary moving average function
          return combineLatest([
            this.chartService.getDailyPostingsSeries(this.jobs$),
            this.chartService.getWeeklyMovingAverage(this.jobs$),
            this.chartService.getMonthlyMovingAverage(this.jobs$),
          ]);
        }),
      )
      .subscribe(([dailyPostingsSeries, weeklyMovingAverage, monthlyMovingAverage]) => {
        if (this.isChartLoading) {
          this.publicationChart.hideLoading();
          this.isChartLoading = false;
        }

        if (this.hasChangedMovingAverageType) {
          switch (this.movingAverageType) {
            case '7d':
              this.drawShortTermPostingsChart(dailyPostingsSeries, weeklyMovingAverage);
              break;

            case '30d':
              this.drawShortTermPostingsChart(dailyPostingsSeries, monthlyMovingAverage, false);
              break;

            default:
              this.drawShortTermPostingsChart(dailyPostingsSeries, weeklyMovingAverage);
              break;
          }
        } else {
          if (dailyPostingsSeries.length > 180) {
            this.movingAverageType = '30d';
            this.drawShortTermPostingsChart(dailyPostingsSeries, monthlyMovingAverage, false);
          } else {
            this.movingAverageType = '7d';
            this.drawShortTermPostingsChart(dailyPostingsSeries, weeklyMovingAverage);
          }
        }
      });
  }

  private setMonthlyPostings(): void {
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
  }

  private setAnnualPostings(): void {
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

  private setChartDefaultOptions(): void {
    this.publicationChart.setOption({
      tooltip: {
        trigger: 'axis',
      },
      grid: {
        containLabel: true,
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

  private drawLongTermPostingsChart(
    postingsSeries: MonthlyPostingsSeries | AnnualPostingsSeries,
  ): void {
    postingsSeries[postingsSeries.length - 1].itemStyle = {
      color: '#E7A626',
      decal: {
        dashArrayX: [1, 0],
        dashArrayY: [2, 8],
        rotation: 0.5235987755982988,
      },
    };

    this.publicationChart.setOption(
      {
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
      },
      true,
    );

    this.setChartDefaultOptions();
  }

  private drawShortTermPostingsChart(
    postingsSeries: DailyPostingsSeries,
    movingAverageSeries: ShortTermSeriesData[],
    isWeekly = true,
  ): void {
    postingsSeries[postingsSeries.length - 1].itemStyle = {
      color: '#E7A626',
      decal: {
        dashArrayX: [1, 0],
        dashArrayY: [2, 5],
        rotation: 0.5235987755982988,
      },
    };

    this.publicationChart.setOption(
      {
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
          {
            type: 'line',
            name: `Média movel (${isWeekly ? '7' : '30'} dias)`,
            data: movingAverageSeries.slice(0, movingAverageSeries.length - 1),
          },
          {
            type: 'line',
            name: `Média movel (${isWeekly ? '7' : '30'} dias)`,
            lineStyle: {
              color: '#E7A626',
              type: 'dashed',
            },
            itemStyle: {
              color: '#E7A626',
            },
            data: movingAverageSeries.slice(movingAverageSeries.length - 2),
          },
        ],
      },
      true,
    );

    this.setChartDefaultOptions();
  }
}
