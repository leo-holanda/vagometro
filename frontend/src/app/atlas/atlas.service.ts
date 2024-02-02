import { Injectable } from '@angular/core';
import * as Realm from 'realm-web';
import { scheduled, asyncScheduler, Observable, switchMap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { GupyJob } from '../job-sources/gupy/gupy.types';

@Injectable({
  providedIn: 'root',
})
export class AtlasService {
  private app = new Realm.App({ id: environment.ATLAS_APP_ID });
  private mongoDB: any;
  private mobileJobsCollection: any;

  constructor() {}

  private async openConnection(): Promise<void> {
    if (this.mobileJobsCollection) return;

    const credentials = Realm.Credentials.anonymous();
    await this.app.logIn(credentials);
    if (this.app.currentUser) {
      this.mongoDB = this.app.currentUser.mongoClient(
        environment.DATA_SOURCE_NAME
      );
      this.mobileJobsCollection = this.mongoDB
        .db(environment.DATABASE_NAME)
        .collection(environment.COLLECTION_NAME);
    }
  }

  getMobileJobs(): Observable<GupyJob[]> {
    return scheduled(this.openConnection(), asyncScheduler).pipe(
      switchMap(() => {
        return scheduled(
          this.mobileJobsCollection.find(),
          asyncScheduler
        ) as Observable<GupyJob[]>;
      })
    );
  }
}
