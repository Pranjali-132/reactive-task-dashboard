import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  collectionData,
  deleteDoc,
  doc,
  updateDoc,
  where,
  query
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Tasks {
    constructor(private firestore: Firestore) {}

getTasks(user: string): Observable<any[]> {
  
  const taskRef = collection(this.firestore, 'tasks');

  const q = query(taskRef, where('user', '==', user));

  return collectionData(q, { idField: 'id' });
}

  addTask(task: any) {
    const taskRef = collection(this.firestore, 'tasks');
    return addDoc(taskRef, task);
  }

  deleteTask(id: string) {
    const taskDoc = doc(this.firestore, `tasks/${id}`);
    return deleteDoc(taskDoc);
  }

  updateTask(id: string, task: any) {
    const taskDoc = doc(this.firestore, `tasks/${id}`);
    return updateDoc(taskDoc, task);
  }
}
