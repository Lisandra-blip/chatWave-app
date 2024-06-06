import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, DocumentChangeAction, QueryFn } from '@angular/fire/compat/firestore';
import { MainService } from './main.service';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { debugErrorMap } from '@angular/fire/auth';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private fcmServerKey = 'BDaUMi-5cAIeF7qI83qC8DJosG4sxzXraqhaI2uc1l-BsdqWwruZSf2OkM9WJM1SGNpbKEYhQnJsJFPNlDDyVww'; // Substitua pela chave do servidor FCM
  private fcmUrl = 'https://fcm.googleapis.com/fcm/send';


  private batchSize = 20;
  private lastVisibleMessage: any = null;
  private moreMessagesAvailable: BehaviorSubject<boolean> = new BehaviorSubject(true);

  constructor(
    private firestore: AngularFirestore,
    private mainService: MainService,
    private http: HttpClient
  ) { }

  async sendMessage(chatId: string | undefined, mensagem: any) {
    try {
      const chatroom = this.firestore.collection('chatRooms').doc(chatId);
      await chatroom.update({ ultimaMensagemData: Date.now() });

      if (mensagem.image) {
        mensagem.image = await this.mainService.uploadImg(mensagem.image, `user-images/${mensagem.remetenteId}`);
      } else {
        mensagem.image = null;
      }

      await  chatroom.collection('mensagens').add(mensagem);

      return;
    } catch (error) {
      return {
        dados: null,
        error
      };
    }
  }



  // getMensagensDoGrupo(chatGroupId: string) {
  //   const queryFn: QueryFn = (ref) => ref.orderBy('dataHora', 'asc').limit(this.batchSize);
  //   const chatroomRef: AngularFirestoreDocument  = this.firestore.collection('chatRooms').doc(chatGroupId);
  //   // this.getNextBatch(this.batchSize, chatroomRef ).subscribe((tst: any) => {
  //   //   const teste = tst
  //   // })
  //   return chatroomRef.collection('mensagens', queryFn).valueChanges();
  // }

  getMensagensDoGrupo(chatGroupId: string): Observable<any> {
    const chatroomRef: AngularFirestoreDocument = this.firestore.collection('chatRooms').doc(chatGroupId);
    const queryFn: QueryFn = ref => ref.orderBy('dataHora', 'asc').limitToLast(this.batchSize);

    return chatroomRef.collection('mensagens', queryFn).snapshotChanges().pipe(
      map((actions: DocumentChangeAction<any>[]) => {
        const messages = actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
        if (messages.length > 0) {
          this.lastVisibleMessage = messages[messages.length - 1]; // Atualiza a última mensagem visível
          this.moreMessagesAvailable.next(messages.length === this.batchSize);
        } else {
          this.moreMessagesAvailable.next(false);
        }
        return messages;
      })
    );
  }

  loadMoreMessages(chatGroupId: string): Observable<any> {
    if (!this.moreMessagesAvailable.value) return new Observable(subscriber => subscriber.complete()); // Não há mais mensagens

    const chatroomRef: AngularFirestoreDocument = this.firestore.collection('chatRooms').doc(chatGroupId);
    const queryFn: QueryFn = ref => ref.orderBy('dataHora', 'asc').startAfter(this.lastVisibleMessage.dataHora).limit(this.batchSize);

    return chatroomRef.collection('mensagens', queryFn).snapshotChanges().pipe(
      map((actions: DocumentChangeAction<any>[]) => {
        const messages = actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
        if (messages.length > 0) {
          this.lastVisibleMessage = messages[messages.length - 1];
          this.moreMessagesAvailable.next(messages.length === this.batchSize);
        } else {
          this.moreMessagesAvailable.next(false);
        }
        return messages;
      })
    );
  }


}
