import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { TagsComponent } from './common/tags/tags.component';
import { ChatroomActionComponent } from './action/chatroom-action/chatroom-action.component';

import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatRadioModule} from '@angular/material/radio';
import { CameraComponent } from './common/camera/camera.component';
import { GroupListComponent } from './common/group-list/group-list.component';
import { BackButtonComponent } from './common/back-button/back-button.component';
import { TextBarComponent } from './common/text-bar/text-bar.component';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ProfileActionComponent } from './action/profile-action/profile-action.component';
import { MaskitoModule } from '@maskito/angular';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    MatIconModule,
    MatTabsModule,
    MatChipsModule,
    MatIconModule,
    MatFormFieldModule,
    MatRadioModule,
    PickerModule,
    MatAutocompleteModule,
    MaskitoModule
  ],
  exports: [
    TagsComponent,
    ChatroomActionComponent,
    ProfileActionComponent,
    CameraComponent,
    GroupListComponent,
    BackButtonComponent,
    TextBarComponent
  ],
  declarations: [
    TagsComponent,
    ChatroomActionComponent,
    ProfileActionComponent,
    CameraComponent,
    GroupListComponent,
    BackButtonComponent,
    TextBarComponent
  ],
})
export class ComponentesModule {}
