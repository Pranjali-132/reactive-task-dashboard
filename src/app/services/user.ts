import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  collectionData,
  query,
  where,
  getDocs
} from '@angular/fire/firestore';
import { v4 as uuidv4 } from 'uuid'; 

@Injectable({
  providedIn: 'root'
})
export class UserService {
  firestore = inject(Firestore);

  // register new user
async registerUser(user: any) {
  const usersRef = collection(this.firestore, 'users');

  const normalizedUsername = user.username.toLowerCase();

  const q = query(usersRef, where('username', '==', normalizedUsername));
  const existingUsers = await getDocs(q);

  if (!existingUsers.empty) {
    throw new Error('Username already exists');
  }

  const uid = uuidv4(); // generate unique id

  return addDoc(usersRef, {
    ...user,
    uid,
    username: normalizedUsername,
    role: user.role || 'employee',
    teamId: user.teamId || 'team-1'
  });
}

  // login existing user
async loginUser(username: string) {
  const usersRef = collection(this.firestore, 'users');

  const q = query(usersRef, where('username', '==', username));
  const userSnapshot = await getDocs(q);

  if (userSnapshot.empty) {
    throw new Error('User not found');
  }

  const docSnap = userSnapshot.docs[0];

  // ✅ cast once
  const data = docSnap.data() as {
    uid?: string;
    name: string;
    username: string;
    role: string;
    teamId: string;
  };

  return {
    id: docSnap.id,
    uid: data.uid || docSnap.id,
    name: data.name,
    username: data.username,
    role: data.role,
    teamId: data.teamId
  };
}



  async getUserByUsername(username: string) {
  const usersRef = collection(this.firestore, 'users');
  const q = query(usersRef, where('username', '==', username));
  const snapshot = await getDocs(q);
  if (snapshot.empty) {
    throw new Error('User not found');
  }
  const docData = snapshot.docs[0].data();
  return {
    id: snapshot.docs[0].id,
    ...docData
  };
}
}
