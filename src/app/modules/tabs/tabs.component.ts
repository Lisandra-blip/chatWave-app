import { Component, DoCheck } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { ChatroomActionComponent } from 'src/app/components/action/chatroom-action/chatroom-action.component';
import { ProfileActionComponent } from 'src/app/components/action/profile-action/profile-action.component';
import { AuthService } from 'src/app/services/auth.service';
import { ChatRoomService } from 'src/app/services/chatRoom.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.component.html'
})
export class TabsComponent implements DoCheck {

  isProfile: boolean = false;
  isInbox: boolean = false;

  constructor(
    private router: Router,
    private actionSheetCtrl: ActionSheetController,
    private authService: AuthService,
    private modalController: ModalController,
  ) {}

  ngDoCheck() {
    // ...
    const regexProfile = /\/(profile)/;
    this.isProfile =  regexProfile.test(this.router.url);

    const regexInbox = /\/(inbox)/;
    const regexAcess = /\/(acess)/;
    this.isInbox = regexInbox.test(this.router.url) || regexAcess.test(this.router.url);
  }


  isProfileRoute(): boolean {
    const regex = /\/(profile)/;
    return regex.test(this.router.url);
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetCtrl.create({
      buttons: [
        {
          text: 'Log out',
          role: 'destructive',
          handler: () => {
            this.realizalogOut();
          }
        },
        {
          text: 'Editar perfil',
          handler: () => {
            this.updateUser();
          }
        }
      ],
    });

    await actionSheet.present();
  }

  async realizalogOut(){
    try {
      const dados = await this.authService.logout();
      if(dados)
      this.router.navigateByUrl('/login', {replaceUrl: true})
    } catch(e) {
      console.log(e);
    }
  }

  async updateUser() {
    const modal = await this.modalController.create({
      component: ProfileActionComponent,
      presentingElement: await this.modalController.getTop(),
    });
    await modal.present();
  }

}
