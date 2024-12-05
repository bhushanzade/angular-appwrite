import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { switchMap } from 'rxjs';
import { ProfileActions } from './profile.action';
import { AppwriteDBService } from '../../services/appwrite-db.service';

@Injectable()
export class ProfileEffects {
  private actions$ = inject(Actions);
  private appwrite = inject(AppwriteDBService);

  profile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProfileActions.profile),
      switchMap(({ id }) =>
        this.appwrite
          .getDocument('users', id)
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
          .updateDocument('users', id, data)
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

  updateProfilePic$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProfileActions.updateProfilePic),
      switchMap(({ uid, storageId, file }) =>
        this.appwrite
          .uploadFile(file, storageId)
          .then((res) => {
            console.log('file res', res);
            return ProfileActions.updateProfile({
              id: uid,
              data: { pic: res.$id },
            });
          })
          .catch((error) => {
            return ProfileActions.updateProfilePicFailure({
              error: error.message,
            });
          }),
      ),
    ),
  );

  getProfilePic$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProfileActions.getProfilePic),
      switchMap(({ storageId, fileId }) =>
        this.appwrite
          .getFile(fileId, storageId)
          .then((res) => {
            console.log('file res', res);
            return ProfileActions.getProfilePicSuccess({ data: res });
          })
          .catch((error) => {
            return ProfileActions.updateProfilePicFailure({
              error: error.message,
            });
          }),
      ),
    ),
  );
}
