import { Injectable, signal, WritableSignal } from '@angular/core';
import {
  Auth,
  authState,
  createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  User,
  UserCredential,
} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { map } from 'rxjs';
import { FirestoreService } from './firestore.service';

@Injectable({
  providedIn: 'root',
})
export class FireAuthService {
  user: WritableSignal<any | null> = signal(null);

  constructor(
    private auth: Auth,
    private firestore: FirestoreService,
  ) {
    // this.checkAuthState();
  }

  async signUpWithEmailAndPassword(
    name: string,
    email: string,
    password: string,
  ): Promise<any> {
    const cred = await createUserWithEmailAndPassword(
      this.auth,
      email,
      password,
    );
    if (cred?.user) {
      this.firestore.addDocumentById('users/' + cred.user.uid, {
        uid: cred.user.uid,
        name,
        email,
        role: 'user',
        pic: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      return await this.setUserWithToken(cred.user, {
        name,
        email,
        pic: '',
      });
    }
    return cred;
  }

  async signInWithEmailAndPassword(
    email: string,
    password: string,
  ): Promise<any> {
    const res = await signInWithEmailAndPassword(this.auth, email, password);
    if (res?.user) {
      const userData = await this.firestore.getDocument(
        'users/' + res.user.uid,
      );
      return await this.setUserWithToken(res.user, userData);
    }
    return res;
  }

  async loginWithGoogle(): Promise<any> {
    const res = await signInWithPopup(this.auth, new GoogleAuthProvider());
    if (res?.user) {
      const userData = await this.firestore.getDocument(
        'users/' + res.user.uid,
      );
      if (!userData) {
        await this.firestore.addDocumentById('users/' + res.user.uid, {
          uid: res.user.uid,
          name: res.user.displayName,
          email: res.user.email,
          role: 'user',
          pic: res.user.photoURL,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
      return await this.setUserWithToken(res.user, userData);
    }
    return res;
  }

  async signOut(): Promise<void> {
    await this.auth.signOut();
    this.user.set(null);
  }

  async sendPasswordResetEmail(email: string): Promise<void> {
    // const user = await fetchSignInMethodsForEmail(this.auth, email);
    // console.log('user', user);
    // if (user.length === 0) {
    //   throw new Error('No user found with this email address.');
    // }
    return sendPasswordResetEmail(this.auth, email);
  }

  checkAuthState() {
    return authState(this.auth).pipe(
      map(async (user: User) => {
        if (!user) return null;
        const userData = await this.firestore.getDocument('users/' + user.uid);
        return await this.setUserWithToken(user, userData);
      }),
    );
  }

  private async setUserWithToken(user: User, userData: any): Promise<any> {
    if (user) {
      const userDataPayload = {
        id: user.uid,
        name: userData?.name ?? user.displayName,
        email: user.email,
        pic: userData?.pic ?? user.photoURL,
      };

      const auth = {
        user: userDataPayload,
        token: await user.getIdToken(),
      };
      this.user.set(userDataPayload);
      return auth;
    }
    return null;
  }
}
