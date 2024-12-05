import { createAction, props } from '@ngrx/store';

export const ProfileActions = {
  profile: createAction('[Auth] Profile', props<{ id: string }>()),
  profileSuccess: createAction(
    '[Auth] Profile Success',
    props<{ data: any }>(),
  ),
  profileFailure: createAction(
    '[Auth] Profiel Failure',
    props<{ error: any }>(),
  ),
  updateProfile: createAction(
    '[Auth] Update Profile',
    props<{ id: string; data: any }>(),
  ),
  updateProfileSuccess: createAction(
    '[Auth] Update Profile Success',
    props<{ data: any }>(),
  ),
  updateProfileFailure: createAction(
    '[Auth] Update Profile Failure',
    props<{ error: any }>(),
  ),
  updateProfilePic: createAction(
    '[Auth] Update Profile Image',
    props<{ uid: string; storageId: string; file: File }>(),
  ),
  updateProfilePicFailure: createAction(
    '[Auth] Update Profile Image Failure',
    props<{ error: any }>(),
  ),
  getProfilePic: createAction(
    '[Auth] Get Profile Image',
    props<{ storageId: string; fileId: string }>(),
  ),
  getProfilePicSuccess: createAction(
    '[Auth] Get Profile Image',
    props<{ data: any }>(),
  ),
  getProfilePicFailure: createAction(
    '[Auth] Get Profile Image Failed',
    props<{ error: any }>(),
  ),
};
