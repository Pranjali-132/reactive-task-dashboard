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

  return addDoc(usersRef, {
    ...user,
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

    return userSnapshot.docs[0].data();
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
