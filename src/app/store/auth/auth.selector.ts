import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from './auth.reducer';

const authState = createFeatureSelector<AuthState>('auth');

export const getAuth = createSelector(authState, (state) => state);
export const getUser = createSelector(authState, (state) => state.user);
export const getIsAuthLoading = createSelector(
  authState,
  (state) => state.loading,
);
