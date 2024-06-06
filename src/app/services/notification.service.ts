import { Injectable } from '@angular/core';
import { getAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';
import { BehaviorSubject } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  mensagem = new BehaviorSubject(null);

  constructor(
    private angularFireMessaging: AngularFireMessaging,
    private auth: AngularFireAuth,
    private firestore: AngularFirestore,
  ) {
    this.angularFireMessaging.messages.subscribe(
      (m: any) => {
        console.log(m);
        this.mensagem.next(m);
      });
  }

  obterPermissao() {
    this.angularFireMessaging.requestToken.subscribe((token) => {
      console.log('Token recebido');
      this.salvarToken(token);
    }, (error) => console.error(error));
  }

  salvarToken(token: string | null) {
    this.auth.authState.subscribe(user => {
      if (user) {
        this.firestore.collection('users').doc(user?.uid).update({ deviceToken: token });
      } else {
        console.error('Erro: Não há usuário autenticado');
      }
    });
  }

  receberMensagem() {
    this.angularFireMessaging.messages.subscribe((m: any) => this.mensagem.next(m));
  }

}
