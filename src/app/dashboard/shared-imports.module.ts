import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployeeMapList } from '../dashboard/pipes/employeemaplist.pipe';
import { MatMenuModule } from '@angular/material/menu';


@NgModule({
  imports: [
    MatMenuModule
  ],
  declarations: [
    EmployeeMapList
  ],
  exports: [
    EmployeeMapList,
    MatMenuModule
  ]
})
export class SharedImportsModule {

}
