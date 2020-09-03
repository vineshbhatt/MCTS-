import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material';


@NgModule({
  imports: [
    CommonModule,
    MatExpansionModule,
    MatButtonModule
  ],
  declarations: []
})
export class SharedImportsModule {

}
