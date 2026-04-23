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
    q = query(taskRef, where('teamId', '==', currentUser.teamId));
  } else {
    q = query(
      taskRef,
      where('assignedTo', '==', currentUser.uid) 
    );
  }
  console.log('Current User:', currentUser);
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
    createdAt: new Date(),
    updatedAt: new Date()
  });
}


  deleteTask(id: string) {
    const taskDoc = doc(this.firestore, `tasks/${id}`);
    return deleteDoc(taskDoc);
  }

updateTask(id: string, task: any) {
  const taskDoc = doc(this.firestore, `tasks/${id}`);
  return updateDoc(taskDoc, {
    ...task,
    updatedAt: new Date() 
  });
}

}
