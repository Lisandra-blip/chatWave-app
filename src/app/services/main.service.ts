import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Injectable({
  providedIn: 'root'
})
export class MainService {
  private tableName = 'requisicoes';
  requisicoesRef: AngularFirestoreCollection<any>;

constructor(
  private firestore: AngularFirestore,
  private fireStorage: AngularFireStorage
  ) {
    this.requisicoesRef = firestore.collection(this.tableName);
  }


  async uploadImg(img: any, path: string): Promise<string | null> {
    try {
      const filePath = `${path}/${Date.now()}.jpg`
      const fileRef = this.fireStorage.ref(filePath);

      const response = await fetch(img);
      const blob = await response.blob();
      const task = this.fireStorage.upload(filePath, blob);

      const url = await task.then(() => fileRef.getDownloadURL().toPromise());

      return url;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

}
