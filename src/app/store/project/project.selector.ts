import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ProjectState } from './project.reducer';

const projectState = createFeatureSelector<ProjectState>('project');

export const getProjectState = createSelector(projectState, (state) => state);
export const getProjects = createSelector(
  projectState,
  (state) => state.projects,
);
export const getPorject = createSelector(
  projectState,
  (state) => state.project,
);
export const getProjectLoading = createSelector(
  projectState,
  (state) => state.loading,
);
