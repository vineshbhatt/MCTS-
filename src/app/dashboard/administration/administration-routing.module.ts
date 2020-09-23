import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AdministrationComponent } from './administration.component';
import { OrgmdRolesComponent } from './orgmd/orgmd-roles/orgmd-roles.component';
import { EditOrganizationalChartComponent } from './orgmd/edit-organizational-chart/edit-organizational-chart.component';
import { CurrentUsersComponent } from './shared-components/current-users/current-users.component';
import { OrgmdRolesMainComponent } from './orgmd/orgmd-roles-main/orgmd-roles-main.component';
import { EditOrgChartMainComponent } from './orgmd/edit-org-chart-main/edit-org-chart-main.component';
import { MainPageComponent } from './main-page/main-page.component';

const routes: Routes = [
  {
    path: '',
    component: AdministrationComponent,
    children: [
      {
        path: 'orgmd-roles',
        component: OrgmdRolesMainComponent,
        children: [
          { path: '', component: OrgmdRolesComponent },
          /*  { path: 'role-users/:id', component: CurrentUsersComponent, data: { userActions: 'roleUsersActions' } } */
          { path: 'role-users', component: CurrentUsersComponent, data: { userActions: 'orgmdRoleUsersActions', section: 'orgmdroles' } }
        ]
      },
      {
        path: 'edit-org-chart',
        component: EditOrgChartMainComponent,
        children: [
          { path: '', component: EditOrganizationalChartComponent },
          { path: 'chart-users/:id', component: CurrentUsersComponent }
        ]
      }
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
