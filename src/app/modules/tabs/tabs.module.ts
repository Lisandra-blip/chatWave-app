import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { HomePage } from './home/home.page';
import { TabsComponent } from './tabs.component';
import { ProfileComponent } from './profile/profile.component';

import { MatIconModule } from '@angular/material/icon';

import { ComponentesModule } from 'src/app/components/components.module';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { ChatComponent } from './chat/chat.component';
import { ChatProfileComponent } from './chat/chat-profile/chat-profile.component';
import { ExploreComponent } from './explore/explore.component';
import { UserProfileComponent } from 'src/app/components/common/user-profile/user-profile.component';

const routes: Routes = [
  {
    path: '',
    component: TabsComponent,
    children: [
      {
        path: 'home',
        component: HomePage,
      },
      {
        path: 'explore',
        component: ExploreComponent,
      },
      {
        path: 'profile',
        component: ProfileComponent,
      },
      {
        path: 'inbox/:id',
        component: ChatComponent,
      },
      {
        path: 'acess/:id',
        component: ChatProfileComponent,
      }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),

    MatIconModule,
    MatTabsModule,
    MatChipsModule,
    MatDividerModule,
    MatSnackBarModule,

    ComponentesModule
  ],
  declarations: [TabsComponent, HomePage, ProfileComponent, ChatComponent, ChatProfileComponent, ExploreComponent, UserProfileComponent]
})
export class TabsModule {}
