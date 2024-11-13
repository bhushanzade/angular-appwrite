// src/app/store/auth.effects.ts
import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { FireAuthService } from '../../services/fireauth.service';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { AuthActions } from './auth.action';

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private fireauth = inject(FireAuthService);
  private router = inject(Router);

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      switchMap(({ email, password }) =>
        this.fireauth
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
        this.fireauth
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
        this.fireauth
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
          await this.fireauth.signOut();
          this.router.navigateByUrl('/');
          return AuthActions.logout();
        }),
      ),
    { dispatch: false },
  );

  checkAuth$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.checkAuth),
      mergeMap(() => {
        return this.fireauth.checkAuthState().pipe(
          mergeMap(async (user) => {
            const userData = await user;
            if (userData) {
              return AuthActions.loginSuccess({ data: userData });
            }
            return AuthActions.noAuth();
          }),
          catchError((error) => {
            return of(AuthActions.loginFailure({ error: error.message }));
          }),
        );
      }),
    ),
  );
}
