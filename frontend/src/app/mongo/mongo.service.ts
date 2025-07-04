import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { collectionMap } from './mongo.data';

@Injectable({
  providedIn: 'root',
})
export class MongoService {
  constructor(private http: HttpClient) {}

  getJobs<T>(collectionKey: string): Observable<T> {
    return this.http.post<T>(environment.MONGO_LAMBDA_URL, {
      collectionName: collectionMap[collectionKey].collectionName,
      dbName: collectionMap[collectionKey].dbName,
    });
  }
}
