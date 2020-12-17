import { NgModule } from '@angular/core';
import { AdministrationRoutingModule } from './administration-routing.module';
import { AdministrationComponent } from './administration.component';
import { MainPageComponent } from './main-page/main-page.component';
import { OrgmdRolesComponent } from './orgmd/orgmd-roles/orgmd-roles.component';
import { EditOrganizationalChartComponent } from './orgmd/edit-organizational-chart/edit-organizational-chart.component';
import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';
import { OrgmdRolesMainComponent } from './orgmd/orgmd-roles-main/orgmd-roles-main.component';
import { ORGMDMainComponent } from './orgmd/edit-org-chart-main/edit-org-chart-main.component';
import { AddUsersDialogComponent } from './admin-dialog-boxes/add-users-dialog/add-users-dialog.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { OrgmdChartComponent } from './shared-components/orgmd-chart/orgmd-chart.component';
import { SharedImportsModule } from '../shared-imports.module';
import { ClickStopPropagationDirective } from './directives/click-stop-propagation.directive';
import { AngularResizedEventModule } from 'angular-resize-event';
import { EditOrgChartDialogComponent } from './orgmd/edit-organizational-chart/edit-org-chart-dialog/edit-org-chart-dialog.component';
import { ConfirmationDialogComponent } from './admin-dialog-boxes/confirmation-dialog/confirmation-dialog.component';
import { BaseCurrentUsersComponent } from './base-classes/base-current-users/base-current-users.component';
import { OrgmdRoleUsersComponent } from './orgmd/orgmd-roles/orgmd-role-users/orgmd-role-users.component';
import { OrgChartUsersComponent } from './orgmd/edit-organizational-chart/org-chart-users/org-chart-users.component';
import { EditOrgChatUsersDialogComponent } from './orgmd/edit-organizational-chart/edit-org-chat-users-dialog/edit-org-chat-users-dialog.component';
import { EditOrgChartRolesComponent } from './orgmd/edit-organizational-chart/edit-org-chart-roles/edit-org-chart-roles.component';
import { EditOrgChartRolesDialogComponent } from './orgmd/edit-organizational-chart/edit-org-chart-roles-dialog/edit-org-chart-roles-dialog.component';
import { FctsSpecificRolesComponent } from './fcts-roles-setup/fcts-specific-roles/fcts-specific-roles.component';
import { FctsRolesSetupMainComponent } from './fcts-roles-setup/fcts-roles-setup-main/fcts-roles-setup-main.component';
import { FctsSpecificRolesUsersComponent } from './fcts-roles-setup/fcts-specific-roles/fcts-specific-roles-users/fcts-specific-roles-users.component';
import { FctsRolesAddUsersComponent } from './fcts-roles-setup/fcts-roles-add-users/fcts-roles-add-users.component';
import { FctsCommonRolesComponent } from './fcts-roles-setup/fcts-common-roles/fcts-common-roles.component';
import { FctsCommonRoleUsersComponent } from './fcts-roles-setup/fcts-common-roles/fcts-common-roles-users/fcts-common-roles-users.component';
import { EcmdMainComponent } from './ecmd/ecmd-main/ecmd-main.component';
import { EcmdRecordsManagementComponent } from './ecmd/ecmd-records-management/ecmd-records-management.component';
import { EcmdChartComponent } from './ecmd/ecmd-chart/ecmd-chart.component';
import { EditNodeDialogComponent } from './ecmd/edit-node-dialog/edit-node-dialog.component';
import { EditCounterpartDialogComponent } from './ecmd/edit-counterpart-dialog/edit-counterpart-dialog.component';
import { EditDepartmentDialogComponent } from './ecmd/edit-department-dialog/edit-department-dialog.component';
import { EditContactDialogComponent } from './ecmd/edit-contact-dialog/edit-contact-dialog.component';
import { OrgmdTeamManagementComponent } from './orgmd/orgmd-team-management/orgmd-team-management.component';
import { OrgmdTeamsChartComponent } from './orgmd/orgmd-team-management/orgmd-teams-chart/orgmd-teams-chart.component';
import { OrgmdAddTeamDialogComponent } from './orgmd/orgmd-team-management/orgmd-add-team-dialog/orgmd-add-team-dialog.component';
import { OrgmdTeamUsersComponent } from './orgmd/orgmd-team-management/orgmd-team-users/orgmd-team-users.component';
import { CreateDelegationComponent } from './delegation-management/create-delegation/create-delegation.component';
import { CurrentDelegationsComponent } from './delegation-management/current-delegations/current-delegations.component';
import { DelegationsReportComponent } from './delegation-management/delegations-report/delegations-report.component';


@NgModule({
  imports: [
    AdministrationRoutingModule,
    InfiniteScrollModule,
    SharedImportsModule,
    AngularResizedEventModule,
  ],
  declarations: [
    AdministrationComponent,
    MainPageComponent,
    OrgmdRolesComponent,
    EditOrganizationalChartComponent,
    BreadcrumbsComponent,
    OrgmdRolesMainComponent,
    ORGMDMainComponent,
    AddUsersDialogComponent,
    OrgmdChartComponent,
    ClickStopPropagationDirective,
    EditOrgChartDialogComponent,
    ConfirmationDialogComponent,
    BaseCurrentUsersComponent,
    OrgmdRoleUsersComponent,
    OrgChartUsersComponent,
    EditOrgChatUsersDialogComponent,
    EditOrgChartRolesComponent,
    EditOrgChartRolesDialogComponent,
    FctsSpecificRolesComponent,
    FctsRolesSetupMainComponent,
    FctsSpecificRolesUsersComponent,
    FctsRolesAddUsersComponent,
    FctsCommonRolesComponent,
    FctsCommonRoleUsersComponent,
    EcmdMainComponent,
    EcmdRecordsManagementComponent,
    EcmdChartComponent,
    EditNodeDialogComponent,
    EditCounterpartDialogComponent,
    EditDepartmentDialogComponent,
    EditContactDialogComponent,
    OrgmdTeamManagementComponent,
    OrgmdTeamsChartComponent,
    OrgmdAddTeamDialogComponent,
    OrgmdTeamUsersComponent,
    CreateDelegationComponent,
    CurrentDelegationsComponent,
    DelegationsReportComponent
  ],
  entryComponents: [
    AddUsersDialogComponent,
    EditOrgChartDialogComponent,
    ConfirmationDialogComponent,
    EditOrgChatUsersDialogComponent,
    EditOrgChartRolesDialogComponent,
    FctsRolesAddUsersComponent,
    EditNodeDialogComponent,
    EditCounterpartDialogComponent,
    EditDepartmentDialogComponent,
    EditContactDialogComponent,
    OrgmdAddTeamDialogComponent
  ]
})
export class AdministrationModule { }
