import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ProfileState } from './profile.reducer';

const profileState = createFeatureSelector<ProfileState>('profile');

export const getProfile = createSelector(profileState, (state) => state);
export const getProfileUser = createSelector(
  profileState,
  (state) => state.user,
);
export const getProfileError = createSelector(
  profileState,
  (state) => state.error,
);
