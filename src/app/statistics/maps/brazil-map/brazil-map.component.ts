import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapDataService } from '../map-data.service';
import * as echarts from 'echarts';
import { fromEvent, debounceTime } from 'rxjs';
import { StatesData } from './brazil-map.model';

@Component({
  selector: 'vgm-brazil-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './brazil-map.component.html',
  styleUrls: ['./brazil-map.component.scss'],
})
export class BrazilMapComponent implements AfterViewInit {
  @ViewChild('mapwrapper') mapWrapper!: ElementRef<HTMLElement>;
  @Output() stateClicked = new EventEmitter<string>();

  constructor(private mapDataService: MapDataService) {}

  ngAfterViewInit(): void {
    const map = echarts.init(this.mapWrapper.nativeElement);
    echarts.registerMap('brazil', this.mapDataService.mapGeoJson);

    this.mapDataService.getStatesData().subscribe((statesData) => {
      map.setOption({
        tooltip: {
          trigger: 'item',
          showDelay: 0,
          transitionDuration: 0.2,
          formatter: (stateData: any) => {
            return `<strong>${stateData.name || 'Desconhecido'}</strong></br>${
              stateData.value || 0
            } vagas publicadas`;
          },
        },
        visualMap: {
          min: 0,
          max: this.getMaxJobQuantity(statesData),
          inRange: {
            color: [
              'rgba(255, 255, 204, 0)',
              '#a1dab4',
              '#41b6c4',
              '#2c7fb8',
              '#253494',
            ],
          },
          text: ['Muitas vagas', 'Poucas vagas'],
          calculable: true,
        },
        series: [
          {
            name: 'Vagas por estado',
            type: 'map',
            map: 'brazil',
            emphasis: {
              label: {
                show: true,
              },
            },
            data: statesData,
          },
        ],
      });
    });

    map.on('click', (params: any) => {
      this.stateClicked.emit(params.name);
    });

    fromEvent(window, 'resize')
      .pipe(debounceTime(250))
      .subscribe(() => {
        map.resize();
      });
  }

  getMaxJobQuantity(statesData: StatesData[]): number {
    return statesData.reduce((acc, item) => {
      if (item.value > acc) acc = item.value;
      return acc;
    }, 0);
  }
}
