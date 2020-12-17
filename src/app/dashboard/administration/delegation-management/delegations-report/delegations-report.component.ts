import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DelegationService } from '../../services/delegation.service';
import { ErrorHandlerFctsService } from 'src/app/dashboard/services/error-handler-fcts.service';
import { MatTableDataSource } from '@angular/material';
import { multiLanguageTranslator, multiLanguageTranslatorPipe } from 'src/assets/translator/index';
import { Observable } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import { UsersAutocompleteModel } from '../../models/delegation.model';

export class SearchObject {
  delegator: number;
  proxy: number;
  startDate: string;
  endDate: string;
}

@Component({
  selector: 'app-delegations-report',
  templateUrl: './delegations-report.component.html',
  styleUrls: ['./delegations-report.component.scss']
})
export class DelegationsReportComponent implements OnInit {
  filtersForm: FormGroup;
  dataSource = new MatTableDataSource();
  lang: string = this.translatorService.lang.toUpperCase();
  delegatorUsersAutocmpl: Observable<UsersAutocompleteModel[]>;
  proxyUsersAutocmpl: Observable<UsersAutocompleteModel[]>;
  isLoading = false;

  displayedColumns: string[] = ['UserName_' + this.lang, 'ProxyName_' + this.lang, 'StartDate', 'EndDate', 'UserStartDate', 'UserFinishDate'];
  tableStructure = [
    { 'columnDef': 'UserName_' + this.lang, 'columnName': 'delegator_user', 'className': '' },
    { 'columnDef': 'ProxyName_' + this.lang, 'columnName': 'proxy_user', 'className': '' },
    { 'columnDef': 'StartDate', 'columnName': 'start_date', 'className': '' },
    { 'columnDef': 'EndDate', 'columnName': 'end_date', 'className': '' },
    { 'columnDef': 'UserStartDate', 'columnName': 'user_start_date', 'className': '' },
    { 'columnDef': 'UserFinishDate', 'columnName': 'user_finish_date', 'className': '' }
  ];

  constructor(
    public formBuilder: FormBuilder,
    private _delegationService: DelegationService,
    private _errorHandlerFctsService: ErrorHandlerFctsService,
    public translator: multiLanguageTranslatorPipe,
    public translatorService: multiLanguageTranslator,
  ) { }

  ngOnInit() {
    this.filtersForm = this.formBuilder.group({
      DelegatorUser: [''],
      ProxyUser: [''],
      StartDate: [''],
      EndDate: ['']
    });

    this.delegatorUsersAutocmpl = this.filtersForm.get('DelegatorUser').valueChanges
      .pipe(
        debounceTime(300),
        switchMap(value =>
          this._delegationService.delegationUsersAutoCmpl(value)
        )
      );
    this.proxyUsersAutocmpl = this.filtersForm.get('ProxyUser').valueChanges
      .pipe(
        debounceTime(300),
        switchMap(value =>
          this._delegationService.delegationUsersAutoCmpl(value)
        )
      );
  }

  runReport() {
    this.isLoading = true;
    const obj = new SearchObject();
    const delegator = this.filtersForm.get('DelegatorUser').value;
    const proxy = this.filtersForm.get('ProxyUser').value;
    obj.delegator = delegator.hasOwnProperty('KuafID') ? delegator.KuafID : '';
    obj.proxy = proxy.hasOwnProperty('KuafID') ? proxy.KuafID : '';
    obj.startDate = this.DateToString(this.filtersForm.get('StartDate').value);
    obj.endDate = this.DateToString(this.filtersForm.get('EndDate').value);
    this._delegationService.DelegationsReport(obj).subscribe(
      response => {
        this.dataSource.data = response;
      },
      responseError => {
        this._errorHandlerFctsService.handleError(responseError).subscribe();
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  displayFieldValue(fieldValue: any) {
    if (fieldValue) { return this.translator.transform(fieldValue.Name_EN, fieldValue.Name_AR); }
  }

  DateToString(mDate): string {
    function pad(n) { return n < 10 ? '0' + n : n; }
    if (mDate instanceof Date) {
      return 'D' + '/'
        + mDate.getFullYear() + '/'
        + pad(mDate.getMonth() + 1) + '/'
        + pad(mDate.getDate()) + ':'
        + pad(mDate.getHours()) + ':'
        + pad(mDate.getMinutes()) + ':'
        + pad(mDate.getSeconds());
    } else {
      return '';
    }
  }

}
