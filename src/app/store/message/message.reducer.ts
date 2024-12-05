// src/app/store/auth.reducer.ts
import { createReducer, on } from '@ngrx/store';
import { MessageActions } from './message.action';

export interface MessageState {
  messages: {
    documents: any[];
    total: number;
  };
  error: any;
  loading: boolean;
}

export const initialMessageState: MessageState = {
  messages: {
    documents: [],
    total: 0,
  },
  error: null,
  loading: true,
};

export const messageReducer = createReducer(
  initialMessageState,
  on(MessageActions.fetchSuccess, (state, { data }) => ({
    ...state,
    messages: {
      documents: [...state.messages.documents, ...data.documents],
      total: state.messages.total + data.total,
    },
    error: null,
    loading: false,
  })),
  on(MessageActions.fetchFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),
  on(MessageActions.sendMessageSuccess, (state, { data }) => ({
    ...state,
    messages: {
      documents: state.messages.documents.find((msg) => msg.$id === data.$id)
        ? [...state.messages.documents]
        : [...state.messages.documents, data],
      total: state.messages.documents.find((msg) => msg.$id === data.$id)
        ? state.messages.total
        : state.messages.total + 1,
    },
    error: null,
    loading: false,
  })),
  on(MessageActions.sendMessageFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),
);
