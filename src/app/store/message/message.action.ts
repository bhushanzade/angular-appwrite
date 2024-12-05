import { createAction, props } from '@ngrx/store';

export const MessageActions = {
  fetch: createAction('[Auth] Messages'),
  fetchRealtime: createAction('[Auth] Realtime Messages'),
  fetchSuccess: createAction('[Auth] Messages Success', props<{ data: any }>()),
  fetchFailure: createAction(
    '[Auth] Messages Failure',
    props<{ error: any }>(),
  ),
  sendMessage: createAction('[Auth] Send Message', props<{ data: any }>()),
  sendMessageSuccess: createAction(
    '[Auth] Send Message Success',
    props<{ data: any }>(),
  ),
  sendMessageFailure: createAction(
    '[Auth] Send Message Failure',
    props<{ error: any }>(),
  ),
};
