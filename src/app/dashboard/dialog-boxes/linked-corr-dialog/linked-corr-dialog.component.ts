import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatAccordion, MatDialogRef } from '@angular/material';
import { CorrespondenceShareService } from 'src/app/dashboard/services/correspondence-share.service';
import { ErrorHandlerFctsService } from 'src/app/dashboard/services/error-handler-fcts.service';
import { FCTSDashBoard } from '../../../../environments/environment';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { Router, NavigationEnd } from '@angular/router';
import { CorrespondenceService } from 'src/app/dashboard/services/correspondence.service';
import { stringify } from 'querystring';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { forkJoin } from 'rxjs';
import { FilesSelectComponent } from 'src/app/dashboard/shared-components/files-select/files-select.component'

export interface ConnectedCorrespondencesData {
  CorrespondenceIcon: IconType[];
  SeeContents: boolean;
  ID: string;
  DataID: string;
  CreationDate: string;
  name: string;
  VolumeID: string;
  CorrespondenceCode: string;
  CorrespondenceDate: string;
  ArabicSubject: string;
  EnglishSubject: string;
  CorrespondenceFlowType: string;
  CorrFlowType: string;
  Confidential: string;
  CoverID: string;
  RecipientDepartment: string;
  RecipientDepartmentNameEN: string;
  RecipientDepartmentNameAR: string;
  SenderDepartment: string;
  SenderDepartmentNameEN: string;
  SenderDepartmentNameAR: string;
  ExternalOrganization: string;
  ExternalOrganizationNameEN: string;
  ExternalOrganizationNameAR: string;
  SubWorkTask_TaskID: string;
}

export interface ConnectedDocumentsData {
  ID: string;
  ConnectedObj: string;
  CreationDate: string;
  CreatorID: string;
  CreatorName_EN: string;
  CreatorName_AR: string;
  Name: string;
  DocType: string;
  Link: string;
}

export interface ThreadedViewData {
  CorrespondenceIcon: IconType[];
  SeeContents: boolean;
  LinkedIcon: string;
  DataID: string;
  ParentID: string;
  ConnectionType: string;
  name: string;
  VolumeID: string;
  CorrespondenceCode: string;
  CorrespondenceDate: string;
  ArabicSubject: string;
  EnglishSubject: string;
  CorrespondenceFlowType: string;
  CorrFlowTypeName: string;
  RecipientDepartment: string;
  RecipientDepartment_EN: string;
  RecipientDepartment_AR: string;
  SenderDepartment: string;
  SenderDepartment_EN: string;
  SenderDepartment_AR: string;
  ExternalOrganization: string;
  ExternalOrganizationNameEN: string;
  ExternalOrganizationNameAR: string;
  BaseType: string;
  Level?: number;
  SortNumber?: number;
  Type: string;
  CoverID: string;
}

export interface SearchData {
  CorrespondenceIcon: IconType[];
  VolumeID: string;
  DataID: string;
  CorrFlowType: string;
  CoverID: string;
  Name: string;
  Subject_EN: string;
  Subject_AR: string;
  ExternalOrganization: string;
  ExternalOrganization_EN: string;
  ExternalOrganization_AR: string;
  SenderDepartment: string;
  SenderDepartment_EN: string;
  SenderDepartment_AR: string;
  RecipientDepartment: string;
  RecipientDepartment_EN: string;
  RecipientDepartment_AR: string;
  CorrespondenceDate: string;
}

export interface IconType {
  title: string;
  icon: string;
}

