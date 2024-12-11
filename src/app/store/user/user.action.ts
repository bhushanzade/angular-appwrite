import { createAction, props } from '@ngrx/store';

export const UserActions = {
  fetch: createAction(
    '[Auth] Users',
    props<{ currentUser: string; limit: number; offset: number }>(),
  ),
  fetchSuccess: createAction('[Auth] Users Success', props<{ data: any }>()),
  fetchFailure: createAction('[Auth] Users Failure', props<{ error: any }>()),
  fetchById: createAction('[Auth] User Details', props<{ id: string }>()),
  fetchByIdSuccess: createAction(
    '[Auth] User Details Success',
    props<{ data: any }>(),
  ),
  fetchByIdFailure: createAction(
    '[Auth] User Details Failure',
    props<{ error: any }>(),
  ),
};
