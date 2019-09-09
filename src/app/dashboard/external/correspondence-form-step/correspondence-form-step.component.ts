import { Component, OnInit, AfterViewInit, VERSION } from '@angular/core';
import { ErrorHandlerFctsService } from '../../services/error-handler-fcts.service';
import { OrgNameAutoFillModel, CorrespondenceFolderModel, CCUserSetModel, CorrespondenenceDetailsModel } from 'src/app/dashboard/models/CorrespondenenceDetails.model';
import { CorrespondenceDetailsService } from 'src/app/dashboard/services/correspondence-details.service';
import { OrganizationalChartService } from 'src/app/dashboard/services/organizationalChart.service';
import { organizationalChartModel, organizationalChartEmployeeModel  } from 'src/app/dashboard/models/organizational-Chart.model';
import { Location } from '@angular/common';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { Observable, EMPTY } from 'rxjs';
import { FCTSDashBoard } from '../../../../environments/environment';
import { FormArray, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CorrResponse, CorrespondenceFormData, SenderDetailsData, RecipientDetailsData } from '../../services/correspondence-response.model';
import { switchMap, debounceTime } from 'rxjs/operators';
import { MatOptionSelectionChange, MatCheckboxChange } from '@angular/material';
import { CorrespondenceService } from 'src/app/dashboard/services/correspondence.service';
import { DocumentPreview } from '../../services/documentpreview.model';
import { CSDocumentUploadService } from '../../services/CSDocumentUpload.service';
import { NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
import { CorrespondenceWFFormModel } from '../../models/CorrepondenceWFFormModel';
import { ActivatedRoute } from '@angular/router';
import {DatePipe} from '@angular/common';

import { ShowSections, ShowCorrItems } from 'src/app/dashboard/external/correspondence-detail/correspondence-show-sections';


@Component({
  selector: 'app-correspondence-form-step',
  templateUrl: './correspondence-form-step.component.html',
  styleUrls: ['./correspondence-form-step.component.scss']
})


export class CorrespondenceFormStepComponent implements OnInit {

  constructor(
      private correspondenceDetailsService: CorrespondenceDetailsService
    , private _location: Location
    , private organizationalChartService: OrganizationalChartService
    , private formBuilder: FormBuilder
    , private correspondencservice: CorrespondenceService
    , private csdocumentupload: CSDocumentUploadService
    , private _correspondenceDetailsService: CorrespondenceDetailsService
    , private route: ActivatedRoute
    , private datePipe: DatePipe
    , private _errorHandlerFctsService: ErrorHandlerFctsService) { }

  get f() { return this.correspondenceDetailsForm.controls; }

  basehref: String = FCTSDashBoard.BaseHref;
  CSUrl: String = FCTSDashBoard.CSUrl;
  expandedRightAction = true;
  expandedAction = true;
  userInfo: CorrResponse[];
  filteredExtOrgNames: Observable<OrgNameAutoFillModel[]>;
  filteredIntDepNames: Observable<OrgNameAutoFillModel[]>;
  filteredDepartmentNames: Observable<OrgNameAutoFillModel[]>;
  ExtSenderInfo: OrgNameAutoFillModel;
  IntRecipientInfo: OrgNameAutoFillModel;
  senderControl = new FormControl();
  recipientControl = new FormControl();
  myControl = new FormControl();
  correspondenceDetailsForm: FormGroup;
  senderDetailsForm: FormGroup;
  recipientDetailsForm: FormGroup;

  ccDetailsForm: FormGroup;
  CCDetails: FormArray;
  submitted = false;
  CorrespondenceType: string;
  MetadataFilters: any[];
  externalIncCoverLetterData: CorrResponse[];
  externalAttachmentFolderData: CorrResponse[];
  corrFolderData: CorrespondenceFolderModel;
  documentPreviewURL: DocumentPreview[];

  selectedCaption: string;
  multiSelect: boolean;
  currentlyChecked: any = false;
  currentlyCheckedStatus: boolean;
  showPreviewCoverLetter: boolean;

  treeControl = new NestedTreeControl<organizationalChartModel>(node => node.children);
  dataSource = new MatTreeNestedDataSource<organizationalChartModel>();

  showEmployees = false;

  organizationalChartData: organizationalChartModel[];
  showEmplChartData: organizationalChartModel;
  showOrgChartData: organizationalChartModel;
  showPreviewTreeArea = false;
  //
  percentDone: number;
  uploadSuccess: boolean;
  version = VERSION;

  //
  initiateIncomingCorrespondenceDetails = new CorrespondenceWFFormModel;

  showGeneratebarcodeButton = true;
  showSendOnButton = false;
  coverID: string;

  CCOUID: organizationalChartModel[] = [];
  CCEID: organizationalChartEmployeeModel[] = [];
  value = '';
  public files: NgxFileDropEntry[] = [];

  correspondenceData: CorrespondenenceDetailsModel;

  //
  VolumeID: string;
  CoverID: string;
  locationid: string;
  CorrespondencType: string;
  taskID: string;
  CorrespondenceFolderName: Observable<any>;
  transID: string;

  correspondenceSenderDetailsData: SenderDetailsData;    // make model
  correspondenceRecipientDetailsData: RecipientDetailsData; // make model
  correspondenceCollaborationDetail: CorrResponse[]; // make model
  ccProgbar = false;
  commentsProgbar = false;
  correspondenceCCtData: CorrResponse[];
  correspondenceCommentsDetail: CorrResponse[];
  transferhistorytabData: CorrResponse[];
  transferProgbar = false;
  userCollaborationProgbar = false;

  body: CorrespondenceFormData = {
    action: 'formUpdate',
    values: {}
  };
  public name = '';
  employeeMap = new Map<number, organizationalChartEmployeeModel[]>();
  showempDetails = false;
  CCLoaded = false;
  sectionDisplay = new ShowSections();
  ShowCorrItemsDisplay = new ShowCorrItems();


  ngOnInit() {
    this.VolumeID = this.route.snapshot.queryParamMap.get('VolumeID');
    this.CorrespondencType = this.route.snapshot.queryParamMap.get('CorrType');
    this.locationid = this.route.snapshot.queryParamMap.get('locationid');
    this.taskID = this.route.snapshot.queryParamMap.get('TaskID');


    this.RefreshRecord();

    this.readCorrespondenceInfo();

    this.getCorrespondenceSenderDetails();

    this.getCorrespondenceRecipientDetails();


    // Get Logged in user Information
    this.getUserInfo();
    this.getOrganizationalChartDetail();

    this.senderDetailsForm = this.formBuilder.group({
      SenderName: [],
      SenderDepartment: [],
      ExternalOrganization: [],

    });


    this.recipientDetailsForm = this.formBuilder.group({
      RecipientID: [],
      RecipientUserID: [],
      RecipientVersion: [],
      RecipientType: [],
      RecipientDepartment: [],
      RecipientDepartmentName: [],
      RecipientSection: [],
      RecipientRole: [],
      RecipientName: []
    });

    this.ccDetailsForm = this.formBuilder.group({
      CCDetails: this.formBuilder.array([

      ])
    });

    this.correspondenceDetailsForm = this.formBuilder.group({
      regDate: new FormControl({ value: '', disabled: !this.ShowCorrItemsDisplay.regDate.Modify }),
      docsDate: new FormControl({ value: '', disabled: !this.ShowCorrItemsDisplay.docsDate.Modify }),
      confidential: new FormControl({ value: '', disabled: !this.ShowCorrItemsDisplay.confidential.Modify }),
      priority: new FormControl({ value: '', disabled: !this.ShowCorrItemsDisplay.priority.Modify }),
      refNumber: new FormControl({ value: '', disabled: !this.ShowCorrItemsDisplay.refNumber.Modify }),
      personalName: new FormControl({ value: '', disabled: !this.ShowCorrItemsDisplay.personalName.Modify }),
      idNumber: new FormControl({ value: '', disabled: !this.ShowCorrItemsDisplay.idNumber.Modify }),
      correspondenceType: new FormControl({ value: '', disabled: !this.ShowCorrItemsDisplay.correspondenceType.Modify }),
      baseType: new FormControl({ value: '', disabled: !this.ShowCorrItemsDisplay.baseType.Modify }),
      arabicSubject: new FormControl({ value: '', disabled: !this.ShowCorrItemsDisplay.arabicSubject.Modify }),
      englishSubject: new FormControl({ value: '', disabled: !this.ShowCorrItemsDisplay.englishSubject.Modify }),
      projectCode: new FormControl({ value: '', disabled: !this.ShowCorrItemsDisplay.projectCode.Modify }),
      budgetNumber: new FormControl({ value: '', disabled: !this.ShowCorrItemsDisplay.budgetNumber.Modify }),
      contractNumber: new FormControl({ value: '', disabled: !this.ShowCorrItemsDisplay.contractNumber.Modify }),
      tenderNumber: new FormControl({ value: '', disabled: !this.ShowCorrItemsDisplay.tenderNumber.Modify }),
      corrNumber: new FormControl({ value: '', disabled: !this.ShowCorrItemsDisplay.corrNumber.Modify }),
      fillinPlanPath: new FormControl({ value: '', disabled: !this.ShowCorrItemsDisplay.fillinPlanPath.Modify }),
      dispatchMethod: new FormControl({ value: '', disabled: !this.ShowCorrItemsDisplay.dispatchMethod.Modify }),
      staffNumber: new FormControl({ value: '', disabled: !this.ShowCorrItemsDisplay.staffNumber.Modify }),
    });

    this.filteredExtOrgNames = this.senderDetailsForm.get('ExternalOrganization').valueChanges
      .pipe(
        debounceTime(300),
        switchMap(value =>
          this.correspondenceDetailsService.searchFieldForAutoFill(value, 'ExtOrganization', '')
        )
      );

    this.filteredIntDepNames = this.recipientDetailsForm.get('RecipientDepartment').valueChanges
      .pipe(
        debounceTime(300),
        switchMap(value =>
          this.correspondenceDetailsService.searchFieldForAutoFill(value, 'IntDepartment', '')
        )
      );
  }

  ngAfterViewInit() {
    // this.getTempFolderAttachments('Incoming');
  }


  ReadRecord(locationid: string, transid: string) {
    this.correspondenceDetailsService
      .getCorrRecord(locationid, transid, CSConfig.globaluserid)
      .subscribe(correspondenceData => {
        this.correspondenceData = correspondenceData[0];
        this.getCoverSection();
      });
  }

  RefreshRecord() {
    this.ReadRecord(this.locationid, this.transID);
  }

  getCorrespondenceSenderDetails(): void {
    this._correspondenceDetailsService.getCorrespondenceSenderDetails(this.VolumeID, this.CorrespondencType, false, '')
      .subscribe(correspondenceSenderDetailsData => {
          if ((typeof correspondenceSenderDetailsData[0].myRows !== 'undefined') && correspondenceSenderDetailsData[0].myRows.length > 0) {
            this.correspondenceSenderDetailsData = correspondenceSenderDetailsData[0].myRows[0];
          }
        },
        responseError => {
          this._errorHandlerFctsService.handleError(responseError).subscribe();
        }
        );
  }



  getCorrespondenceRecipientDetails(): void {
    this._correspondenceDetailsService
      .getCorrespondenceRecipientDetails(this.VolumeID, this.CorrespondencType)
      .subscribe(
        correspondenceRecipientDetailsData => {
          // tslint:disable-next-line: max-line-length
          if (( typeof correspondenceRecipientDetailsData[0].myRows !== 'undefined') && correspondenceRecipientDetailsData[0].myRows.length > 0) {
            this.correspondenceRecipientDetailsData = correspondenceRecipientDetailsData[0].myRows[0];
          }
        },
        responseError => {
          this._errorHandlerFctsService.handleError(responseError).subscribe();
        }
      );
  }

  ccShowData() {
    this.getCorrespondenceCCDetail(this.VolumeID, this.CorrespondencType);
  }

  getCorrespondenceCCDetail(VolumeID: String, CorrFlowType: String): void {
    if (!this.CCLoaded) {
      this.ccProgbar = true;
      this._correspondenceDetailsService.getCorrespondenceCCDetail(VolumeID, CorrFlowType)
        .subscribe(correspondenceCCtData => {
          this.correspondenceCCtData = correspondenceCCtData;
          this.ccProgbar = false;
          this.CCLoaded = true;
          for (const obj of this.correspondenceCCtData[0].myRows) {
            if (obj.CCUserID > 0) {
              this.addCC(obj);
            }
          }
        });
    }
  }

  addCC(depDetails: CCUserSetModel): void {
    this.CCDetails = this.ccDetailsForm.get('CCDetails') as FormArray;
    this.CCDetails.push(this.createNewCC(depDetails));
  }
  createNewCC(depDetails: CCUserSetModel): FormGroup {
    return this.formBuilder.group({
      DepID: depDetails.CCUserID,
      Depversion: depDetails.CCVersion,
      departmentName: depDetails.DepartmentName_EN,
      role: depDetails.Role_EN,
      name: depDetails.Name_EN
    });
  }
  removeCC(index: number) {
    this.CCDetails = this.ccDetailsForm.get('CCDetails') as FormArray;
    this.CCDetails.removeAt(index);
  }

  collaborationShowData() {
    this.getCorrespondenceCollaborationData();
  }

  getCorrespondenceCollaborationData(): void {
    this.userCollaborationProgbar = true;
    this._correspondenceDetailsService.getCorrespondenceCollaborationInfoRO(this.VolumeID, this.CorrespondencType)
      .subscribe(correspondenceCollaborationDetail => {
        this.correspondenceCollaborationDetail = correspondenceCollaborationDetail;
        this.userCollaborationProgbar = false;
      });
  }


  showCommentsData() {
    this.getCommentsData();
  }

  getCommentsData(): void {
    this.commentsProgbar = true;
    this._correspondenceDetailsService.getCommentsData(this.VolumeID)
      .subscribe(correspondenceCommentsDetail => {
        this.correspondenceCommentsDetail = correspondenceCommentsDetail;
        this.commentsProgbar = false;
      });
  }
  /***/
  readCorrespondenceInfo(): void {
    this._correspondenceDetailsService.getFormStepInfo(this.VolumeID, this.VolumeID, this.taskID).subscribe(
      data => {
        if ((typeof data.forms !== 'undefined') && data.forms.length > 0) {
          this.body.values = data.forms[0].data;
          console.log('this.body.values');
          console.log(this.body.values);
          this.getMetadataFilters();
        }
      },
      responseError => {
        this._errorHandlerFctsService.handleError(responseError).subscribe();
      }
    );
  }

  makeFormObjectToSubmit() {

    this.body.values.WorkflowForm_1x4x1x88 = this.senderDetailsForm.get('SenderName').value;

    this.body.values.WorkflowForm_1x4x1x22 = this.setPopupCheckedValue('Priority', this.correspondenceDetailsForm.get('priority').value.EN);
    this.body.values.WorkflowForm_1x4x1x2 = this.correspondenceDetailsForm.get('regDate').value;
    this.body.values.WorkflowForm_1x4x1x124 = this.correspondenceDetailsForm.get('docsDate').value;
    this.body.values.WorkflowForm_1x4x1x28 = this.correspondenceDetailsForm.get('refNumber').value;
    this.body.values.WorkflowForm_1x4x1x88 = this.correspondenceDetailsForm.get('personalName').value;
    this.body.values.WorkflowForm_1x4x1x27 = this.correspondenceDetailsForm.get('idNumber').value;
    // tslint:disable-next-line: max-line-length
    this.body.values.WorkflowForm_1x4x1x30 = this.setPopupCheckedValue('CorrespondenceType', this.correspondenceDetailsForm.get('correspondenceType').value.EN);
    this.body.values.WorkflowForm_1x4x1x29 = this.setPopupCheckedValue('BaseType', this.correspondenceDetailsForm.get('baseType').value.EN);
    this.body.values.WorkflowForm_1x4x1x35 = this.correspondenceDetailsForm.get('arabicSubject').value;
    this.body.values.WorkflowForm_1x4x1x36 = this.correspondenceDetailsForm.get('englishSubject').value;
    this.body.values.WorkflowForm_1x4x1x37 = this.correspondenceDetailsForm.get('projectCode').value;
    this.body.values.WorkflowForm_1x4x1x38 = this.correspondenceDetailsForm.get('budgetNumber').value;
    this.body.values.WorkflowForm_1x4x1x40 = this.correspondenceDetailsForm.get('contractNumber').value;
    this.body.values.WorkflowForm_1x4x1x39 = this.correspondenceDetailsForm.get('tenderNumber').value;
    this.body.values.WorkflowForm_1x4x1x9 = this.correspondenceDetailsForm.get('corrNumber').value;
    this.body.values.WorkflowForm_1x4x1x41 = this.correspondenceDetailsForm.get('staffNumber').value;
    this.body.values.WorkflowForm_1x4x1x49 = this.setPopupCheckedValue('DispatchMethod', this.correspondenceDetailsForm.get('dispatchMethod').value.EN);
    this.body.values.WorkflowForm_1x4x1x75 = 'SendOn';
    this.getCCtoFormObject();
    console.log('NewBodyData');
    console.log(this.body);
  }

  getCCtoFormObject() {
    this.body.values.WorkflowForm_1x4x1x17.splice(this.ccDetailsForm.get('CCDetails').value.length);
    for (let i = 0; i < this.ccDetailsForm.get('CCDetails').value.length; i++ ) {
      if (typeof this.body.values.WorkflowForm_1x4x1x17[i] === 'object') {
       this.body.values.WorkflowForm_1x4x1x17[i].WorkflowForm_1x4x1x17_x_18 = this.ccDetailsForm.get('CCDetails').value[i].DepID;
       this.body.values.WorkflowForm_1x4x1x17[i].WorkflowForm_1x4x1x17_x_19 = this.ccDetailsForm.get('CCDetails').value[i].Depversion;
      } else {
       this.body.values.WorkflowForm_1x4x1x17.push({WorkflowForm_1x4x1x17_x_18: this.ccDetailsForm.get('CCDetails').value[i].DepID,
                                                    WorkflowForm_1x4x1x17_x_19: this.ccDetailsForm.get('CCDetails').value[i].Depversion,
                                                    WorkflowForm_1x4x1x17_x_20: null, WorkflowForm_1x4x1x17_x_92: null} );
      }
    }
  }

   test2() {
    let datePipe = new DatePipe('en-US');
    console.log(this.datePipe.transform(this.body.values.WorkflowForm_1x4x1x2, 'dd/MM/yyyy hh:mm'));
    console.log('this.sectionDisplay');
    console.log(this.sectionDisplay);
    console.log('this.ShowCorrItemsDisplay');
    console.log(this.ShowCorrItemsDisplay);
  }

  setCorrespondenceDetails(): void {
    // tslint:disable-next-line: max-line-length
    this.recipientDetailsForm.get('RecipientDepartment').setValue({DepName_En : this.correspondenceRecipientDetailsData.DepartmentName_EN ? this.correspondenceRecipientDetailsData.DepartmentName_EN : '',
                                                                   SecName_En : this.correspondenceRecipientDetailsData.SectionName_EN});
    this.recipientDetailsForm.get('RecipientName').setValue(this.correspondenceRecipientDetailsData.Name_EN);
    // set data for sender
    if (this.correspondenceSenderDetailsData) {
      this.senderDetailsForm.get('SenderName').setValue(this.correspondenceSenderDetailsData.Name_EN);
      this.senderDetailsForm.get('SenderDepartment').setValue(this.correspondenceSenderDetailsData.DepartmentName_EN);
      this.senderDetailsForm.get('ExternalOrganization').setValue({OrgName_En : this.correspondenceSenderDetailsData.OrganizationName_EN});
    }

     // tslint:disable-next-line: max-line-length
    this.correspondenceDetailsForm.get('priority').setValue({EN: this.getDefaultaValue('Priority', this.body.values.WorkflowForm_1x4x1x22)});
    this.correspondenceDetailsForm.get('confidential').setValue(this.body.values.WorkflowForm_1x4x1x78);
    this.correspondenceDetailsForm.get('regDate').setValue(this.datePipe.transform(this.body.values.WorkflowForm_1x4x1x2, 'dd/MM/yyyy hh:mm'));
    this.correspondenceDetailsForm.get('docsDate').setValue(this.body.values.WorkflowForm_1x4x1x124);
    this.correspondenceDetailsForm.get('refNumber').setValue(this.body.values.WorkflowForm_1x4x1x28);
    this.correspondenceDetailsForm.get('personalName').setValue(this.body.values.WorkflowForm_1x4x1x88);
    this.correspondenceDetailsForm.get('idNumber').setValue(this.body.values.WorkflowForm_1x4x1x27);
    // tslint:disable-next-line: max-line-length
    this.correspondenceDetailsForm.get('correspondenceType').setValue({EN: this.getDefaultaValue('CorrespondenceType', this.body.values.WorkflowForm_1x4x1x30)});
    // tslint:disable-next-line: max-line-length
    this.correspondenceDetailsForm.get('baseType').setValue({EN: this.getDefaultaValue('BaseType', this.body.values.WorkflowForm_1x4x1x29)});
    this.correspondenceDetailsForm.get('arabicSubject').setValue(this.body.values.WorkflowForm_1x4x1x35);
    this.correspondenceDetailsForm.get('englishSubject').setValue(this.body.values.WorkflowForm_1x4x1x36);
    this.correspondenceDetailsForm.get('projectCode').setValue(this.body.values.WorkflowForm_1x4x1x37);
    this.correspondenceDetailsForm.get('budgetNumber').setValue(this.body.values.WorkflowForm_1x4x1x38);
    this.correspondenceDetailsForm.get('contractNumber').setValue(this.body.values.WorkflowForm_1x4x1x40);
    this.correspondenceDetailsForm.get('tenderNumber').setValue(this.body.values.WorkflowForm_1x4x1x39);
    this.correspondenceDetailsForm.get('corrNumber').setValue(this.body.values.WorkflowForm_1x4x1x9);
    this.correspondenceDetailsForm.get('fillinPlanPath').setValue(this.body.values.WorkflowForm_1x4x1x133);
    this.correspondenceDetailsForm.get('staffNumber').setValue(this.body.values.WorkflowForm_1x4x1x41);
    this.correspondenceDetailsForm.get('dispatchMethod').setValue({EN: this.getDefaultaValue('DispatchMethod', this.body.values.WorkflowForm_1x4x1x49)});
  }

  getDefaultaValue(Attrname: string, ID: number): string {
    if ( ID === 0 ) {
      return '';
    } else {
      let Name_EN: string;
      this.MetadataFilters.forEach(element => {
        if (element.AttrName === Attrname && element.ID === ID) {
          Name_EN = element.Name_EN;
        }
      });
      console.log(Attrname + 'ID!=0');
      console.log(ID);
      return Name_EN;
    }
  }

  setPopupCheckedValue(Attrname: string, Name_EN: string): number {
    let ID = 0;
    this.MetadataFilters.forEach(element => {
      if (element.AttrName === Attrname && element.Name_EN === Name_EN) {
        ID = element.ID;
      }
    });
    return ID;
  }

  submitCorrespondenceInfo(action: string) {
    this.makeFormObjectToSubmit();
    this.correspondenceDetailsService.submitCorrespondenceInfo(this.VolumeID, this.taskID, this.body)
    .subscribe(
      response => { action === 'SendOn' ? this.sendOnCorrespondence() : null ;
      },
      responseError => {
        this._errorHandlerFctsService.handleError(responseError).subscribe();
      }
    );
  }

  sendOnCorrespondence() {
    this.correspondenceDetailsService.sendOnCorrespondence(this.VolumeID, this.taskID)
    .subscribe(
      response => {
        console.log(response);
      },
      responseError => {
        this._errorHandlerFctsService.handleError(responseError).subscribe();
      }
    );
  }


  /*********************Transfer************************ */
  transferTabShowData() {
    this.getTransferHistoryData(this.VolumeID);
  }

  getTransferHistoryData(VolumeID: String): void {
    this.transferProgbar = true;
    this._correspondenceDetailsService.getTransferHistoryTab(VolumeID)
      .subscribe(transferhistorytabData => {
        this.transferhistorytabData = transferhistorytabData;
        this.transferProgbar = false;
      });
  }
  /************************************************************* */

  getTempFolderAttachments(CorrFlowType): void {
    this.correspondenceDetailsService.createTempAttachments(CorrFlowType).subscribe(
      tempAttachment => {
        this.corrFolderData = tempAttachment;
        this.getCoverSection();
        this.getAttachmentSection();
      }
    );
  }
  getMetadataFilters(): void {
    this.correspondencservice
      .getDashboardFilters()
      .subscribe(
        MetadataFilters => {
          this.MetadataFilters = MetadataFilters;
          console.log('this.MetadataFilters');
          console.log(this.MetadataFilters);
          this.setCorrespondenceDetails();
        }
      );
  }
  public optionSelectionChangeExternal(orgInfo: OrgNameAutoFillModel, event: MatOptionSelectionChange) {
    this.ExtSenderInfo = orgInfo;
    if (event.source.selected) {
      this.updateSenderInfo();
    }
  }
  public optionSelectionChangeInternal(DepInfo: OrgNameAutoFillModel, event: MatOptionSelectionChange) {
    this.IntRecipientInfo = DepInfo;
    if (event.source.selected) {
      this.updateRecipientInfo();
    }
  }

  updateSenderInfo() {
    this.senderDetailsForm.get('SenderName').setValue(this.ExtSenderInfo.Name_En);
    this.senderDetailsForm.get('SenderDepartment').setValue(this.ExtSenderInfo.DepName_En);
    this.body.values.WorkflowForm_1x4x1x93 = this.ExtSenderInfo.OrgID;
    this.body.values.WorkflowForm_1x4x1x80 = this.ExtSenderInfo.DepID;
    this.body.values.WorkflowForm_1x4x1x88 = this.ExtSenderInfo.Name_En;
    this.correspondenceDetailsForm.get('personalName').setValue(this.ExtSenderInfo.Name_En);
  }

  updateRecipientInfo() {
    this.recipientDetailsForm.get('RecipientName').setValue(this.IntRecipientInfo.Name_En);
    this.body.values.WorkflowForm_1x4x1x14 = this.IntRecipientInfo.SecID ? this.IntRecipientInfo.SecID : this.IntRecipientInfo.DepID;
    this.body.values.WorkflowForm_1x4x1x15 = this.IntRecipientInfo.RecipientUserID;
    this.body.values.WorkflowForm_1x4x1x16 = this.IntRecipientInfo.RecipientVersion;
    this.body.values.WorkflowForm_1x4x1x79 = this.IntRecipientInfo.Type;
    this.body.values.WorkflowForm_1x4x1x83 = this.IntRecipientInfo.DepID;
    this.body.values.WorkflowForm_1x4x1x84 = this.IntRecipientInfo.SecID;
    this.body.values.WorkflowForm_1x4x1x85 = this.IntRecipientInfo.RoleID;
  }

  displaySearchFilterValueExt(searchList: OrgNameAutoFillModel) {
    if (searchList) { return searchList.OrgName_En; }
  }

  displaySearchFilterValueInt(searchList: OrgNameAutoFillModel) {
    if (searchList) { return searchList.DepName_En + (searchList.SecName_En === null ? '' : ', ' + searchList.SecName_En); }
  }


  expandeActionRightButton() {
    this.expandedRightAction = !this.expandedRightAction;
  }
  expandeActionLeftButton() {
    this.expandedAction = !this.expandedAction;
  }
  backNavigation() {
    this._location.back();
  }

  getUserInfo() {
    this.correspondenceDetailsService
      .GetUserInformation()
      .subscribe(userInfoVal =>
        this.userInfo = userInfoVal
      );
  }
  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.correspondenceDetailsForm.invalid) {
      return;
    }
    console.log(JSON.stringify(this.correspondenceDetailsForm.value));
  }
  displayFn(attribute?: any): string | undefined {
    return attribute ? attribute.EN : undefined;
  }

  refreshCoverSection() {
    this.getCoverSection();
  }
  refreshAttachmentSection() {
    this.getAttachmentSection();
  }

  getCoverSection() {
    this.correspondenceDetailsService.getCoverFolderDetails(Number(this.correspondenceData.AttachCorrCoverID)).subscribe(
      coverFolderdetails => {
        this.externalIncCoverLetterData = coverFolderdetails;
        if (coverFolderdetails[0].myRows.length) {
          this.coverID = coverFolderdetails[0].myRows[0].Dataid;
          this.getCoverDocumentURL(this.coverID);
        }
      }
    );
  }

  getAttachmentSection() {
    this.correspondenceDetailsService.getAttachmentFolderDetails(Number(this.correspondenceData.AttachCorrAttachmentsID)).subscribe(
      attachmentFolderdetails => {this.externalAttachmentFolderData = attachmentFolderdetails;
      }
    );
  }
  getCoverDocumentURL(CoverID: String): void {
    this.showPreviewTreeArea = false;
    this.showPreviewCoverLetter = true;
    this.correspondenceDetailsService.getDocumentURL(CoverID)
      .subscribe(correspondenceCovertData => { this.documentPreviewURL = correspondenceCovertData;
      });
  }
  showActionProperties(dataID: string): void {
    this.correspondenceDetailsService.getDocumentPropertiesURL(dataID)
      .subscribe(correspondenceCovertData => this.documentPreviewURL = correspondenceCovertData);
  }

  showSenderData() {
    this.showPreviewTreeArea = true;
    this.selectedCaption = 'Sender';
    this.currentlyChecked = false;
    this.showPreviewCoverLetter = false;
    this.multiSelect = false;
    this.dataSource.data = this.organizationalChartData;
    this.CCOUID = [];
  }
  showRecipientData() {
    this.showPreviewCoverLetter = false;
    this.showPreviewTreeArea = true;
    this.selectedCaption = 'Recipient';
    this.currentlyChecked = false;
    this.showPreviewCoverLetter = false;
    this.multiSelect = false;
    this.dataSource.data = this.organizationalChartData;
    this.CCOUID = [];
  }
  showCCData() {
    this.showPreviewCoverLetter = false;
    this.showPreviewTreeArea = true;
    this.selectedCaption = 'CC';
    this.currentlyChecked = false;
    this.showPreviewCoverLetter = false;
    this.multiSelect = true;
    this.dataSource.data = this.organizationalChartData;
  }
  getOrganizationalChartDetail(): void {
    this.organizationalChartService.getOrgChartInternal()
      .subscribe(OrgChartResponse => {
        const myMap = new Map();
        for (const obj of OrgChartResponse) {
          let orgChartData: organizationalChartModel;
          orgChartData = obj;
          orgChartData.children = [];
          myMap[orgChartData.OUID] = orgChartData;
          const parent = orgChartData.Parent || '-';
          if (!myMap[parent]) {
            myMap[parent] = {
              children: []
            };
          }
          myMap[parent].children.push(orgChartData);
        }
        this.organizationalChartData = myMap['-1'].children;
        // this.treeControl.expand(this.organizationalChartData[0]);
      });
  }
  hasChild = (_number: number, node: organizationalChartModel) => !!node.children && node.children.length > 0;

  getEmplDetail(organizationalChartData: organizationalChartModel): Map<number, organizationalChartEmployeeModel[]> {
    this.showempDetails = false;
    if (this.employeeMap.has(organizationalChartData.OUID)) {
      this.showempDetails = true;
      return this.employeeMap;
    } else {
      // get the List of Employees from an OUID and add to the Map
      this.organizationalChartService.getEmployeeListFromOUID(organizationalChartData.OUID).subscribe(
        emplist => {
          this.employeeMap.set(organizationalChartData.OUID, emplist);
          this.showempDetails = true;
        }, () => { },
        () => {

        }
      );
    }
  }

  getOrgSelectDetail(organizationalChartData: organizationalChartModel) {
    this.showOrgChartData = organizationalChartData;

  }
  addRecipient() {
  }
  searchTreeValue(organizationalChartSearch: string) {
    alert(organizationalChartSearch);
  }
  getSearchValue(value: string) {
    this.value = value;
  }
  selectSinglCheckboxOrg(organizationalChartData: organizationalChartModel, e: MatCheckboxChange) {
    if (this.multiSelect) {
      if (e.checked) {
        if (this.CCOUID.lastIndexOf(organizationalChartData) === -1) {
          this.CCOUID.push(organizationalChartData);
        }
      } else {
        this.CCOUID.splice(this.CCOUID.lastIndexOf(organizationalChartData), 1);
      }
    } else {
      this.currentlyChecked = organizationalChartData;
    }
  }
  selectSinglCheckboxEmp(employeeChartData: organizationalChartEmployeeModel, e: MatCheckboxChange) {

    if (this.multiSelect) {
      if (e.checked) {
        if (this.CCEID.lastIndexOf(employeeChartData) === -1) {
          this.CCEID.push(employeeChartData);
        }
      } else {
        this.CCEID.splice(this.CCEID.lastIndexOf(employeeChartData), 1);
      }
    } else {
      this.currentlyChecked = employeeChartData;
    }

  }
  getSelectedIntDepartment() {
    if (this.selectedCaption === 'Recipient') {
      if (this.currentlyChecked.EID === undefined) {
        this.correspondenceDetailsService.searchFieldForAutoFillOUID(this.currentlyChecked.OUID, 'IntDepartmentOUID', '').subscribe(
          DepInfo => {
            this.IntRecipientInfo = DepInfo[0];
            this.recipientDetailsForm.get('RecipientDepartment').setValue(DepInfo[0]);
            this.updateRecipientInfo();
          }
        );
      } else {
        this.correspondenceDetailsService.searchFieldForAutoFillOUID(this.currentlyChecked.EID, 'IntEmployeeEID', '').subscribe(
          EmpInfo => {
            this.IntRecipientInfo = EmpInfo[0];
            this.recipientDetailsForm.get('RecipientDepartment').setValue(EmpInfo[0]);
          }
        );
      }
    } else if (this.selectedCaption === 'CC') {
      this.ccProgbar = true;
/*       this.ccDetailsForm = this.formBuilder.group({
        CCDetails: this.formBuilder.array([])
      }); */
      const orgArray = new Array();
      this.CCOUID.forEach(function (obj) {
        orgArray.push(obj.OUID);
      });

      const empArray = new Array();
      this.CCEID.forEach(function (obj) {
        empArray.push(obj.EID);
      });

      this.correspondenceDetailsService.getCCUserDetailsSet(orgArray.toString(), empArray.toString(), 'Incoming').subscribe(
        ccDepInfo => {
          for (const obj of ccDepInfo) {
            this.addCC(obj);
          }
          this.ccProgbar = false;
        }
      );
    }
  }


  uploadCSDocument(files: File[], parentID: number, sectionName: any) {
    // pick from one of the 4 styles of file uploads below
    this.csdocumentupload.uploadDocument(files, '' + parentID).subscribe(
      () => '',
      () => '',
      () => {
        if (sectionName === 'COVER') {
          this.getCoverSection();
        } else if (sectionName === 'ATTACHMENT') {
          this.getAttachmentSection();
        } else if (sectionName === 'MISC') {
        }
      }
    );
  }
  public dropped(files: NgxFileDropEntry[], parentID: string, section: string) {
    for (const droppedFile of files) {
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          this.csdocumentupload.dragandDropUpload(file, parentID).subscribe(
            () => '',
            () => '',
            () => {
              if (section === 'COVER') {
                this.getCoverSection();
              } else if (section === 'ATTACHMENT') {
                this.getAttachmentSection();
              } else if (section === 'MISC') {
                // this.GetMiscSection();
              }
            }
          );
        });
      } else {
        // It was a directory (empty directories are added, otherwise only files)
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
        // console.log(droppedFile.relativePath, fileEntry);
      }
    }
  }
  public fileOver(event) {

  }

  public fileLeave(event) {

  }

  GenerateBarcode() {

    if (this.correspondenceDetailsForm.invalid) {
      alert('Fill in Manadatory Corr Details');
    } else if (this.senderDetailsForm.invalid) {
      alert('Fill In Mandatory Sender Information');
    } else if (this.recipientDetailsForm.invalid) {
      alert('Fill In Mandatory Recipient Information');
    } else {
      this.correspondenceDetailsService.getCorredpondenceBarcode(this.corrFolderData.AttachCorrID, 'Incoming', new Date().getFullYear()).subscribe(
        barcodeVal => {
          this.correspondenceDetailsForm.get('corrNumber').setValue(barcodeVal.CorrespondenceCode);
          this.showSendOnButtons();
        }
      );
    }
  }



  getIDVal(attributeObj: any): string {
    if (typeof attributeObj === 'undefined') {
      return '';
    } else {
      return attributeObj.ID;
    }

  }
  showSendOnButtons() {
    this.showGeneratebarcodeButton = false;
    this.showSendOnButton = true;
  }

  SaveWF() {

  }

  clearDetails(clearFormName: string) {
    switch (clearFormName) {
      case 'senderDetailsForm':
        this.senderDetailsForm.get('ExternalOrganization').setValue('');
        this.senderDetailsForm.get('SenderDepartment').setValue('');
        this.senderDetailsForm.get('SenderName').setValue('');
        this.ExtSenderInfo = new OrgNameAutoFillModel();
        this.body.values.WorkflowForm_1x4x1x93 = null;
        this.body.values.WorkflowForm_1x4x1x80 = null;
        this.body.values.WorkflowForm_1x4x1x88 = '';
        this.correspondenceDetailsForm.get('personalName').setValue('');
        break;
      case 'recipientDetailsForm':
        this.recipientDetailsForm.get('RecipientName').setValue('');
        this.recipientDetailsForm.get('RecipientDepartment').setValue('');
        this.body.values.WorkflowForm_1x4x1x14 = null;
        this.body.values.WorkflowForm_1x4x1x15 = null;
        this.body.values.WorkflowForm_1x4x1x16 = null;
        this.body.values.WorkflowForm_1x4x1x79 = null;
        this.body.values.WorkflowForm_1x4x1x83 = null;
        this.body.values.WorkflowForm_1x4x1x84 = null;
        this.body.values.WorkflowForm_1x4x1x85 = null;
        this.IntRecipientInfo = new OrgNameAutoFillModel();
        break;
      default:
        break;
    }
  }
}
