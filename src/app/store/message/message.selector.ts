import { createFeatureSelector, createSelector } from '@ngrx/store';
import { MessageState } from './message.reducer';

const messageState = createFeatureSelector<MessageState>('message');

export const getMessageState = createSelector(messageState, (state) => state);
export const getMessages = createSelector(
  messageState,
  (state) => state.messages,
);
