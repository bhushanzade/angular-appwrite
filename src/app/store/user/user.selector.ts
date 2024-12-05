import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserState } from './user.reducer';

const userState = createFeatureSelector<UserState>('user');

export const getuserState = createSelector(userState, (state) => state);
export const getUsers = createSelector(userState, (state) => state.users);
export const getUser = createSelector(userState, (state) => state.user);
export const getUsersLoading = createSelector(
  userState,
  (state) => state.loading,
);
