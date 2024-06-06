import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { CadastroComponent } from './cadastro/cadastro.component';

import {MatIconModule} from '@angular/material/icon';
import {MatTabsModule} from '@angular/material/tabs';
import {MatChipsModule} from '@angular/material/chips';
import { ComponentesModule } from 'src/app/components/components.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MaskitoModule } from '@maskito/angular';

const routes: Routes = [
  {
    path: 'sign-in',
    component: LoginComponent,
  },
  {
    path: 'sign-up',
    component: CadastroComponent,
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'sign-in'
  }
]

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,

    MatIconModule,
    MatTabsModule,
    MatChipsModule,
    ComponentesModule,
    MatFormFieldModule,
    MatIconModule,
    MaskitoModule,

    RouterModule.forChild(routes)
  ],
  declarations: [LoginComponent, CadastroComponent]
})
export class AutenticationModule {}
