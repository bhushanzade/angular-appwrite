import { inject, Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { databases, ID, storage } from '../appwrite';
import { Query } from 'appwrite';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AppwriteDBService {
  private toastr = inject(ToastrService);
  private databaseId = environment.appWrite.databaseId;

  public staticPhoto =
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80';

  async getCollection(
    collectionId: string,
    limit?: number,
    offset?: number,
    conditions: any[] = [],
  ): Promise<any> {
    const res = await (() => {
      if (typeof limit == 'number' && typeof offset == 'number') {
        return databases.listDocuments(this.databaseId, collectionId, [
          ...conditions,
          Query.limit(limit ?? 10),
          Query.offset(offset),
        ]);
      }
      return databases.listDocuments(this.databaseId, collectionId);
    })();
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
        this.toastr.error(error.message);
        reject(error);
      }
    });
  }

  async uploadFile(file: File, storageId: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await storage.createFile(storageId, 'unique()', file);
        if (response) {
          this.toastr.success('Uploaded successfully...!');
          return resolve(response);
        }
        return resolve(null);
      } catch (error: any) {
        this.toastr.error(error.message);
        reject(error);
      }
    });
  }

  async getFile(fileId: string, storageId: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await storage.getFilePreview(storageId, fileId);
        console.log('response', response);
        if (response) {
          return resolve(response);
        }
        return resolve(null);
      } catch (error: any) {
        this.toastr.error(error.message);
        reject(error);
      }
    });
  }

  getFileUrl(fileId: string, storageId: string): string {
    const url = new URL(environment.appWrite.endpoint);
    url.pathname = `/v1/storage/buckets/${storageId}/files/${fileId}/preview`;
    url.searchParams.set('project', environment.appWrite.projectId);
    return url.href;
  }
}
