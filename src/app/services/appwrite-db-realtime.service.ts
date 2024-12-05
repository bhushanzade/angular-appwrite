import { inject, Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { client } from '../appwrite';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AppwriteRealtimeDBService {
  private toastr = inject(ToastrService);
  private databaseId = environment.appWrite.databaseId;

  getCollectionUpdates(collectionId: string): Observable<any> {
    return new Observable((observer) => {
      const unsubscribe = client.subscribe(
        `databases.${this.databaseId}.collections.${collectionId}.documents`,
        (response) => {
          if (
            response.events.includes(
              'databases.*.collections.*.documents.*.create',
            )
          ) {
            observer.next(response.payload);
          }
        },
      );
      return () => {
        unsubscribe();
      };
    });
  }
}
