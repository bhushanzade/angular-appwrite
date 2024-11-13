import { inject, Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  Firestore,
  getDocFromServer,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
  getCountFromServer,
  documentId,
} from '@angular/fire/firestore';
import {
  getDownloadURL,
  ref,
  Storage,
  uploadBytesResumable,
} from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { ICollection, ISnaphotCollection } from '../models/firebase';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  private firestore = inject(Firestore);
  private toastr = inject(ToastrService);
  private storage = inject(Storage);

  async addDocument(collectionPath: string, data: any) {
    const collectionRef = collection(this.firestore, collectionPath);
    const doc = await addDoc(collectionRef, data);
    return doc.id;
  }

  async addDocumentById(collectionPath: string, data: any) {
    const docRef = doc(this.firestore, collectionPath);
    await setDoc(docRef, data);
    return docRef.id;
  }

  async getDocument<T>(docPath: string): Promise<T | null> {
    const docReference = doc(this.firestore, docPath);
    const docSnap = await getDocFromServer(docReference);
    if (docSnap.exists()) {
      return { ...docSnap.data(), id: docSnap.id } as T;
    }
    return null;
  }

  async updateDocument(docPath: string, data: any): Promise<void> {
    const docRef = doc(this.firestore, docPath);
    await updateDoc(docRef, data);
    this.toastr.success('Updated successfully...!');
    return data;
  }

  private async deleteDocument(docPath: string): Promise<void> {
    const docRef = doc(this.firestore, docPath);
    await deleteDoc(docRef);
  }

  uploadFile(image: File, path: string) {
    const storageRef = ref(this.storage, path);
    const uploadTask = uploadBytesResumable(storageRef, image);
    return new Observable((observer) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          observer.next({ inProgress: true, progress });
        },
        (error) => {
          observer.error(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref)
            .then((downloadUrl) => {
              observer.next({ inProgress: false, downloadUrl });
              observer.complete();
            })
            .catch((error) => {
              observer.error(error);
            });
        },
      );
    });
  }

  async getCollection<T>(arg: ICollection): Promise<T[]> {
    const collectionRef = collection(this.firestore, arg.collectionPath);
    let q = query(collectionRef);
    arg.conditions?.forEach((condition) => {
      q = query(
        q,
        where(
          condition.field == '__name__' ? documentId() : condition.field,
          condition.operator,
          condition.value,
        ),
      );
    });
    if (arg.orderByField) {
      if (arg.orderByDirection) {
        q = query(
          q,
          orderBy(
            arg.orderByField == '__name__' ? documentId() : arg.orderByField,
            arg.orderByDirection,
          ),
        );
      } else {
        q = query(
          q,
          orderBy(
            arg.orderByField == '__name__' ? documentId() : arg.orderByField,
          ),
        );
      }
    }
    if (arg.limitCount && arg.limitCount > 0) {
      q = query(q, limit(arg.limitCount));
    }
    const docs = await getDocs(q);
    return docs.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as T);
  }

  getSnapshotCollections<T>(arg: ISnaphotCollection) {
    const collectionRef = collection(this.firestore, arg.collectionPath);
    let q = query(collectionRef);
    arg.conditions?.forEach((condition) => {
      q = query(q, where(condition.field, condition.operator, condition.value));
    });
    if (arg.orderByField) {
      if (arg.orderByDirection) {
        q = query(q, orderBy(arg.orderByField, arg.orderByDirection));
      } else {
        q = query(q, orderBy(arg.orderByField));
      }
    }
    if (arg.limitCount && arg.limitCount > 0) {
      q = query(q, limit(arg.limitCount));
    }
    return new Observable<T[]>((observer) => {
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const data: T[] = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...(doc.data() as T),
          }));
          observer.next(data);
        },
        (error) => {
          observer.error(error);
        },
      );
      return () => unsubscribe();
    });
  }

  async getCollectionCount(arg: ISnaphotCollection) {
    const collectionRef = collection(this.firestore, arg.collectionPath);
    let q = query(collectionRef);
    arg.conditions?.forEach((condition) => {
      if (condition.refPath) {
        const referenceDoc = doc(this.firestore, condition.refPath);
        q = query(q, where(condition.field, condition.operator, referenceDoc));
      } else {
        q = query(
          q,
          where(condition.field, condition.operator, condition.value),
        );
      }
    });
    const snapshot = await getCountFromServer(q);
    return snapshot.data().count ?? 0;
  }
}
