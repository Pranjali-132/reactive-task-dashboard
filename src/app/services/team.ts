import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  addDoc,
  collection,
  collectionData,
  getDocs,
  query,
  where
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TeamService {

  firestore = inject(Firestore);

  // Get all teams
  getTeams(): Observable<any[]> {
    const teamRef = collection(this.firestore, 'teams');
    return collectionData(teamRef, { idField: 'id' });
  }

  // ✅ Add team (with duplicate prevention)
  async addTeam(team: any) {
    const teamRef = collection(this.firestore, 'teams');

    const normalizedName = team.name.trim().toLowerCase();

    // check if team already exists
    const q = query(teamRef, where('name', '==', normalizedName));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      // return existing team instead of creating duplicate
      return {
        id: snapshot.docs[0].id,
        ...snapshot.docs[0].data()
      };
    }

    // create new team
    const docRef = await addDoc(teamRef, {
      name: normalizedName
    });

    return {
      id: docRef.id,
      name: normalizedName
    };
  }
}
