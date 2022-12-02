import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {
    path: 'selector',
    loadChildren: () => import('./paises/paises.module').then( m => m.PaisesModule)
  },
  {
    path: '**',
    redirectTo: 'selector'
  }
];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
