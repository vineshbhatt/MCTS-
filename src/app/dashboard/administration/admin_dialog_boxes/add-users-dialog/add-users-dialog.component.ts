import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialogRef, MatTableDataSource, MAT_DIALOG_DATA } from '@angular/material';
import { Observable } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import { FCTSDashBoard } from 'src/environments/environment';
import { DepFilterData, UsersData } from '../../administration.model';
import { AdministrationService } from 'src/app/dashboard/administration/services/administration.service';
import { ErrorHandlerFctsService } from 'src/app/dashboard/services/error-handler-fcts.service';
import { SelectionModel } from '@angular/cdk/collections';
import { multiLanguageTranslatorPipe } from 'src/assets/translator/index';
import { MatAutocompleteTrigger } from '@angular/material';

@Component({
  selector: 'app-add-users-dialog',
  templateUrl: './add-users-dialog.component.html',
  styleUrls: ['./add-users-dialog.component.scss']
})
export class AddUsersDialogComponent implements OnInit {
  basehref = FCTSDashBoard.BaseHref;
  filteredDepartments: Observable<DepFilterData[]>;
  selection = new SelectionModel<any>(true, []);
  filtersForm: FormGroup;
  usersList: UsersData[] = new Array();
  startRow = 1;
  loadStep = 100;
  action: string;
  selectedDepartment: string;
  dataSource: any;
  showSpinner = true;
  displayedColumns: string[] = ['CheckBox', 'Photo', 'Name', 'Email'];
  tableStructure = [
    { 'columnDef': 'CheckBox', 'columnName': '', 'className': 'check-box' },
    { 'columnDef': 'Photo', 'columnName': '', 'className': 'photo-wrapper' },
    { 'columnDef': 'Name', 'columnName': 'Name', 'className': '' },
    { 'columnDef': 'Email', 'columnName': 'Email', 'className': 'email-column' },
  ];

  @ViewChild('searchString') searchString: ElementRef;
  @ViewChild('depstring', { read: MatAutocompleteTrigger }) depstring: MatAutocompleteTrigger;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public _dialogRef: MatDialogRef<any>
    , private _administration: AdministrationService
    , private _formBuilder: FormBuilder
    , private _errorHandlerFctsService: ErrorHandlerFctsService
    , private translator: multiLanguageTranslatorPipe
  ) { }

  ngOnInit() {
    this.getAllUsers(1);

    this.filtersForm = this._formBuilder.group({
      SearchString: [],
      Department: []
    });


    this.filteredDepartments = this.filtersForm.get('Department').valueChanges
      .pipe(
        debounceTime(300),
        switchMap(value =>
          this._administration.getDepartmentsList(value)
        )
      );
  }

  getAllUsers(startRow: number): void {
    this.startRow = startRow;
    this.showSpinner = startRow === 1 ? true : false;
    this._administration.getAllUsers(this.collectSearchData(), startRow, startRow + this.loadStep)
      .subscribe(
        response => {
          this.usersList = this.usersList.concat(response);
          this.dataSource = new MatTableDataSource(this.usersList);
        },
        responseError => {
          this._errorHandlerFctsService.handleError(responseError).subscribe();
        },
        () => {
          this.showSpinner = false;
        }
      );
  }

  collectSearchData() {
    let searchParams = {
      action: this.action,
      section: this.data.section,
      itemID: this.data.itemID,
      searchString: this.action === 'search' ? this.searchString.nativeElement.value : '',
      department: this.action === 'search' && this.filtersForm.get('Department').value ?
        this.filtersForm.get('Department').value.OUID : -1
    };
    if (!searchParams.searchString && searchParams.department < 0) {
      searchParams.action = '';
      this.action = '';
    }
    return searchParams;
  }

  applyFilter() {
    this.action = 'search';
    this.usersList = new Array();
    this.selection.clear();
    this.getAllUsers(1);
  }

  onScrollDown() {
    this.startRow += this.loadStep;
    this.getAllUsers(this.startRow);
  }

  closeDialog(Arr: any[]): void {
    this._dialogRef.close(Arr);
  }

  // autocomplete display func
  displayFieldValue(fieldValue: DepFilterData) {
    if (fieldValue) { return this.translator.transform(fieldValue.Name_EN, fieldValue.Name_AR); }
  }

  getInitials(firstName: string, lastName: string) {
    return firstName.slice(0, 1).toUpperCase() + lastName.slice(0, 1).toUpperCase();
  }

  // Check-box functions
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.usersList.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.usersList.forEach(row => this.selection.select(row));
  }

  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  addUsers() {
    let usersArray = new Array();
    this.selection.selected.forEach(element => {
      usersArray.push(element.ID);
    });
    this.closeDialog(usersArray);
  }

  clearDepSearch(val: string) {
    if (!val) {
      this.applyFilter();
      this.depstring.closePanel();
    }
  }
}
