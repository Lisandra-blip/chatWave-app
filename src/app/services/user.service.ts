import { Injectable } from '@angular/core';

import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from './auth.service';
import { User } from '../interfaces/user';
import * as firebase from 'firebase/compat';
import { arrayRemove, arrayUnion } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private authService: AuthService,
    private firestore: AngularFirestore) { }

  getUserProfile(): Promise<User> {
    return new Promise<User>((resolve, reject) => {

      this.firestore.collection('users').doc(this.authService.user.uid).valueChanges({ idField: 'id' })
        .subscribe((user: User | any) => {
          resolve(user);
        }, (error: any) => {
          reject(error);
        });
    });
  }

  getUserById(profileId: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this.firestore.collection('users').doc(profileId).valueChanges({ idField: 'id' })
        .subscribe((user: string | any) => {
          resolve(user);
        }, (error: any) => {
          reject(error);
        });
    });
  }

async getMembers(data: any[]) {
  let documents = []
  for (const userId of data) {
    const userRef = this.firestore.collection('users').doc(userId);
    const snapshot = await userRef.get().toPromise();
    if (snapshot?.exists) {
      const userData = { id: snapshot.id, ...(snapshot.data() as any) };
      documents.push(userData);
    }
  }
  return documents;
}

async ToggleConnection(profileId: string, action: boolean) {
  const collectionRef = this.firestore.firestore.collection('users').doc(this.authService.user.uid);
  collectionRef.update({
    conection: action ? arrayUnion(profileId) : arrayRemove(profileId),
    requests: arrayRemove(profileId)
  });

}

}


