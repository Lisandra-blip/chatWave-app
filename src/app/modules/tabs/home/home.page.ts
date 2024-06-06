import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChatRoomService } from 'src/app/services/chatRoom.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  public conversations: any[] | any;

  constructor(
    private route: ActivatedRoute,
    private chatRoomService: ChatRoomService,
    private router: Router
  ) { }

  ngOnInit() {

    this.route.url.subscribe(async () => {
      this.chatRoomService.getChats().subscribe(res => {
        this.conversations = res;
      });
    })
  }

  public newChatRoom(chat: any) {
    this.router.navigate(['inbox', chat]);
  }

}
