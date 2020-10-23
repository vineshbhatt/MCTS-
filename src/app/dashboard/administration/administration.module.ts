import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdministrationRoutingModule } from './administration-routing.module';
import { AdministrationComponent } from './administration.component';
import { MainPageComponent } from './main-page/main-page.component';
import { OrgmdRolesComponent } from './orgmd/orgmd-roles/orgmd-roles.component';
import { MatSidenavModule } from '@angular/material/sidenav';

import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule, MatFormFieldModule, MatCheckboxModule, MatIconModule, MatTreeModule } from '@angular/material';
import { multiLanguageTranslatorModule, multiLanguageTranslatorPipe } from 'src/assets/translator/index';
import { MatTableModule } from '@angular/material/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { EditOrganizationalChartComponent } from './orgmd/edit-organizational-chart/edit-organizational-chart.component';
import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTooltipModule } from '@angular/material/tooltip';
import { OrgmdRolesMainComponent } from './orgmd/orgmd-roles-main/orgmd-roles-main.component';
import { EditOrgChartMainComponent } from './orgmd/edit-org-chart-main/edit-org-chart-main.component';
import { AddUsersDialogComponent } from './admin-dialog-boxes/add-users-dialog/add-users-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CdkTreeModule } from '@angular/cdk/tree';
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

@NgModule({
  imports: [
    CommonModule,
    AdministrationRoutingModule,
    MatExpansionModule,
    MatButtonModule,
    MatTableModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    NgxPaginationModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatTooltipModule,
    MatDialogModule,
    MatIconModule,
    InfiniteScrollModule,
    MatProgressSpinnerModule,
    MatTreeModule,
    CdkTreeModule,
    SharedImportsModule,
    MatSidenavModule,
    AngularResizedEventModule,
    multiLanguageTranslatorModule.forRoot({
      defaultLang: 'en',
      storagePrefix: 'current-language'
    })
  ],
  declarations: [
    AdministrationComponent,
    MainPageComponent,
    OrgmdRolesComponent,
    EditOrganizationalChartComponent,
    BreadcrumbsComponent,
    OrgmdRolesMainComponent,
    EditOrgChartMainComponent,
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
    /* EmployeeMapList, */
  ],
  entryComponents: [
    AddUsersDialogComponent,
    EditOrgChartDialogComponent,
    ConfirmationDialogComponent,
    EditOrgChatUsersDialogComponent,
    EditOrgChartRolesDialogComponent
  ],
  providers: [
    multiLanguageTranslatorPipe
  ]
})
export class AdministrationModule { }
