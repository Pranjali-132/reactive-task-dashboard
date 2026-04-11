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

getTasks(currentUser: any): Observable<any[]> {
  const taskRef = collection(this.firestore, 'tasks');

  let q;

  if (currentUser.role === 'admin') {
    // Admin → see all team tasks
    q = query(taskRef, where('teamId', '==', currentUser.teamId));
  } else {
    // Employee → see only own tasks
    q = query(taskRef, where('user', '==', currentUser.username));
  }

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
