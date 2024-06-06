import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { MaskitoOptions } from '@maskito/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  formulario: FormGroup | any;
  hide = true;
  readonly passwordMask: MaskitoOptions = {mask: Array(30).fill(/[\s\S]/)};

  constructor(
    private formBuilder: FormBuilder,
    protected auth: AuthService,
    private router: Router,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    this.formulario = this.formBuilder.group({
      email: ['', [Validators.email, Validators.required]]
      , password: ['', [Validators.required, Validators.minLength(6),Validators.maxLength(30)]]
    });
  }

  togglepassword() {
      this.hide = !this.hide;
  }

  async login() {
    if(this.formulario.valid){
      const user = await this.auth.signIn(this.formulario.value);
      await this.auth.getAuth();
      if(user.dados){
        this.router.navigate(['home']);
        this.presentToast(1)
        this.formulario.reset();
      } else {
        this.presentToast(0)
      }
    }
  }

  async presentToast(event : number) {
    const toast = await this.toastController.create({
      message: event ? 'Login efetuado com sucesso!' : 'Falha de login.',
      duration: 1500,
      position: 'top',
      color: event ? 'success' :'danger',
    });

    await toast.present();
  }

}
