import { createAction, props } from '@ngrx/store';

export const AuthActions = {
  login: createAction(
    '[Auth] Login',
    props<{ email: string; password: string }>(),
  ),
  googleLogin: createAction('[Auth] Google Login'),
  loginSuccess: createAction('[Auth] Login Success', props<{ data: any }>()),
  loginFailure: createAction('[Auth] Login Failure', props<{ error: any }>()),
  register: createAction(
    '[Auth] Register',
    props<{ name: string; email: string; password: string }>(),
  ),
  registerSuccess: createAction(
    '[Auth] Register Success',
    props<{ data: any }>(),
  ),

  registerFailure: createAction(
    '[Auth] Register Failure',
    props<{ error: any }>(),
  ),
  checkAuth: createAction('[Auth] Check Auth'),
  noAuth: createAction('[Auth] No Auth Set'),
  logout: createAction('[Auth] Logout'),
};
