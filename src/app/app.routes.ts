import { Routes } from '@angular/router';
import { AppLayoutComponent } from './layout/app-layout/app-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: AppLayoutComponent,
    children: [
      {
        path: 'users',
        loadComponent: () =>
          import('./pages/users/users.component').then((m) => m.UsersComponent),
      },
      {
        path: 'profile',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./pages/profile/profile.component').then(
                (m) => m.ProfileComponent,
              ),
          },
          {
            path: 'edit',
            loadComponent: () =>
              import(
                './pages/profile/profile-edit/profile-edit.component'
              ).then((m) => m.ProfileEditComponent),
          },
        ],
      },
    ],
  },
];
