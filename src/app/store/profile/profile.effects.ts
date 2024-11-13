import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { switchMap } from 'rxjs';
import { ProfileActions } from './profile.action';
import { FirestoreService } from '../../services/firestore.service';

@Injectable()
export class ProfileEffects {
  private actions$ = inject(Actions);
  private firestore = inject(FirestoreService);

  profile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProfileActions.profile),
      switchMap(({ id }) =>
        this.firestore
          .getDocument('users/' + id)
          .then((res) => {
            return ProfileActions.profileSuccess({ data: res });
          })
          .catch((error) => {
            return ProfileActions.profileFailure({ error: error.message });
          }),
      ),
    ),
  );

  updateProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProfileActions.updateProfile),
      switchMap(({ id, data }) =>
        this.firestore
          .updateDocument('users/' + id, data)
          .then((res) => {
            return ProfileActions.updateProfileSuccess({ data: res });
          })
          .catch((error) => {
            return ProfileActions.updateProfileFailure({
              error: error.message,
            });
          }),
      ),
    ),
  );
}
