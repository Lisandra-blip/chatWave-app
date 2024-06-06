import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { ChatRoomService } from 'src/app/services/chatRoom.service';
import { UserService } from 'src/app/services/user.service';
import { IonContent, ModalController } from '@ionic/angular';
import { UserProfileComponent } from 'src/app/components/common/user-profile/user-profile.component';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  @ViewChild(IonContent, { static: false }) chatList: IonContent | any;

  public groupId: string | any;
  public mensagens: Observable<any[]> | any;
  public message: string = '';
  public group: Observable<any> | any;
  public profile: Observable<any> | any;
  public coresRemetentes: { [remetente: string]: string } = {};
  public canAcess = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private chatRoomService: ChatRoomService,
    private chatService: ChatService,

    private userService: UserService,
    private modalController: ModalController
  ) {

    this.route.url.subscribe(async () => {
      this.groupId = this.route.snapshot.params['id'];
      this.profile = await this.userService.getUserProfile();

        this.chatRoomService.getGroupsById(this.groupId).subscribe((group) => {
          this.group = group;
          this.canAcess = this.group.membros.includes(this.profile.id);

          this.chatService.getMensagensDoGrupo(this.groupId).subscribe((mensagens: any) => {
            this.mensagens = mensagens;
            this.scrollToBottom();
          })
        });
    });

  }

  ngOnInit() {
    this.scrollToBottom();
  }

  ngAfterViewChecked() { }

  enviarMensagem(event: any) {
    const mensagem: any = {
      remetente: this.profile.apelido,
      remetenteId: this.profile.id,
      conteudo: event.message,
      image: event.image,
      dataHora: Date.now()
    };
    this.chatService.sendMessage(this.groupId, mensagem);
    this.message = '';
  }

  onScroll(event: any) {
    if (this.chatList.scrollTop === 0) { // Checa se o usuário atingiu o topo
      this.chatService.loadMoreMessages(this.groupId).subscribe(moreMessages => {
        // Concatena as mensagens mais antigas no início do array existente
        this.mensagens = [...moreMessages, ...this.mensagens];
      });
    }
  }
  scrollToBottom() {
    setTimeout(() => {
      if (this.chatList)
        this.chatList.scrollToBottom(300);
    }, 0);
  }

  public acessChatRoom(chat: any) {
    this.router.navigate(['acess', chat]);
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

  becomeMember(groupId: string, profileId: string) {
    this.chatRoomService.becomeMember(groupId, profileId);
  }
}
