import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdministrationRoutingModule } from './administration-routing.module';
import { AdministrationComponent } from './administration.component';
import { MainPageComponent } from './main-page/main-page.component';
import { OrgmdRolesComponent } from './orgmd/orgmd-roles/orgmd-roles.component';

import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule, MatFormFieldModule, MatCheckboxModule, MatIconModule } from '@angular/material';
import { multiLanguageTranslatorModule, multiLanguageTranslatorPipe } from 'src/assets/translator/index';
import { MatTableModule } from '@angular/material/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { EditOrganizationalChartComponent } from './orgmd/edit-organizational-chart/edit-organizational-chart.component';
import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';
import { CurrentUsersComponent } from './shared-components/current-users/current-users.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTooltipModule } from '@angular/material/tooltip';
import { OrgmdRolesMainComponent } from './orgmd/orgmd-roles-main/orgmd-roles-main.component';
import { EditOrgChartMainComponent } from './orgmd/edit-org-chart-main/edit-org-chart-main.component';
import { AddUsersDialogComponent } from './admin_dialog_boxes/add-users-dialog/add-users-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


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
    CurrentUsersComponent,
    OrgmdRolesMainComponent,
    EditOrgChartMainComponent,
    AddUsersDialogComponent
  ],
  entryComponents: [
    AddUsersDialogComponent,
  ],
  providers: [
    multiLanguageTranslatorPipe
  ]
})
export class AdministrationModule { }
