import { Injectable } from '@angular/core';
import * as Realm from 'realm-web';
import { Observable, switchMap, defer } from 'rxjs';
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
    return defer(() => this.openConnection()).pipe(
      switchMap(() =>
        defer(() => this.mobileJobsCollection.find() as Observable<GupyJob[]>)
      )
    );
  }
}
