import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { MaskitoOptions } from '@maskito/core';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile-action',
  templateUrl: './profile-action.component.html',
  styleUrls: ['./profile-action.component.scss']
})
export class ProfileActionComponent implements OnInit {
  formulario: FormGroup | any;
  selectedTags: any[] = [];
  selectedImage: any;
  presentingElement = null;
  profile: any = null;

  readonly apelidoMask: MaskitoOptions = {mask: Array(20).fill(/[\s\S]/)};

  constructor(
    private formBuilder: FormBuilder,
    private modalController: ModalController,
    private authService: AuthService,
    private userService: UserService,
    private router: Router) {
    this.formulario = this.formBuilder.group({
      apelido: ['', Validators.required]
      , tags: [Validators.required]
      , image: []
    });
  }

  async ngOnInit() {

    this.profile = await this.userService.getUserProfile();
    this.formulario.get('apelido').setValue(this.profile.apelido);
    this.formulario.get('image').setValue(this.profile.profileImg);

    this.selectedTags = this.profile.tags.map((tag: string) => {return { name: tag }});
  }

  async update() {
    this.formulario.value.image = this.selectedImage
    this.formulario.value.tags = this.selectedTags;
    if(this.formulario.valid){
      const chatroom = await this.authService.updateUser(this.formulario.value,);

      if(chatroom.dados){
        //this.presentToast(1)
        this.router.navigate(['profile', chatroom.dados]);
        this.dismissModal()
      } else {
        //this.presentToast(0)
      }
    }
  }

  dismissModal() {
    this.modalController.dismiss();
  }
}
