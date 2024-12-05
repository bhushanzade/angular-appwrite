// src/app/store/auth.reducer.ts
import { createReducer, on } from '@ngrx/store';
import { UserActions } from './user.action';

export interface UserState {
  users: {
    documents: any[];
    total: number;
    currentPage: number;
    limit: number;
    offset: number;
  };
  user: any;
  error: any;
  loading: boolean;
}

export const initialUserState: UserState = {
  users: {
    documents: [],
    total: 0,
    currentPage: 1,
    limit: 5,
    offset: 0,
  },
  user: null,
  error: null,
  loading: true,
};

export const userReducer = createReducer(
  initialUserState,
  on(UserActions.fetchSuccess, (state, { data }) => ({
    ...state,
    users: data,
    error: null,
    loading: false,
  })),
  on(UserActions.fetchFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),
  on(UserActions.fetchByIdSuccess, (state, { data }) => ({
    ...state,
    user: data,
    error: null,
    loading: false,
  })),
  on(UserActions.fetchByIdFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),
);
