// src/app/store/auth.effects.ts
import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { AuthActions } from './auth.action';
import { AppWriteAuthService } from '../../services/appwrite-auth.service';

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private auth = inject(AppWriteAuthService);
  private router = inject(Router);

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      switchMap(({ email, password }) =>
        this.auth
          .signInWithEmailAndPassword(email, password)
          .then((res) => {
            return AuthActions.loginSuccess({ data: res });
          })
          .catch((error) => {
            return AuthActions.loginFailure({ error: error.message });
          }),
      ),
    ),
  );

  googleLogin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.googleLogin),
      switchMap(() =>
        this.auth
          .loginWithGoogle()
          .then((res) => {
            return AuthActions.loginSuccess({ data: res });
          })
          .catch((error) => {
            return AuthActions.loginFailure({ error: error.message });
          }),
      ),
    ),
  );

  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.register),
      switchMap(({ name, email, password }) =>
        this.auth
          .signUpWithEmailAndPassword(name, email, password)
          .then((res) => {
            return AuthActions.registerSuccess({ data: res });
          })
          .catch((error) => {
            return AuthActions.registerFailure({ error: error.message });
          }),
      ),
    ),
  );

  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logout),
        map(async () => {
          await this.auth.signOut();
          this.router.navigateByUrl('/');
          return AuthActions.logout();
        }),
      ),
    { dispatch: false },
  );

  checkAuth$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.checkAuth),
      mergeMap(async () => {
        const userData = await this.auth.checkAuthState();
        if (userData) {
          return AuthActions.loginSuccess({ data: userData });
        }
        return AuthActions.noAuth();
      }),
      catchError((error) => {
        return of(AuthActions.loginFailure({ error: error.message }));
      }),
    ),
  );
}
