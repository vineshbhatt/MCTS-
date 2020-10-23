import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AdministrationService } from 'src/app/dashboard/administration/services/administration.service';
import { ErrorHandlerFctsService } from 'src/app/dashboard/services/error-handler-fcts.service';
import { SelectionModel } from '@angular/cdk/collections';
import { debounceTime, switchMap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { PaginationParameters, DialogDirection } from '../../../administration.model';
import { MatDialog } from '@angular/material';
import { AddUsersDialogComponent } from '../../../admin-dialog-boxes/add-users-dialog/add-users-dialog.component';
import { multiLanguageTranslator, multiLanguageTranslatorPipe } from 'src/assets/translator/index';
import { BaseCurrentUsersComponent } from '../../../base-classes/base-current-users/base-current-users.component';


@Component({
  selector: 'app-org-chart-users',
  templateUrl: './org-chart-users.component.html',
  styleUrls: ['./org-chart-users.component.scss']
})
export class OrgChartUsersComponent extends BaseCurrentUsersComponent implements OnInit {

  constructor(
    public _administration: AdministrationService
    , public formBuilder: FormBuilder
    , public _errorHandlerFctsService: ErrorHandlerFctsService
    , public _route: ActivatedRoute
    , public dialogU: MatDialog
    , public translator: multiLanguageTranslatorPipe
    , public translatorService: multiLanguageTranslator) {
    super(_administration, formBuilder, _errorHandlerFctsService, _route, dialogU, translator, translatorService);
  }

  ngOnInit() {
    this.itemID = this._route.snapshot.queryParamMap.get('ID');
    this.itemName = this._route.snapshot.queryParamMap.get('ItemName');

    this.breadcrumbsSubscription();

    this.getPage(this.pagenumber);

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

  currentUsersActions(paginationParameters: PaginationParameters, usersForAction?: string[]): void {
    this._administration.orgmdOrgUnitUsers(this.itemID, this.collectActionData(), paginationParameters, usersForAction)
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

  addUsersDialogBox(): void {
    const dialogRef = this.dialogU.open(AddUsersDialogComponent, {
      width: '100%',
      panelClass: 'dialog-box-wrapper',
      maxWidth: '650px',
      direction: DialogDirection[this.translatorService.translatorDir],
      data: {
        itemName: this.itemName,
        itemID: this.itemID,
        allUsersActions: 'orgmdOrgUnitAllUsers'
      }
    }).afterClosed().subscribe(result => {
      if (result && result.length > 0) {
        this.addUsers(result);
      }
    });
  }

  collectActionData(): any {
    let actionParams = {
      action: this.action,
      fullSearchStr: this.action === 'fullsearch' ? this.searchString.nativeElement.value : '',
      name: this.action === 'filtersearch' && this.filtersForm.get('Name').value ? this.filtersForm.get('Name').value : '',
      surname: this.action === 'filtersearch' && this.filtersForm.get('Surname').value ? this.filtersForm.get('Surname').value : '',
      login: this.action === 'filtersearch' && this.filtersForm.get('Login').value ? this.filtersForm.get('Login').value : '',
      /*       department: this.action === 'filtersearch' && this.filtersForm.get('Department').value ?
              this.filtersForm.get('Department').value.OUID : -1 */
    };
    return actionParams;
  }

}
