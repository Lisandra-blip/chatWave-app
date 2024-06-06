import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { canActivate, redirectLoggedInTo, redirectUnauthorizedTo } from '@angular/fire/auth-guard';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login'])
const redirectUnauthorizedToHome = () => redirectLoggedInTo([''])

const routes: Routes = [
  {
    path: 'login',
    ...canActivate(redirectUnauthorizedToHome),
    loadChildren: () => import('./modules/autentication/autentication.module').then( m => m.AutenticationModule)
  },
  {
    path: '',
    ...canActivate(redirectUnauthorizedToLogin),
    loadChildren: () => import('./modules/tabs/tabs.module').then( m => m.TabsModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
