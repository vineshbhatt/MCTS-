import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AdministrationComponent } from './administration.component';
import { OrgmdRolesComponent } from './orgmd/orgmd-roles/orgmd-roles.component';

const routes: Routes = [
  {
    path: '',
    component: AdministrationComponent,
    children: [
      { path: 'orgmd-roles', component: OrgmdRolesComponent },
      /*     { path:'', component: ProductListComponent,  } */
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministrationRoutingModule { }
