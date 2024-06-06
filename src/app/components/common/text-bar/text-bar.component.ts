import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import '@ionic/pwa-elements/loader'; // Import the PWA Elements loader

@Component({
  selector: 'app-text-bar',
  templateUrl: './text-bar.component.html',
  styleUrls: ['./text-bar.component.scss']
})
export class TextBarComponent implements OnInit {
  @Output() emitMensagem: EventEmitter<any> = new EventEmitter<any>();
  @Input() selectedImage: any | undefined;

  public messageText: string = '';
  toggled: boolean = false;

  ngOnInit() {
  }

  addEmoji(event: { emoji: { native: any; }; }) {
     this.messageText = `${this.messageText}${event.emoji.native}`;
  }

  async takePhoto() {
    try {
      const image = await Camera.getPhoto({
        quality: 100,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera,
      });

      this.selectedImage = image.webPath;

    } catch (error) {
      console.error(error);
    }
  }

async selectImage() {
  try {
  const image = await Camera.getPhoto({
    quality: 100,
    allowEditing: false,
    resultType: CameraResultType.DataUrl,
    source: CameraSource.Photos,
  });
  this.selectedImage = image.dataUrl;

  } catch (error) {
    console.error(error);
  }
}

enviarMensagem() {
  this.toggled = false;
  if (this.messageText || this.selectedImage) {
    const messageData = {
      message: this.messageText,
      image: this.selectedImage,
    };
    this.emitMensagem.emit(messageData);

    this.messageText = '';
    this.selectedImage = null;
  }
}
}
