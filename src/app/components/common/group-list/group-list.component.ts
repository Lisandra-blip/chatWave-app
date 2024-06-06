import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ChatRoomService } from 'src/app/services/chatRoom.service';
import { UserService } from 'src/app/services/user.service';
import { UserProfileComponent } from '../user-profile/user-profile.component';

@Component({
  selector: 'app-group-list',
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.scss']
})
export class GroupListComponent implements OnInit {
  @Input() list: any[] | any;
  @Input() chatId: string | any;

  public groupList: any[] | any;
  public chatData: any[] | any;

  constructor(
    private userService: UserService,
    private chatRoomService: ChatRoomService,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    if(this.chatId) {
      this.chatRoomService.getGroupsById(this.chatId).subscribe((group) => {
        this.chatData = group;
      });
    }
    this.userService.getMembers(this.list).then((usrs: any[]) => {
      this.groupList = usrs;
    })
  }

  async openModal(profileId: string) {
    const modal = await this.modalController.create({
      component: UserProfileComponent,
      componentProps: {
        profileId: profileId
      },
      presentingElement: await this.modalController.getTop(),
    });
    await modal.present();
  }

}
