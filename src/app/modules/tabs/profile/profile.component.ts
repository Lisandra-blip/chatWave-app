import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { ChatRoomService } from 'src/app/services/chatRoom.service';
import { ActionSheet, ActionSheetButtonStyle } from '@capacitor/action-sheet';
import { ChatroomActionComponent } from 'src/app/components/action/chatroom-action/chatroom-action.component';
import { ProfileActionComponent } from 'src/app/components/action/profile-action/profile-action.component';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  profile: any;
  selectedImage: any;
  public chatRooms: any[] | undefined;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private chatRoomService: ChatRoomService,
    private authService: AuthService,
    private router: Router,
    private modalController: ModalController
  ) { }

  async ngOnInit() {
    this.route.url.subscribe(async () => {
      this.profile = await this.userService.getUserProfile();

      if(this.profile) {
        this.chatRoomService.getChatRoomsByUserId().subscribe((chatRooms: any) => {
          this.chatRooms = chatRooms;
        })
      }
    })

  }

  async realizalogOut(){
    try {
      const dados = await this.authService.logout();
      if(dados)
      this.router.navigateByUrl('/login', {replaceUrl: true})
      //this.router.navigate(['/login']);
    } catch(e) {
      console.log(e);
    }
  }

  public getChatRoom(chat: any) {
    this.router.navigate(['inbox', chat]);
  }

  async openModal() {
    const modal = await this.modalController.create({
      component: ChatroomActionComponent,
      componentProps: {
        idChatRoom: null,
      },
      presentingElement: await this.modalController.getTop(),
    });
    await modal.present();
  }

}
