// src/app/store/auth.reducer.ts
import { createReducer, on } from '@ngrx/store';
import { ProjectActions } from './project.action';

export interface ProjectState {
  projects: {
    documents: any[];
    total: number;
  };
  project: any;
  error: any;
  loading: boolean;
}

export const initialProjectState: ProjectState = {
  projects: {
    documents: [],
    total: 0,
  },
  project: null,
  error: null,
  loading: true,
};

export const projectReducer = createReducer(
  initialProjectState,
  on(ProjectActions.resetProject, (state) => ({
    ...state,
    error: null,
    project: null,
    loading: false,
  })),
  on(ProjectActions.addProjectSuccess, (state, { data }) => ({
    ...state,
    error: null,
    project: null,
    loading: false,
  })),
  on(ProjectActions.addProjectFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),
  on(ProjectActions.fetchSuccess, (state, { data }) => ({
    ...state,
    projects: data,
    error: null,
    loading: false,
  })),
  on(ProjectActions.fetchFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),
  on(ProjectActions.fetchByIdSuccess, (state, { data }) => ({
    ...state,
    project: data,
    error: null,
    loading: false,
  })),
  on(ProjectActions.fetchByIdFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),
  on(ProjectActions.updateProjectSuccess, (state, { data }) => ({
    ...state,
    project: null,
    error: null,
    loading: false,
  })),
  on(ProjectActions.updateProjectFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),
  on(ProjectActions.deleteProjectSuccess, (state, { id }) => ({
    ...state,
    projects: {
      documents: state.projects.documents.filter(
        (project) => project.$id !== id,
      ),
      total: state.projects.total - 1,
    },
    project: null,
    error: null,
    loading: false,
  })),
  on(ProjectActions.updateProjectFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),
);
