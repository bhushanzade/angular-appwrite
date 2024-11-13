// src/app/store/auth.effects.ts
import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { switchMap } from 'rxjs/operators';
import { ProjectActions } from './project.action';
import { AppwriteDBService } from '../../services/appwrite-db.service';
import { Router } from '@angular/router';

@Injectable()
export class ProjectEffects {
  private actions$ = inject(Actions);
  private appwrite = inject(AppwriteDBService);
  private router = inject(Router);

  fetch$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProjectActions.fetch),
      switchMap(() =>
        this.appwrite
          .getCollection('projects')
          .then((res) => {
            return ProjectActions.fetchSuccess({ data: res });
          })
          .catch((error) => {
            return ProjectActions.fetchFailure({ error: error.message });
          }),
      ),
    ),
  );

  fetchById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProjectActions.fetchById),
      switchMap(({ id }) =>
        this.appwrite
          .getDocument('projects', id)
          .then((res) => {
            return ProjectActions.fetchByIdSuccess({ data: res });
          })
          .catch((error) => {
            return ProjectActions.fetchByIdFailure({ error: error.message });
          }),
      ),
    ),
  );

  add$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProjectActions.addProject),
      switchMap(({ data }) =>
        this.appwrite
          .createDocument('projects', data)
          .then((res) => {
            this.router.navigateByUrl('/projects');
            return ProjectActions.addProjectSuccess({ data: res });
          })
          .catch((error) => {
            return ProjectActions.addProjectFailure({ error: error.message });
          }),
      ),
    ),
  );

  update$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProjectActions.updateProject),
      switchMap(({ id, data }) =>
        this.appwrite
          .updateDocument('projects', id, data)
          .then((res) => {
            this.router.navigateByUrl('/projects');
            return ProjectActions.updateProjectSuccess({ data: res });
          })
          .catch((error) => {
            return ProjectActions.updateProjectFailure({
              error: error.message,
            });
          }),
      ),
    ),
  );

  delete$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProjectActions.deleteProject),
      switchMap(({ id }) =>
        this.appwrite
          .deleteDocument('projects', id)
          .then((res) => {
            return ProjectActions.deleteProjectSuccess({ id });
          })
          .catch((error) => {
            return ProjectActions.deleteProjectFailure({
              error: error.message,
            });
          }),
      ),
    ),
  );
}
