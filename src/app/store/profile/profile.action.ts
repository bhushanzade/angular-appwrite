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
};
