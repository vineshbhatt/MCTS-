import { Component, OnInit, ViewChild } from '@angular/core';
import { AdministrationService } from 'src/app/dashboard/administration/services/administration.service';
import { ErrorHandlerFctsService } from 'src/app/dashboard/services/error-handler-fcts.service';
import { MatTableDataSource, MatAccordion } from '@angular/material';
import { multiLanguageTranslator } from 'src/assets/translator/index';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-orgmd-roles',
  templateUrl: './orgmd-roles.component.html',
  styleUrls: ['./orgmd-roles.component.scss']

})
export class OrgmdRolesComponent implements OnInit {
  rolesList: any[]; // TODO make model
  filtersForm: FormGroup;
  // table structure
  dataSource: any;
  displayedColumns: string[] = ['name', 'description'];
  possibleAction = 'Add role';
  filterState = 'in';
  filter = {
    role: '',
    description: ''
  }

  @ViewChild(MatAccordion) accordion: MatAccordion;

  constructor(
    private _administration: AdministrationService
    , public translator: multiLanguageTranslator
    , private formBuilder: FormBuilder
    , private _errorHandlerFctsService: ErrorHandlerFctsService) { }

  ngOnInit() {
    this.getOrgmdRoles();

    this.filtersForm = this.formBuilder.group({
      Role: [],
      Description: []
    });
  }

  getOrgmdRoles(): void {
    this._administration.getOrgmdRoles().subscribe(
      response => {
        this.rolesList = response;
        this.dataSource = new MatTableDataSource(this.rolesList);
        console.log('this.rolesList', response, this.dataSource);
      },
      responseError => {
        this._errorHandlerFctsService.handleError(responseError).subscribe();
      }
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openFilter(): void {
    this.accordion.openAll();
  }


}
