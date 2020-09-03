import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdministrationRoutingModule } from './administration-routing.module';
import { AdministrationComponent } from './administration.component';
import { MainPageComponent } from './main-page/main-page.component';
import { OrgmdRolesComponent } from './orgmd/orgmd-roles/orgmd-roles.component';

import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material';
import { multiLanguageTranslatorModule, multiLanguageTranslatorPipe } from 'src/assets/translator/index';


@NgModule({
  imports: [
    CommonModule,
    AdministrationRoutingModule,
    MatExpansionModule,
    MatButtonModule,
    multiLanguageTranslatorModule.forRoot({
      defaultLang: 'en',
      storagePrefix: 'current-language'
    })
  ],
  declarations: [
    AdministrationComponent,
    MainPageComponent,
    OrgmdRolesComponent],
  entryComponents: [],
  providers: [
    multiLanguageTranslatorPipe
  ]
})
export class AdministrationModule { }