@Component({
  selector: 'app-linked-corr-dialog',
  templateUrl: './linked-corr-dialog.component.html',
  styleUrls: ['./linked-corr-dialog.component.scss']
})
export class LinkedCorrDialogComponent implements OnInit {
  // variables for table data
  public connectedCorrData: ConnectedCorrespondencesData[];
  public connectedDocData: ConnectedDocumentsData[];
  public threadedViewObj;
  public connectedSearchDataObj: SearchData[];
  // spinner toggles
  public activeDataSpinner = false;
  public activeSearchSpinner = false;
  public firstLoadSpinner = false;
  // current corrrespondence data
  public currentReference: string;
  public currentName: string;
  // tab toggles
  public DocTabIndex = 0;
  public CorrTabIndex = 0;
  // search filter parameters
  public searchExtOrgFieldShow: boolean;
  public searchRecipientDeptFieldShow: boolean;
  public searchSenderDeptFieldShow: boolean;
  // correspondence search number
  public startPage = 1;
  public endPage = 20;

  // tables fields
  CorrDisplayedColumns: string[] = ['DocType', 'name', 'EnglishSubject', 'ExternalOrganizationNameEN', 'SenderDepartmentNameEN', 'RecipientDepartmentNameEN', 'CorrespondenceDate', 'Remove'];
  SearchTableDisplayedColumns: string[] = ['DocType', 'CorrespondenceCode', 'Subject_EN', 'ExternalOrganization_EN', 'SenderDepartment_EN', 'RecipientDepartment_EN', 'CorrespondenceDate', 'Link'];
  ThreadedDisplayedColumns: string[] = ['EnglishSubject', 'Type', 'ExternalOrganizationNameEN', 'SenderDepartment_EN', 'RecipientDepartment_EN', 'name', 'CorrespondenceDate'];
  DocDisplayedColumns: string[] = ['DocType', 'Name', 'CreatorName_EN', 'CreationDate', 'Remove'];
  // routing variables
  basehref: String = FCTSDashBoard.BaseHref;
  CSUrl: String = FCTSDashBoard.CSUrl;
  routerCorrDetail = '/dashboard/external/correspondence-detail';
  isProxy = false;
  // objects for tables loop
  CorrTableStructure = [
    { 'columnDef': 'DocType', 'columnName': '' },
    { 'columnDef': 'name', 'columnName': '	PWA Reference' },
    { 'columnDef': 'EnglishSubject', 'columnName': 'Subject' },
    { 'columnDef': 'ExternalOrganizationNameEN', 'columnName': 'External Org.' },
    { 'columnDef': 'SenderDepartmentNameEN', 'columnName': 'From Dep.' },
    { 'columnDef': 'RecipientDepartmentNameEN', 'columnName': 'To Dep.' },
    { 'columnDef': 'CorrespondenceDate', 'columnName': 'Recived Date' },
    { 'columnDef': 'Remove', 'columnName': '' }
  ];
  DocsTableStructure = [
    { 'columnDef': 'DocType', 'columnName': '' },
    { 'columnDef': 'Name', 'columnName': 'Connection' },
    { 'columnDef': 'CreatorName_EN', 'columnName': 'Connected By' },
    { 'columnDef': 'CreationDate', 'columnName': 'Connection Date' },
    { 'columnDef': 'Remove', 'columnName': '' }
  ];
  ThreadedViewTableStructure = [
    { 'columnDef': 'EnglishSubject', 'columnName': 'Subject' },
    { 'columnDef': 'Type', 'columnName': 'Type' },
    { 'columnDef': 'ExternalOrganizationNameEN', 'columnName': 'External Org.' },
    { 'columnDef': 'SenderDepartment_EN', 'columnName': 'From Dep.' },
    { 'columnDef': 'RecipientDepartment_EN', 'columnName': 'To Dep.' },
    { 'columnDef': 'name', 'columnName': 'Correspondence Code' },
    { 'columnDef': 'CorrespondenceDate', 'columnName': 'Date' }
  ];
  SearchTableStructure = [
    { 'columnDef': 'DocType', 'columnName': '' },
    { 'columnDef': 'CorrespondenceCode', 'columnName': 'PWA Reference' },
    { 'columnDef': 'Subject_EN', 'columnName': 'Subject' },
    { 'columnDef': 'ExternalOrganization_EN', 'columnName': 'External Org.' },
    { 'columnDef': 'SenderDepartment_EN', 'columnName': 'From Dep.' },
    { 'columnDef': 'RecipientDepartment_EN', 'columnName': 'To Dep.' },
    { 'columnDef': 'CorrespondenceDate', 'columnName': 'Recived Date' },
    { 'columnDef': 'Link', 'columnName': '' }
  ];
  // search filter object
  SearchFilterData = {
    ReferenceCode: '',
    DocumentNumber: '',
    MyAssignments: false,
    DispatchDateFrom: '',
    DispatchDateTo: '',
    Subject: '',
    CorrespondencType: { ID: '', EN: '', AR: '' },
    ExternalOrganization: '',
    ExternalDepartment: '',
    RecipientDepartment: { ID: '', EN: '', AR: '' },
    SenderDepartment: { ID: '', EN: '', AR: '' },
    Priority: { ID: '', EN: '', AR: '' },
    BaseType: { ID: '', EN: '', AR: '' },
    IDNumber: '',
    Personalname: '',
    Transferpurpose: '',
    Contract: '',
    Tender: '',
    Mailroom: '',
    Budget: '',
    Project: '',
    Staffnumber: ''
  };
  // TODO constants for correspondence insert (make it global)
  InsertCorrConstants = {
    'ConnectedType': 'Correspondence',
    'ReferenceType': 'Correspondence',
    'ConnectionType': '1',
    'Deleted': '0'
  };

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(FilesSelectComponent) filesSelect: FilesSelectComponent;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public correspondenceShareService: CorrespondenceShareService,
    public dialogRef: MatDialogRef<LinkedCorrDialogComponent>,
    public errorHandlerFctsService: ErrorHandlerFctsService,
    public correspondenceService: CorrespondenceService,
    public dialogU: MatDialog,
    public router: Router,
  ) { }

  ngOnInit() {
    this.PrepareData();
    this.searchExtOrgFieldShow = true;
    this.searchRecipientDeptFieldShow = true;
    this.searchSenderDeptFieldShow = true;
  }

  PrepareData() {
    this.currentName = this.data.correspondData.Name;
    this.currentReference = this.data.correspondData.DataID;
    this.getDataFunction(this.data.correspondData.DataID);
  }

  getDataFunction(DataID: string) {
    this.firstLoadSpinner = true;
    forkJoin(
      this.correspondenceShareService.getCorrConnected(DataID),
      this.correspondenceShareService.getDocumentsRelated(DataID),
      this.correspondenceShareService.getThreadedView(DataID)
    )
      .subscribe(
        ([res1, res2, res3]) => {
          this.connectedCorrData = res1;
          this.connectedDocData = res2;
          const sortObject: SortObjectClass = new SortObjectClass(res3);
          this.threadedViewObj = new MatTableDataSource(sortObject.sortObjFunction());
          this.threadedViewObj.sort = this.sort;
          this.firstLoadSpinner = false;
        },
        responseError => {
          this.errorHandlerFctsService.handleError(responseError).subscribe();
          this.firstLoadSpinner = false;
        });
  }

  getOnlyCorrConnected(DataID: string) {
    this.firstLoadSpinner = true;
    this.correspondenceShareService.getCorrConnected(DataID).subscribe(
      response => {
        this.connectedCorrData = response;
        this.firstLoadSpinner = false;
      },
      responseError => {
        this.errorHandlerFctsService.handleError(responseError).subscribe();
        this.firstLoadSpinner = false;
      }
    );
  }

  getOnlyDocumentsRelated(DataID: string) {
    this.activeDataSpinner = true;
    this.correspondenceShareService.getDocumentsRelated(DataID).subscribe(
      response => {
        this.connectedDocData = response;
        this.activeDataSpinner = false;
      },
      responseError => {
        this.errorHandlerFctsService.handleError(responseError).subscribe();
        this.activeDataSpinner = false;
      }
    );
  }

  changeCorrTab(tab) {
    this.CorrTabIndex = tab;
  }

  changeDocumentTab(tab) {
    this.DocTabIndex = tab;
    if (tab === 0) {
      this.getOnlyDocumentsRelated(this.currentReference);
    }
  }

  onSearchLinkedButtonClick(selecetedValues: any): void {
    this.SearchFilterData = selecetedValues;
    this.getCorrespondence(this.startPage, this.endPage, this.SearchFilterData);
  }

  getCorrespondence(startrow: number, endrow: number, SearchFilterData: any): void {
    this.activeSearchSpinner = true;
    this.correspondenceShareService
      .getLinkedSearchCorr(this.currentReference, startrow, endrow, SearchFilterData/* , this.isProxy */)
      .subscribe(
        response => {
          this.connectedSearchDataObj = response;
          this.activeSearchSpinner = false;
        },
        responseError => {
          this.errorHandlerFctsService.handleError(responseError).subscribe();
          this.activeSearchSpinner = false;
        }
      );
  }

  addCorrConnection(LinkingData) {
    this.correspondenceShareService.insertDocConnection(this.currentReference, LinkingData, this.InsertCorrConstants)
      .subscribe(response => {
        this.getOnlyCorrConnected(this.currentReference);
        this.changeCorrTab(0);
      },
        responseError => {
          this.errorHandlerFctsService.handleError(responseError).subscribe();
        });
  }

  deleteConnectionConfirmDialog(ConnectionID: string, type: string): void {
    const dialogRef = this.dialogU.open(ConfirmationDialogComponent, {
      width: '100%',
      panelClass: 'userConfirmation',
      maxWidth: '30vw',
      data: {
        message: 'deleteConnection'
      }
    }).afterClosed().subscribe(
      response => {
        if (response) {
          this.deleteConnectedCorr(ConnectionID, type);
        }
      });
  }

  deleteConnectedCorr(ConnectionID: string, type: string): void {
    this.correspondenceShareService.deleteConnectedCorr(ConnectionID).subscribe(
      response => {
        if (type === 'corr') {
          this.getOnlyCorrConnected(this.currentReference);
        } else if (type === 'doc') {
          this.getOnlyDocumentsRelated(this.currentReference);
        }
      },
      responseError => {
        this.errorHandlerFctsService.handleError(responseError).subscribe();
      }
    );
  }

  setPerformerPermission(correspondData: ConnectedCorrespondencesData): void {
    this.correspondenceService.setPerformerPermission(correspondData).subscribe(
      response => { },
      responseError => {
        this.errorHandlerFctsService.handleError(responseError).subscribe();
      }
    );
  }

  threadedMoving(Rowdata: ThreadedViewData): void {
    this.currentName = Rowdata.name;
    this.currentReference = Rowdata.DataID;
    this.getDataFunction(Rowdata.DataID);
    this.filesSelect.threadedMoving(this.currentReference);
    this.connectedSearchDataObj = null;
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

}

export class SortObjectClass {
  obj: ThreadedViewData[];
  private sortNumber = 0;

  constructor(obj: ThreadedViewData[]) {
    this.obj = obj;
  }

  sortObjFunction(): any {
    const parentReferenceID = this.FindZeroLevel();
    this.ChildSortFunc(parentReferenceID, 1);
    return this.obj;
  }

  FindZeroLevel() {
    let referenceID: string;
    this.obj.forEach(element => {
      if (element.ParentID === '0') {
        element.Level = 0;
        element.SortNumber = this.sortNumber;
        this.sortNumber++;
        referenceID = element.DataID;
      }
    });
    return referenceID;
  }

  ChildSortFunc(parent, Level) {
    this.obj.forEach(element => {
      if (element.ParentID === parent) {
        element.Level = Level;
        element.SortNumber = this.sortNumber;
        this.sortNumber++;
        this.ChildSortFunc(element.DataID, Level + 1);
      }
    });
  }
}
