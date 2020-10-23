import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AdministrationComponent } from './administration.component';
import { OrgmdRolesComponent } from './orgmd/orgmd-roles/orgmd-roles.component';
import { EditOrganizationalChartComponent } from './orgmd/edit-organizational-chart/edit-organizational-chart.component';
import { OrgmdRolesMainComponent } from './orgmd/orgmd-roles-main/orgmd-roles-main.component';
import { EditOrgChartMainComponent } from './orgmd/edit-org-chart-main/edit-org-chart-main.component';
import { MainPageComponent } from './main-page/main-page.component';
import { OrgmdRoleUsersComponent } from './orgmd/orgmd-roles/orgmd-role-users/orgmd-role-users.component';
import { OrgChartUsersComponent } from './orgmd/edit-organizational-chart/org-chart-users/org-chart-users.component';
import { EditOrgChartRolesComponent } from './orgmd/edit-organizational-chart/edit-org-chart-roles/edit-org-chart-roles.component';

const routes: Routes = [
  {
    path: '',
    component: AdministrationComponent,
    children: [
      {
        path: '',
        component: MainPageComponent,
      },
      {
        path: 'orgmd-roles',
        component: OrgmdRolesMainComponent,
        children: [
          { path: '', component: OrgmdRolesComponent },
          { path: 'role-users', component: OrgmdRoleUsersComponent }
        ]
      },
      {
        path: 'edit-org-chart',
        component: EditOrgChartMainComponent,
        children: [
          { path: '', component: EditOrganizationalChartComponent },
          { path: 'users', component: OrgChartUsersComponent },
          { path: 'unit-roles', component: EditOrgChartRolesComponent }
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
