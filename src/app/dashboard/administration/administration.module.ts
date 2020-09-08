import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdministrationRoutingModule } from './administration-routing.module';
import { AdministrationComponent } from './administration.component';
import { MainPageComponent } from './main-page/main-page.component';
import { OrgmdRolesComponent } from './orgmd/orgmd-roles/orgmd-roles.component';

import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule, MatFormFieldModule } from '@angular/material';
import { multiLanguageTranslatorModule, multiLanguageTranslatorPipe } from 'src/assets/translator/index';
import { MatTableModule } from '@angular/material/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { EditOrganizationalChartComponent } from './orgmd/edit-organizational-chart/edit-organizational-chart.component';


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
    multiLanguageTranslatorModule.forRoot({
      defaultLang: 'en',
      storagePrefix: 'current-language'
    })
  ],
  declarations: [
    AdministrationComponent,
    MainPageComponent,
    OrgmdRolesComponent,
    EditOrganizationalChartComponent],
  entryComponents: [],
  providers: [
    multiLanguageTranslatorPipe
  ]
})
export class AdministrationModule { }
