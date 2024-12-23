import {
  ApplicationConfig,
  ErrorHandler,
  isDevMode,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { authReducer } from './store/auth/auth.reducer';
import { AuthEffects } from './store/auth/auth.effects';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { profileReducer } from './store/profile/profile.reducer';
import { ProfileEffects } from './store/profile/profile.effects';
import { provideToastr } from 'ngx-toastr';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AppwriteDBService } from './services/appwrite-db.service';
import { ProjectEffects } from './store/project/project.effects';
import { projectReducer } from './store/project/project.reducer';
import { ErrorHandlerService } from './error-handler.interceptor';
import { userReducer } from './store/user/user.reducer';
import { UserEffects } from './store/user/user.effects';
import { messageReducer } from './store/message/message.reducer';
import { MessageEffects } from './store/message/message.effects';

const firebase = {
  apiKey: 'AIzaSyBQZR-YX5josEPndm2pgSXIuH7RFM5ZlV8',
  authDomain: 'ekart-shop-3c020.firebaseapp.com',
  projectId: 'ekart-shop-3c020',
  storageBucket: 'ekart-shop-3c020.appspot.com',
  messagingSenderId: '748330461062',
  appId: '1:748330461062:web:94af9beb655f3810cd6e07',
  measurementId: 'G-NZ88GJ9KV8',
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    provideClientHydration(),
    provideStore({
      auth: authReducer,
      profile: profileReducer,
      project: projectReducer,
      user: userReducer,
      message: messageReducer,
    }),
    provideEffects([
      AuthEffects,
      ProfileEffects,
      ProjectEffects,
      UserEffects,
      MessageEffects,
    ]),
    provideFirestore(() => getFirestore()),
    provideFirebaseApp(() => initializeApp(firebase)),
    provideStorage(() => getStorage()),
    provideAuth(() => getAuth()),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
    provideToastr(),
    provideAnimations(),
    AppwriteDBService,
    { provide: ErrorHandler, useClass: ErrorHandlerService },
  ],
};
