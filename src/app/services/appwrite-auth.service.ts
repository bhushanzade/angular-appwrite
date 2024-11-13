import { inject, Injectable } from '@angular/core';
import { account, ID } from '../appwrite';
import { AppwriteDBService } from './appwrite-db.service';

@Injectable({
  providedIn: 'root',
})
export class AppWriteAuthService {
  private appwrite = inject(AppwriteDBService);

  async signUpWithEmailAndPassword(
    name: string,
    email: string,
    password: string,
  ): Promise<any> {
    const res = await account.create(ID.unique(), email, password, name);
    await this.appwrite.createDocument<any>(
      '67348e7f0030d5201c3a',
      {
        name,
        email,
        pic: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      res.$id,
    );
    return this.signInWithEmailAndPassword(email, password);
  }

  async signInWithEmailAndPassword(
    email: string,
    password: string,
  ): Promise<any> {
    await account.createEmailPasswordSession(email, password);
    const res = await account.get();
    console.log('res', res);
    return this.setUserWithToken(res);
  }

  async loginWithGoogle(): Promise<any> {
    return;
  }

  async signOut(): Promise<void> {
    return;
  }

  async sendPasswordResetEmail(email: string): Promise<void> {
    return;
  }

  async checkAuthState() {
    try {
      const res = await account.get();
      return this.setUserWithToken(res);
    } catch (error) {
      return null;
    }
  }

  private async setUserWithToken(user: any) {
    if (user) {
      const userDataPayload = {
        id: user?.$id,
        name: user?.name,
        email: user?.email,
        pic: user?.pic,
      };
      return userDataPayload;
    }
    return null;
  }
}
