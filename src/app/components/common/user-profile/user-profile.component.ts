import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { User } from 'src/app/interfaces/user';
import { ChatRoomService } from 'src/app/services/chatRoom.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  @Input() profileId!: any;

  profile: User | any;
  profileLogged: User | any;
  chatRooms: any[] | undefined;
  presentingElement = null;
  userProfile: boolean = false;

  constructor(
    private userService: UserService,
    private chatRoomService: ChatRoomService,
    private modalController: ModalController
  ) { }

  async ngOnInit() {
    this.profileLogged = await this.userService.getUserProfile();
      if(this.profileId) {
        this.profile = await this.userService.getUserById(this.profileId);

        this.userProfile = this.profileLogged.id !== this.profileId ? false : true;

        if(this.profile)
        this.chatRoomService.getChatRoomsByUserId().subscribe((chatRooms: any) => {
        this.chatRooms = chatRooms.filter((chat: any) => chat.privado === 0);
      })
    }
  }

  dismissModal() {
    this.modalController.dismiss();
  }

  isConection(id: string) {
    return this.profileLogged.conection.includes(id)
  }

}
