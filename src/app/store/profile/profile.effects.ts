import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { switchMap } from 'rxjs';
import { ProfileActions } from './profile.action';
import { FirestoreService } from '../../services/firestore.service';
import { AppwriteDBService } from '../../services/appwrite-db.service';

@Injectable()
export class ProfileEffects {
  private actions$ = inject(Actions);
  private firestore = inject(FirestoreService);
  private appwrite = inject(AppwriteDBService);

  profile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProfileActions.profile),
      switchMap(({ id }) =>
        this.appwrite
          .getDocument('67348e7f0030d5201c3a', id)
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
        this.appwrite
          .updateDocument('67348e7f0030d5201c3a', id, data)
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
