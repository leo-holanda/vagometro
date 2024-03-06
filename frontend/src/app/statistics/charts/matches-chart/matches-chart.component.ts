import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, Subject, debounceTime, fromEvent, takeUntil } from 'rxjs';
import { Job } from 'src/app/job/job.types';
import { ChartService } from '../chart.service';
import { MatchData } from '../publication-chart/publication-chart.model';
import * as echarts from 'echarts';
import { EasySearchService } from 'src/app/job/easy-search/easy-search.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'vgm-matches-chart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './matches-chart.component.html',
  styleUrls: ['./matches-chart.component.scss'],
})
export class MatchesChartComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input() jobs$?: Observable<Job[]>;

  hasSearchData = false;

  @ViewChild('chartWrapper') chartWrapper!: ElementRef<HTMLElement>;

  private matchesChart!: echarts.EChartsType;
  private destroy$ = new Subject<void>();

  constructor(
    private chartService: ChartService,
    private easySearchService: EasySearchService,
  ) {
    this.hasSearchData = this.easySearchService.hasSearchData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnChanges(): void {
    this.setMatchesData();
  }

  ngAfterViewInit(): void {
    if (!this.hasSearchData) return;

    this.matchesChart = echarts.init(this.chartWrapper.nativeElement);
    this.setChartDefaultOptions();
    this.matchesChart.showLoading('default', {
      maskColor: 'rgba(0, 0, 0, 0)',
      text: 'Carregando...',
      textColor: 'white',
    });

    fromEvent(window, 'resize')
      .pipe(debounceTime(250))
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.matchesChart.resize();
      });

    this.setMatchesData();
  }

  private setMatchesData(): void {
    if (!this.hasSearchData) return;

    this.chartService.getMatchesData(this.jobs$).subscribe((matchesData) => {
      this.drawChart(matchesData);
    });
  }

  private setChartDefaultOptions(): void {
    this.matchesChart.setOption({
      tooltip: {
        trigger: 'axis',
      },
      grid: {
        containLabel: true,
      },
    });
  }

  private drawChart(matchesData: MatchData[]): void {
    this.matchesChart.hideLoading();
    this.matchesChart.setOption({
      xAxis: {
        type: 'category',
        axisLabel: { showMaxLabel: true },
        name: 'Seu match com as vagas',
        nameLocation: 'center',
        nameGap: 30,
      },
      yAxis: {
        type: 'value',
        splitLine: {
          show: false,
        },
        boundaryGap: ['0%', '10%'],
        name: 'Quantidade de vagas',
        nameLocation: 'center',
        nameGap: 40,
      },
      series: [
        {
          type: 'bar',
          name: 'Vagas publicadas',
          data: matchesData,
          smooth: true,
        },
      ],
    });
  }
}
