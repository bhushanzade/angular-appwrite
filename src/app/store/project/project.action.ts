import { createAction, props } from '@ngrx/store';

export const ProjectActions = {
  fetch: createAction(
    '[Auth] Projects',
    props<{ limit: number; offset: number }>(),
  ),
  fetchSuccess: createAction('[Auth] Projects Success', props<{ data: any }>()),
  fetchFailure: createAction(
    '[Auth] Projects Failure',
    props<{ error: any }>(),
  ),
  fetchById: createAction('[Auth] Project Details', props<{ id: string }>()),
  fetchByIdSuccess: createAction(
    '[Auth] Project Details Success',
    props<{ data: any }>(),
  ),
  fetchByIdFailure: createAction(
    '[Auth] Project Details Failure',
    props<{ error: any }>(),
  ),
  resetProject: createAction('[Auth] Add New Project'),
  addProject: createAction('[Auth] Add Project', props<{ data: any }>()),
  addProjectSuccess: createAction(
    '[Auth] Add Project Success',
    props<{ data: any }>(),
  ),
  addProjectFailure: createAction(
    '[Auth] Add Project Failure',
    props<{ error: any }>(),
  ),
  updateProject: createAction(
    '[Auth] Update Project',
    props<{ id: string; data: any }>(),
  ),
  updateProjectSuccess: createAction(
    '[Auth] Update Project Success',
    props<{ data: any }>(),
  ),
  updateProjectFailure: createAction(
    '[Auth] Update Project Failure',
    props<{ error: any }>(),
  ),
  deleteProject: createAction('[Auth] Delete Project', props<{ id: string }>()),
  deleteProjectSuccess: createAction(
    '[Auth] Delete Project Success',
    props<{ id: any }>(),
  ),
  deleteProjectFailure: createAction(
    '[Auth] Delete Project Failure',
    props<{ error: any }>(),
  ),
};
