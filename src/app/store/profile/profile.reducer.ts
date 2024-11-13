// src/app/store/auth.reducer.ts
import { createReducer, on } from '@ngrx/store';
import { ProfileActions } from './profile.action';

export interface ProfileState {
  user: any | null;
  error: any | null;
}

export const initialProfileState: ProfileState = {
  user: null,
  error: null,
};

export const profileReducer = createReducer(
  initialProfileState,
  on(ProfileActions.profileSuccess, (state, { data }) => ({
    ...state,
    user: data ?? null,
    error: null,
  })),
  on(ProfileActions.profileFailure, (state, { error }) => ({
    ...state,
    error,
  })),
  on(ProfileActions.updateProfileSuccess, (state, { data }) => ({
    ...state,
    user: data ?? null,
    error: null,
  })),
  on(ProfileActions.updateProfileFailure, (state, { error }) => ({
    ...state,
    error,
  })),
);
