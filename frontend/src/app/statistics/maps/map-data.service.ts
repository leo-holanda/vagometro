import { Injectable } from '@angular/core';
import { Observable, filter, map } from 'rxjs';
import { Job } from 'src/app/job/job.types';
import { JobService } from 'src/app/job/job.service';
import * as topojson from 'topojson-client';
import brazilTopoJson from '../../../assets/brazil.json';
import { StatesData } from './brazil-map/brazil-map.model';

@Injectable({
  providedIn: 'root',
})
export class MapDataService {
  mapGeoJson!: any; //TODO: Set the correct type

  constructor(private jobService: JobService) {
    this.mapGeoJson = topojson.feature(
      brazilTopoJson as unknown as TopoJSON.Topology,
      brazilTopoJson.objects.uf as unknown as TopoJSON.GeometryCollection,
    );
  }

  getCitiesNames(): string[] {
    return this.mapGeoJson.features.map((feature: any) => feature.properties.name);
  }

  getStatesData(): Observable<StatesData[]> {
    return this.jobService.jobs$.pipe(
      filter((jobs): jobs is Job[] => jobs != undefined),
      map((jobs) => {
        const statesMap = new Map<string, number>();

        this.mapGeoJson.features.forEach((feature: any) => {
          statesMap.set(feature.properties.name, 0);
        });

        jobs.forEach((job) => {
          if (!job.state) return;
          const currentStateCount = statesMap.get(job.state) || 0;
          statesMap.set(job.state, currentStateCount + 1);
        });

        const statesData = Array.from(statesMap.entries()).map(
          ([key, value]): StatesData => ({
            name: key,
            value: value,
          }),
        );

        return statesData;
      }),
    );
  }
}
