import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

type CollectionData = {
  collectionName: string;
  dbName: string;
};

@Injectable({
  providedIn: 'root',
})
export class MongoService {
  private collectionMap: Record<string, CollectionData> = {
    gupyDev: {
      collectionName: 'webdev',
      dbName: 'gupy',
    },
    gupyMobile: {
      collectionName: 'mobile',
      dbName: 'gupy',
    },
    gupyDevops: {
      collectionName: 'devops',
      dbName: 'gupy',
    },
    gupyUIUX: {
      collectionName: 'ui/ux',
      dbName: 'gupy',
    },
    gupyDados: {
      collectionName: 'dados',
      dbName: 'gupy',
    },
    gupyQA: {
      collectionName: 'qa',
      dbName: 'gupy',
    },
    gupyIA: {
      collectionName: 'ia',
      dbName: 'gupy',
    },
    gupyProductManager: {
      collectionName: 'productManager',
      dbName: 'gupy',
    },
    gupyAgileRelated: {
      collectionName: 'agile',
      dbName: 'gupy',
    },
    gupyRecruitment: {
      collectionName: 'recrutamento',
      dbName: 'gupy',
    },
    linkedinDev: {
      collectionName: 'dev',
      dbName: 'linkedin',
    },
  };

  constructor(private http: HttpClient) {}

  getJobs<T>(collectionKey: string): Observable<T> {
    return this.http.post<T>(environment.MONGO_LAMBDA_URL, {
      collectionName: this.collectionMap[collectionKey].collectionName,
      dbName: this.collectionMap[collectionKey].dbName,
    });
  }
}
