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
    username: normalizedUsername
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
}
