import { Injectable, inject } from '@angular/core';
import { Firestore, addDoc, collection, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TeamService {

  firestore = inject(Firestore);

  getTeams(): Observable<any[]> {
    const teamRef = collection(this.firestore, 'teams');
    return collectionData(teamRef, { idField: 'id' });
  }

  addTeam(team: any) {
    const teamRef = collection(this.firestore, 'teams');
    return addDoc(teamRef, team);
  }
}
