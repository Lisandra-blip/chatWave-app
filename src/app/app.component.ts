import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { NotificationService } from './services/notification.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  deferredPrompt: any;
  idExibeInstallButton: boolean = false;
  idLogado: boolean = false;
  message: any;

  constructor(
    private notificationService: NotificationService
    , private auth: AngularFireAuth
  ) {
    this.auth.authState.subscribe(user => {
        this.idLogado = !!user;
    });

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      if (!this.appInstalado()) this.idExibeInstallButton = true;
    });
  }

  ngOnInit() {
    this.notificationService.obterPermissao();
    this.notificationService.receberMensagem();
    
    this.message = this.notificationService.mensagem;
  }

  appInstalado(): boolean {
    return (window.matchMedia('(display-mode: standalone)').matches) || (navigator as any).standalone;
  }

  installPWA() {
    this.idExibeInstallButton = false;
    this.deferredPrompt.prompt();
    this.deferredPrompt.userChoice.then((choiceResult: any) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      this.deferredPrompt = null;
    });
  }

}
