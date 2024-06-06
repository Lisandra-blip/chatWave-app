import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, QueryFn } from '@angular/fire/compat/firestore';
import { BehaviorSubject, Observable, combineLatest, map, mergeMapTo, switchMap, take, tap } from 'rxjs';
import { AuthService } from './auth.service';
import { MainService } from './main.service';
import firebase from 'firebase/compat/app';
import { TagsService } from './tags.service';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';

@Injectable({
  providedIn: 'root'
})
export class ChatRoomService {
  batchSize = 10;
  lastChatroomId: any;


  private chatMessagesSubject = new BehaviorSubject<any[]>([]);
  public chatMessages$ = this.chatMessagesSubject.asObservable();

  constructor(
    private authService: AuthService,
    private firestore: AngularFirestore,
    private mainService: MainService,
    private tagsService: TagsService,
  ) { }

  getChatRoomsByUserId(): Observable<any[]> {
    const queryFn: QueryFn = (ref) => ref.where('membros', 'array-contains', this.authService.user.uid)
    return this.firestore.collection('chatRooms', queryFn).valueChanges({ idField: 'id' });
  }

  async addChatRoom({ nome, privado, users, tags, image }:{ nome: string; privado: boolean, users: any[], tags: any[], image: any}) {
    try {
      let profileImg = null;
      let id;
      if(image)
        profileImg = await this.mainService.uploadImg(image, 'chatRoom-img')
        await this.tagsService.addTags(tags);

      users.push(this.authService.user.uid);
      const novoDocumento = {
        nome: nome,
        privado: privado,
        profileImg: profileImg,
        admin: this.authService.user.uid,
        membros: users,
        tags: tags.map(tag => tag.name)

      };

      const docRef = await this.firestore.collection('chatRooms').add(novoDocumento);

      return {dados: docRef.id };
    } catch(error){
      return {
        dados: null
        , error
      }
    }
  }

  async updateChatRoom(chatId: string, { nome, privado, users, tags, image }:{ nome: string, privado: boolean, users: any[], tags: any[], image: any}): Promise<any> {
      try{
        const docRef = this.firestore.collection('chatRooms').doc(chatId);
        const doc = await docRef.get().toPromise();

        if (doc) {
          const ChatRoomAntigo: any = doc.data();

          let profileImg = null;
          if(image) {
            profileImg = await this.mainService.uploadImg(image, `chatRoom-img/${chatId}`)
            docRef.update({profileImg: profileImg})
          }
          await this.tagsService.addTags(tags);

          const newUser = docRef.update({
            nome: nome,
            privado: privado,
            profileImg: profileImg,
            admin: this.authService.user.uid,
            membros: users,
            tags: tags.map(tag => tag.name)
          });

          return {dados : newUser}

        } else {
          return
        }
      } catch(error){
        return {
          dados: null
          , error
        }
      }
    }

    deleteChat(chatId: string): Promise<void> {
      return this.firestore.collection('chatRooms').doc(chatId).delete();
    }

    getChats(): Observable<any> {
      const queryFn: QueryFn = (ref) => ref.where('membros', 'array-contains', this.authService.user.uid).orderBy('ultimaMensagemData', 'desc');

      return this.firestore.collection('chatRooms', queryFn).snapshotChanges()
        .pipe(
          switchMap((chatRoomsSnapshot: any) => {
            const chatRoomObservables = chatRoomsSnapshot.map((chatRoomSnapshot: any) => {
              const chatRoomData = chatRoomSnapshot.payload.doc.data();
              const chatRoomId = chatRoomSnapshot.payload.doc.id;

              const mensagensRef = this.firestore.collection('chatRooms').doc(chatRoomId).collection('mensagens', (ref) => ref.orderBy('dataHora', 'desc').limit(1)).snapshotChanges();
              return mensagensRef
                .pipe(map((mensagensSnapshot) => {
                    const mensagens = mensagensSnapshot.map((mensagemDoc: any) => mensagemDoc.payload.doc.data());
                    const ultimaMensagem = mensagens[0];
                    return {
                      id: chatRoomId,
                      ...chatRoomData,
                      ultimaMensagem: ultimaMensagem,
                    };
                  })
                );
            });
            return combineLatest(chatRoomObservables);
          })
        );
    }

    getGroupsById(groupId: any): Observable<any> {
      return this.firestore.collection('chatRooms').doc(groupId).valueChanges({ idField: 'id' });
    }

    becomeMember(groupId: string, profileId: string){
      try {
        this.firestore.collection('chatRooms').doc(groupId).update({
          membros: firebase.firestore.FieldValue.arrayUnion(profileId)
        })
        return

      } catch(error){
        return {
          dados: null
          , error
        }
      }
    }


    leaveGroup(chatId: string, user: string): Promise<void> {
      return this.firestore.collection('chatRooms').doc(chatId).update({
        membros: firebase.firestore.FieldValue.arrayRemove(user)
      }).catch((error) => {
        console.error('Erro ao sair do grupo', error);
      });
    }

}
