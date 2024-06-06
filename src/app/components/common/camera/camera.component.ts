import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import '@ionic/pwa-elements/loader'; // Import the PWA Elements loader

@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.scss'],
})
export class CameraComponent {
  @Output() selectedImageChange = new EventEmitter<any>();

  @Input() selectedImage: any | null;
  @Input() existingImg: any | null;


  ngOnChanges(changes: SimpleChanges) {
    if (changes['existingImg']) {
      // const valorAntigo = changes['meuInput'].previousValue;
      if(this.existingImg) {
        this.selectedImage = this.existingImg
      }
    }
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

      this.selectedImageChange.emit(image.webPath);

    } catch (error) {
      console.error(error);
    }
  }
}
