import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { ChatRoomService } from 'src/app/services/chatRoom.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-chatroom-action',
  templateUrl: './chatroom-action.component.html',
  styleUrls: ['./chatroom-action.component.scss']
})
export class ChatroomActionComponent implements OnInit {
  formulario: FormGroup | any;
  idChatRoom: string | any = null;
  chatRoom: any;
  selectedTags: any[] = [];
  selectedImage: any;
  presentingElement = null;
  isLoading: boolean = false;

  public membrosGrupo: any[] | any;
  membersToDisable: string[] = [];

  alertButtons = [
    {
      text: 'Não',
      role: 'cancel',
    },
    {
      text: 'Sim',
      handler: () => {
        this.delete();
      }
    }
  ];


  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private chatRoomService: ChatRoomService,
    private modalController: ModalController,
    private userService: UserService
  ) {
    this.formulario = this.formBuilder.group({
      nome: ['', Validators.required]
      , tags: [Validators.required]
      , users: [[]]
      , privado: [0]
      , image: []
    });
  }

  ngOnInit() {

    if(this.idChatRoom) {
      this.chatRoomService.getGroupsById(this.idChatRoom).subscribe((group) => {
        this.chatRoom = group

        this.userService.getMembers(this.chatRoom.membros).then((usrs: any[]) => {
          this.membrosGrupo = usrs;
        })

        this.formulario.get('nome').setValue(group.nome)
        , this.selectedTags = group.tags.map((tag: string) => {return { name: tag }})
        , this.formulario.get('users').setValue(group.users ? group.users : [])
        , this.formulario.get('privado').setValue(group.privado)
        , this.formulario.get('image').setValue(group.profileImg)
      });
    }
  }

  async cadastro() {
    this.isLoading = true;
    this.formulario.value.image = this.selectedImage
    this.formulario.value.tags = this.selectedTags;

    if(this.formulario.valid){
      const chatroom = await this.chatRoomService.addChatRoom(this.formulario.value,);

      if(chatroom.dados){
        this.isLoading = false;
        this.dismissModal()
        this.router.navigate(['inbox', chatroom.dados]);
      } else {
        this.isLoading = false;
        console.log(chatroom.error)
      }
    }
  }

  async update() {
    this.isLoading = true;
    this.formulario.value.image = this.selectedImage
    this.formulario.value.tags = this.selectedTags;
    this.formulario.value.users = this.chatRoom.membros;

    if(this.formulario.valid){
      const chatroom = await this.chatRoomService.updateChatRoom(this.idChatRoom, this.formulario.value);

      if(chatroom.dados){
        this.isLoading = false;
        this.dismissModal()
      } else {
        this.isLoading = false;
      }
    }
  }

  async delete() {
    await this.chatRoomService.deleteChat(this.idChatRoom);

    this.isLoading = false;
    this.dismissModal()
    this.router.navigate(['profile']);
  }

  dismissModal() {
    this.modalController.dismiss();
  }

  // removeMember (event: any) {
  //   const value = (event.value || '').trim();

  //   if (this.membersToDisable.filter((member: any) => member == value).length > 0) {
  //     const index = this.membersToDisable.indexOf(value);
  //     if (index >= 0) {
  //       this.membersToDisable.splice(index, 1);
  //     }
  //   }
  //   else {
  //     this.membersToDisable.push(value);
  //   }

  // }

}
