import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { getAuth } from 'firebase/auth';
import { MainService } from './main.service';
import { TagsService } from './tags.service';

//import { PushNotifications } from '@capacitor/push-notifications';

import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import firebase from 'firebase/compat/app';
import { Router } from '@angular/router';
import { NotificationService } from './notification.service';


export const FCM_TOKEN = 'push_notification_token';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public user: any;

constructor(
  private auth: AngularFireAuth,
  private firestore: AngularFirestore,
  private mainService: MainService,
  private tagsService: TagsService,
  private router: Router,
  private notificationService: NotificationService
  ) {
    this.user = getAuth().currentUser;
  }

  saveTokenToFirestore(token: string) {
    if (this.user) {
      this.firestore.collection('users').doc(this.user?.uid).update({ deviceToken: token });
    } else {
      console.error('Erro: Tentativa de salvar token sem usuário autenticado');
    }
  }

  getAuth() {
    const auth = getAuth();
    this.user = auth.currentUser;
    return this.user?.uid;
  }

  // CADASTRO
  async signUp({ email, password, apelido, tags, image }: { email: string; password: string; apelido: string; tags: any[]; image: any }): Promise<any> {
    try {
      const credential = await this.auth.createUserWithEmailAndPassword(email, password); // Criar usuário com email e senha
      const user = credential.user;

      if (user) {
        this.user = user;
        this.notificationService.obterPermissao();

        let profileImg = null;
        if (image) {
          profileImg = await this.mainService.uploadImg(image, `user-images/${user.uid}`);
        }

        await this.tagsService.addTags(tags);

        await this.firestore.collection('users').doc(user.uid).set({
          apelido: apelido,
          tags: tags.map(tag => tag.name),
          profileImg: profileImg,
          conection: []
        });

        return { dados: user.uid, error: null };
      }
    } catch (error) {
      return { dados: null, error };
    }
  }

  // LOGIN/CADASTRO GOOGLE
  async signUpWithGoogle() {
    try {
      const provider = new firebase.auth.GoogleAuthProvider();

      await this.auth.signInWithPopup(provider).then(async (result) => {
        const credential = result.credential //await this.auth.getRedirectResult();
        if (result.user) {
          this.user = result.user;
          if (result.additionalUserInfo?.isNewUser) {
            await this.createUserProfile(result.user);
          }

          this.notificationService.obterPermissao();

          this.router.navigate(['home']);
          return { success: true, user: result.user };
        } else {
          return { success: false };
        }
      });
      return;
    } catch (error) {
      console.error('Erro ao autenticar com Google no Firebase:', error);
      return { success: false, error };
    }
  }

  private async createUserProfile(user: any) {
    await this.firestore.collection('users').doc(user.uid).set({
      apelido: user.displayName,
      profileImg: user.photoURL,
    });
  }

  // LOGIN
  async signIn({ email, password }: { email: string, password: string }) {
    try{
      const response = await this.auth.signInWithEmailAndPassword(email, password);
      this.user = response.user;
      this.notificationService.obterPermissao();

      return { dados: response, error: null }
    } catch(error){
      return {
        dados: null,
        error
      }
    }
  }

  async logout() {
    try {
      await this.auth.signOut();
      this.user = null;
      return true;
    } catch(e) {
      throw(e);
    }
  }

  async updateUser({ apelido, tags, image }:{ apelido: string, tags: any[], image: any}): Promise<any> {
    try{
      const userId = this.getAuth();
      const docRef = this.firestore.collection('users').doc(userId);
      const doc = await docRef.get().toPromise();

      if(doc) {
        let profileImg = null;

        if(image) {
          profileImg = await this.mainService.uploadImg(image, `user-images/${userId}`)
          docRef.update({profileImg: profileImg})
        }

        await this.tagsService.addTags(tags);

        const newUser = docRef.update({
          apelido: apelido
          , tags: tags.map(tag => tag.name)
        });

        return {dados : newUser}
      }
      else {
        return {dados: null}
      }
    } catch(error){
      return {dados: null, error}
    }
  }

}
