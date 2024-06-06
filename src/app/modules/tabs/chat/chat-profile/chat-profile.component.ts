import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { ChatroomActionComponent } from 'src/app/components/action/chatroom-action/chatroom-action.component';
import { User } from 'src/app/interfaces/user';
import { ChatRoomService } from 'src/app/services/chatRoom.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-chat-profile',
  templateUrl: './chat-profile.component.html',
  styleUrls: ['./chat-profile.component.scss']
})
export class ChatProfileComponent implements OnInit {
  public profile: User | any;
  public groupId: string | any;
  public group: Observable<any> | any;

  constructor(
    private route: ActivatedRoute,
    private chatRoomService: ChatRoomService,
    private navCtrl: NavController,
    private modalController: ModalController,
    private userService: UserService,
    private router: Router
    ) {
    this.groupId = this.route.snapshot.params['id'];
    this.chatRoomService.getGroupsById(this.groupId).subscribe((group) => {

      this.group = group;
    });
  }

  async ngOnInit() {
    this.profile = await this.userService.getUserProfile();
  }

  goBack() {
    this.navCtrl.back();
  }

  async updateChatRoom() {
      const modal = await this.modalController.create({
        component: ChatroomActionComponent,
        componentProps: {
          idChatRoom: this.groupId,
        },
        presentingElement: await this.modalController.getTop(),
      });

    await modal.present();
  }


  async leaveChatRoom() {
    await this.chatRoomService.leaveGroup(this.groupId, this.profile.id);

    this.router.navigate(['profile']);
  }

}
