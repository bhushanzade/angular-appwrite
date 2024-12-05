// src/app/store/auth.effects.ts
import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { AppwriteDBService } from '../../services/appwrite-db.service';
import { MessageActions } from './message.action';
import { AppwriteRealtimeDBService } from '../../services/appwrite-db-realtime.service';

@Injectable()
export class MessageEffects {
  private actions$ = inject(Actions);
  private appwrite = inject(AppwriteDBService);
  private appwriteRealtime = inject(AppwriteRealtimeDBService);

  fetch$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MessageActions.fetch),
      switchMap(() =>
        this.appwrite
          .getCollection('messages')
          .then((res) => MessageActions.fetchSuccess({ data: res }))
          .catch((error) =>
            MessageActions.fetchFailure({ error: error.message }),
          ),
      ),
    ),
  );

  fetchRealtime$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MessageActions.fetchRealtime),
      switchMap(() =>
        this.appwriteRealtime.getCollectionUpdates('messages').pipe(
          map((res) => MessageActions.sendMessageSuccess({ data: res })),
          catchError((error) => [
            MessageActions.fetchFailure({ error: error.message }),
          ]),
        ),
      ),
    ),
  );

  sendMessage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MessageActions.sendMessage),
      switchMap(({ data }) =>
        this.appwrite
          .createDocument('messages', data)
          .then((res) => {
            return MessageActions.sendMessageSuccess({ data: res });
          })
          .catch((error) => {
            return MessageActions.sendMessageFailure({ error: error.message });
          }),
      ),
    ),
  );
}
