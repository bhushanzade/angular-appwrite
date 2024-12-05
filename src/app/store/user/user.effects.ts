// src/app/store/auth.effects.ts
import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { switchMap } from 'rxjs/operators';
import { UserActions } from './user.action';
import { AppwriteDBService } from '../../services/appwrite-db.service';

@Injectable()
export class UserEffects {
  private actions$ = inject(Actions);
  private appwrite = inject(AppwriteDBService);

  fetch$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.fetch),
      switchMap(({ limit, offset }) =>
        this.appwrite
          .getCollection('users', limit, offset)
          .then((res) => {
            return UserActions.fetchSuccess({ data: res });
          })
          .catch((error) => {
            return UserActions.fetchFailure({ error: error.message });
          }),
      ),
    ),
  );

  fetchById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.fetchById),
      switchMap(({ id }) =>
        this.appwrite
          .getDocument('users', id)
          .then((res) => {
            return UserActions.fetchByIdSuccess({ data: res });
          })
          .catch((error) => {
            return UserActions.fetchByIdFailure({ error: error.message });
          }),
      ),
    ),
  );
}
