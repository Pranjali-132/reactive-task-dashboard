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
  query,
  serverTimestamp
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
      q = query(taskRef, where('teamId', '==', currentUser.teamId));
    } else {
      q = query(taskRef, where('assignedTo', '==', currentUser.uid));
    }

    return collectionData(q, { idField: 'id' });
  }

  addTask(task: any, currentUser: any) {
    const taskRef = collection(this.firestore, 'tasks');

    return addDoc(taskRef, {
      ...task,

      assignedTo: task.assignedTo || currentUser.uid,
      assignedToName: task.assignedToName || currentUser.username,
      teamId: task.teamId || currentUser.teamId,
      createdBy: currentUser.uid,
      createdByName: currentUser.username,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  }


  deleteTask(id: string) {
    const taskDoc = doc(this.firestore, `tasks/${id}`);
    return deleteDoc(taskDoc);
  }

updateTask(id: string, task: any) {
  const taskDoc = doc(this.firestore, `tasks/${id}`);

  const { createdAt, updatedAt, ...rest } = task;

  return updateDoc(taskDoc, {
    ...rest,
    updatedAt: serverTimestamp()
  });
}

}
