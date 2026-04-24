import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  where,
  getDocs
} from '@angular/fire/firestore';

import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  firestore = inject(Firestore);
  auth = inject(Auth);

async registerUser(user: any) {

  if (!user.email || !user.password) {
    throw new Error('Email and password required');
  }

  if (!user.username?.trim()) {
    throw new Error('Username required');
  }

  const normalizedUsername = user.username.trim().toLowerCase();

  // uniqueness check
  const usersRef = collection(this.firestore, 'users');
  const q = query(usersRef, where('username', '==', normalizedUsername));
  const existing = await getDocs(q);

  if (!existing.empty) {
    throw new Error('Username already exists');
  }

  // create auth user
  const cred = await createUserWithEmailAndPassword(
    this.auth,
    user.email,
    user.password
  );

  const uid = cred.user.uid;

  // create firestore profile
  await setDoc(doc(this.firestore, `users/${uid}`), {
    uid,
    name: user.name,
    username: normalizedUsername,
    email: user.email,
    role: 'employee',
    teamId: user.teamId || ''
  });

  return uid;
}

  async loginUser(email: string, password: string) {

    const cred = await signInWithEmailAndPassword(
      this.auth,
      email,
      password
    );

    const uid = cred.user.uid;

    const userSnap = await getDoc(doc(this.firestore, `users/${uid}`));

    if (!userSnap.exists()) {
      throw new Error('User profile not found');
    }

    return userSnap.data();
  }

  async getUserById(uid: string) {
    const snap = await getDoc(doc(this.firestore, `users/${uid}`));
    return snap.exists() ? snap.data() : null;
  }
}
