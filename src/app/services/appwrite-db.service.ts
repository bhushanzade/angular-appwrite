import { inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { databases, ID } from '../appwrite';

export class AppwriteDBService {
  private toastr = inject(ToastrService);
  private databaseId = '6734742a00046f81f905';

  async getCollection(collectionId: string): Promise<any> {
    const res = await databases.listDocuments(this.databaseId, collectionId);
    return res;
  }

  async getDocument<T>(collectionId: string, docId: string): Promise<T | null> {
    const res = await databases.getDocument(
      this.databaseId,
      collectionId,
      docId,
    );
    if (res) {
      return { ...res, id: res.$id } as T;
    }
    return null;
  }

  async createDocument<T>(
    collectionId: string,
    data: any,
    id?: string,
  ): Promise<T | null> {
    const res = await databases.createDocument(
      this.databaseId,
      collectionId,
      id ?? ID.unique(),
      data,
    );
    if (res) {
      return { ...res, id: res.$id } as T;
    }
    return null;
  }

  async updateDocument<T>(
    collectionId: string,
    docId: string,
    data: any,
  ): Promise<T | null> {
    try {
      const res = await databases.updateDocument(
        this.databaseId,
        collectionId,
        docId,
        data,
      );
      if (res) {
        this.toastr.success('Updated successfully...!');
        return { ...res, id: res.$id } as T;
      }
      return null;
    } catch (error: any) {
      this.toastr.error(error.message);
      throw error;
    }
  }

  deleteDocument(collectionId: string, docId: string): Promise<string | null> {
    return new Promise(async (resolve, reject) => {
      try {
        console.log('docId', docId);

        const res = await databases.deleteDocument(
          this.databaseId,
          collectionId,
          docId,
        );
        if (res) {
          this.toastr.success('Deleted successfully...!');
          return resolve(docId);
        }
        return null;
      } catch (error: any) {
        console.log('error', error);
        this.toastr.error(error.message);
        reject(error);
      }
    });
  }
}
