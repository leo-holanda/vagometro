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
        },
        visualMap: {
          left: 'right',
          min: 0,
          inRange: {
            color: [
              '#313695',
              '#4575b4',
              '#74add1',
              '#abd9e9',
              '#e0f3f8',
              '#ffffbf',
              '#fee090',
              '#fdae61',
              '#f46d43',
              '#d73027',
              '#a50026',
            ],
          },
          text: ['Muitas', 'Poucas'],
          calculable: true,
        },
        series: [
          {
            name: 'States Job Data',
            type: 'map',
            roam: true,
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
  }
}
