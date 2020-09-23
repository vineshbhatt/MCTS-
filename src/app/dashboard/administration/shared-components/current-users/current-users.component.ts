import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AdministrationService } from 'src/app/dashboard/administration/services/administration.service';
import { ErrorHandlerFctsService } from 'src/app/dashboard/services/error-handler-fcts.service';
import { MatAccordion } from '@angular/material';
import { FCTSDashBoard } from 'src/environments/environment';
import { SelectionModel } from '@angular/cdk/collections';
import { Observable, Subject, Subscription } from 'rxjs';
import { debounceTime, switchMap, takeUntil } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { DepFilterData, UsersData, PaginationParameters, DialogDirection } from '../../administration.model';
import { MatDialog } from '@angular/material';
import { AddUsersDialogComponent } from '../../admin_dialog_boxes/add-users-dialog/add-users-dialog.component';
import { multiLanguageTranslator, multiLanguageTranslatorPipe } from 'src/assets/translator/index';


@Component({
  selector: 'app-current-users',
  templateUrl: './current-users.component.html',
  styleUrls: ['./current-users.component.scss']
})
export class CurrentUsersComponent implements OnInit {
  // main data
  basehref = FCTSDashBoard.BaseHref;
  itemName: string;
  itemID: string;
  action = '';
  possibleAction = 'assign';
  usersList: UsersData[];
  routeDataEvent: Subscription;
  routeData: any;
  // filter data
  filtersForm: FormGroup;
  filterState = false;
  filteredDepartments: Observable<DepFilterData[]>;
  // pagination data
  pagenumber = 1;
  itemsPerPage: number = FCTSDashBoard.DefaultPageSize;
  totalCount: number;
  // table structure
  lang: string = this.translatorService.lang.toUpperCase();
  selection: any;
  displayedColumns: string[] = ['checkBox', 'photo', 'FirstName_' + this.lang, 'LastName_' + this.lang, 'NameLogin', 'DepartmentName_' + this.lang, 'actionButtons'];
  tableStructure = [
    { 'columnDef': 'checkBox', 'columnName': '', 'className': 'check-box' },
    { 'columnDef': 'photo', 'columnName': '', 'className': 'photo-wrapper' },
    { 'columnDef': 'FirstName_' + this.lang, 'columnName': 'name', 'className': '' },
    { 'columnDef': 'LastName_' + this.lang, 'columnName': 'surname', 'className': '' },
    { 'columnDef': 'NameLogin', 'columnName': 'login', 'className': '' },
    { 'columnDef': 'DepartmentName_' + this.lang, 'columnName': 'department', 'className': '' },
    { 'columnDef': 'actionButtons', 'columnName': '', 'className': 'single-action-button' }
  ];

  @ViewChild(MatAccordion) accordion: MatAccordion;
  @ViewChild('searchString') searchString: ElementRef;

  constructor(
    private _administration: AdministrationService
    , private formBuilder: FormBuilder
    , private _errorHandlerFctsService: ErrorHandlerFctsService
    , private _route: ActivatedRoute
    , public dialogU: MatDialog
    , private translator: multiLanguageTranslatorPipe
    , private translatorService: multiLanguageTranslator) {
  }

