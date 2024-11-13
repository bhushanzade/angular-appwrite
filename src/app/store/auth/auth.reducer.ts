// src/app/store/auth.reducer.ts
import { createReducer, on } from '@ngrx/store';
import { AuthActions } from './auth.action';
import { ProfileActions } from '../profile/profile.action';

export interface AuthState {
  user: any | null;
  token: string | null;
  role: any | null;
  error: any | null;
  loading: boolean;
}

export const initialAuthState: AuthState = {
  user: null,
  token: null,
  role: null,
  error: null,
  loading: true,
};

export const authReducer = createReducer(
  initialAuthState,
  on(AuthActions.loginSuccess, (state, { data }) => ({
    ...state,
    user: data?.user ?? null,
    token: data?.token ?? null,
    error: null,
    loading: false,
  })),
  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),
  on(AuthActions.noAuth, (state) => ({
    ...state,
    loading: false,
  })),
  on(AuthActions.registerSuccess, (state, { data }) => ({
    ...state,
    user: data?.user ?? null,
    token: data?.token ?? null,
    error: null,
    loading: false,
  })),
  on(AuthActions.registerFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),
  on(AuthActions.logout, (state) => ({
    ...state,
    token: null,
    role: null,
    user: null,
    error: null,
    loading: false,
  })),
  on(ProfileActions.updateProfileSuccess, (state, { data }) => ({
    ...state,
    user: {
      ...state.user,
      ...data,
    },
  })),
);
