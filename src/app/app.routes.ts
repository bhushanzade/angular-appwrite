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
        path: 'projects',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./pages/projects/projects.component').then(
                (m) => m.ProjectsComponent,
              ),
          },
          {
            path: 'new',
            loadComponent: () =>
              import(
                './pages/projects/add-edit-project/add-edit-project.component'
              ).then((m) => m.AddEditProjectComponent),
          },
          {
            path: 'edit/:id',
            loadComponent: () =>
              import(
                './pages/projects/add-edit-project/add-edit-project.component'
              ).then((m) => m.AddEditProjectComponent),
          },
        ],
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
      {
        path: 'chat/:userId',
        loadComponent: () =>
          import('./pages/chat-messages/chat-messages.component').then(
            (m) => m.ChatMessagesComponent,
          ),
      },
    ],
  },
];