  ngOnInit() {
    this.itemID = this._route.snapshot.queryParamMap.get('ID');
    this.itemName = this._route.snapshot.queryParamMap.get('ItemName');
    this.routeDataEvent = this._route.data
      .subscribe(data => {
        this.routeData = data;
        this.getPage(this.pagenumber);
      });

    this.breadcrumbsSubscription();

    this.filtersForm = this.formBuilder.group({
      Name: [],
      Surname: [],
      Login: [],
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

  ngOnDestroy() {
    this.routeDataEvent.unsubscribe();
  }
  // get breadcrumbs and push the item
  breadcrumbsSubscription() {
    let destroyer = new Subject();
    let breadcrumbsEvent: Subscription = this._administration.currentBreadcrumbList
      .pipe(takeUntil(destroyer))
      .subscribe(breadcrumbList => {
        let breadcrumbs = breadcrumbList;
        if (breadcrumbs.length > 0) {
          breadcrumbs.push({ name: this.itemName ? this.itemName : 'Edit Users', path: '', section: '' });
          destroyer.next();
          this._administration.changebreadcrumbList(breadcrumbs);
        }
      });
  }
  // get users func
  getPage(page: number, usersForAction?: string[]): void {
    const perPage = this.itemsPerPage;
    const start = ((page - 1) * perPage) + 1;
    const end = (start + perPage) - 1;
    const paginationParameters: PaginationParameters = {
      'perPage': perPage,
      'startRow': start,
      'endRow': end,
      'page': page
    };
    this.currentUsersActions(paginationParameters, usersForAction);
  }

  currentUsersActions(paginationParameters: PaginationParameters, usersForAction?: string[]): void {
    this._administration[this.routeData.userActions](this.itemID, this.collectActionData(), paginationParameters, usersForAction)
      .subscribe(
        response => {
          this.usersList = response;
          if (this.usersList.length === 0) {
            this.totalCount = 0;
          } else if (paginationParameters.startRow === 1) {
            this.totalCount = this.usersList[0].totalRowCount;
          }
          this.selection = new SelectionModel<any>(true, []);
          this.pagenumber = paginationParameters.page;
        },
        responseError => {
          this._errorHandlerFctsService.handleError(responseError).subscribe();
        },
        () => {
          if (this.action === 'addusers' || this.action === 'removeusers') {
            this.action = '';
          }
        }
      );
  }

  collectActionData(): any {
    let actionParams = {
      action: this.action,
      fullSearchStr: this.action === 'fullsearch' ? this.searchString.nativeElement.value : '',
      name: this.action === 'filtersearch' && this.filtersForm.get('Name').value ? this.filtersForm.get('Name').value : '',
      surname: this.action === 'filtersearch' && this.filtersForm.get('Surname').value ? this.filtersForm.get('Surname').value : '',
      login: this.action === 'filtersearch' && this.filtersForm.get('Login').value ? this.filtersForm.get('Login').value : '',
      department: this.action === 'filtersearch' && this.filtersForm.get('Department').value ?
        this.filtersForm.get('Department').value.OUID : -1
    };
    return actionParams;
  }

  getInitials(firstName: string, lastName: string) {
    return firstName.slice(0, 1).toUpperCase() + lastName.slice(0, 1).toUpperCase();
  }
  // search/filter functions
  applyMainFilter() {
    this.action = this.searchString.nativeElement.value.length > 0 ? 'fullsearch' : '';
    this.getPage(1);
  }

  filterObject() {
    this.action = 'filtersearch';
    this.getPage(1);
  }

  openFilter() {
    this.filterState = !this.filterState;
    this.searchString.nativeElement.value = '';
  }

  onFocus() {
    this.filterState = false;
    this.filtersForm.reset();
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

  // autocomplete display func
  displayFieldValue(fieldValue: DepFilterData) {
    if (fieldValue) { return this.translator.transform(fieldValue.Name_EN, fieldValue.Name_AR); }
  }

  // delete user(s) func
  removeRecord(usersList: string[]): void {
    this.action = 'removeusers';
    this.getPage(1, usersList);
  }

  removeRecords(): void {
    this.action = 'removeusers';
    let usersList = new Array();
    this.selection.selected.forEach(element => {
      usersList.push(element.ID);
    });
    this.getPage(1, usersList);
  }

  addUsersDialogBox(): void {
    const dialogRef = this.dialogU.open(AddUsersDialogComponent, {
      width: '100%',
      panelClass: 'dialog-box-wrapper',
      maxWidth: '650px',
      direction: DialogDirection[this.translatorService.translatorDir],
      data: {
        itemName: this.itemName,
        itemID: this.itemID,
        section: this.routeData.section
      }
    }).afterClosed().subscribe(result => {
      if (result && result.length > 0) {
        this.addUsers(result);
      }
    });
  }

  addUsers(usersList: string[]) {
    this.action = 'addusers';
    this.getPage(1, usersList);
  }
}
