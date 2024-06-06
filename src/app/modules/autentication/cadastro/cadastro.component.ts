import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { MaskitoOptions } from '@maskito/core';
import { Observable, catchError, map, of } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { TagsService } from 'src/app/services/tags.service';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.scss']
})
export class CadastroComponent implements OnInit {
  formulario: FormGroup | any;
  tags: any[] | any;
  hide = true;
  selectedTags: any[] = [];
  selectedImage: any;

  isLoading: boolean = false;

  readonly passwordMask: MaskitoOptions = {mask: Array(30).fill(/[\s\S]/)};
  readonly apelidoMask: MaskitoOptions = {mask: Array(20).fill(/[\s\S]/)};

  constructor(
    private formBuilder: FormBuilder,
    protected auth: AuthService,
    private router: Router,
    private toastController: ToastController,
    private tagsService: TagsService,
  ) {
    this.tagsService.getTags().subscribe((tags: any[]) => {
      this.tags = tags;
    });
  }

  ngOnInit() {
    this.formulario = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
      , password: ['', [Validators.required, Validators.minLength(6),Validators.maxLength(30)]]
      , apelido: ['', Validators.required]
      , tags: []
      , image: []
    });
  }

  togglepassword() {
    this.hide = !this.hide;
  }

  async cadastro() {
    this.isLoading = true;

    this.formulario.value.image = this.selectedImage
    this.formulario.value.tags = this.selectedTags;
    if(this.formulario.valid){
      const user = await this.auth.signUp(this.formulario.value,);

      if(user.dados && !user.error){
        this.presentToast(1, user)
        this.isLoading = false;
        this.formulario.reset();
        this.router.navigate(['home']);
      } else {
        this.isLoading = false;
        this.presentToast(0, user);
      }
    }
    else {
      this.isLoading = false;
    }
  }

  async presentToast(event : number, user: any) {
    let message = 'Falha de cadastro.';

    if(user.error)
    message = user.error.code == 'auth/email-already-in-use' ? 'Usuario já cadastrado!' : user.error;

    const toast = await this.toastController.create({
      message: event ? 'Sucesso' : message,
      duration: 1500,
      position: 'top',
      color: event ? 'success' :'danger',
    });

    await toast.present();
  }

}
